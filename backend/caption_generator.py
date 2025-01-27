import os
import json
from dataclasses import dataclass
from typing import List, Callable
from moviepy.editor import *
from faster_whisper import WhisperModel
from PIL import Image, ImageFilter, ImageFont
import numpy as np

@dataclass
class Token:
    text: str
    start_ms: float
    end_ms: float

@dataclass
class Caption:
    text: str
    start_ms: float
    duration_ms: float
    tokens: List[Token]

class StyledVideoCaptioner:
    def __init__(self, model_name: str = "medium", device: str = "cpu"):
        self.model = WhisperModel(model_name, device=device)
        self.font_size = 130
        self.font_color = "yellow"
        self.font_family = "fonts/Montserrat-ExtraBold.ttf"
        self.stroke_width = 3
        self.stroke_color = "black"
        self.highlight_color = "red"
        self.shadow_blur = 0.1
        self.shadow_strength = 1.0
        self.padding = 50
        self.line_count = 3
        self.video_width = 1080
        self.video_height = 1920

    def parse_segments(self, segments, fit_function: Callable, allow_partial_sentences: bool = False):
        processed_segments = []
        
        for segment in segments:
            words = segment.text.strip().split()
            if not words:
                continue

            word_duration = (segment.end - segment.start) / len(words)
            formatted_words = []
            for i, word in enumerate(words):
                start = segment.start + i * word_duration
                end = start + word_duration
                prefix = " " if i > 0 else ""
                formatted_words.append({
                    "word": f"{prefix}{word}",
                    "start": start,
                    "end": end
                })
            
            processed_segments.append({"words": formatted_words})

        # Merge words without space separation
        for seg in processed_segments:
            words = seg["words"]
            i = 0
            while i < len(words):
                if i > 0 and not words[i]["word"].startswith(" "):
                    words[i-1]["word"] += words[i]["word"].lstrip()
                    words[i-1]["end"] = words[i]["end"]
                    del words[i]
                else:
                    i += 1

        # Build captions
        captions = []
        current_caption = {"start": None, "end": 0.0, "words": [], "text": ""}

        for seg in processed_segments:
            for word in seg["words"]:
                if current_caption["start"] is None:
                    current_caption["start"] = word["start"]

                proposed_text = current_caption["text"] + word["word"]
                sentence_valid = allow_partial_sentences or not self.has_partial_sentence(proposed_text)
                fits = sentence_valid and fit_function(proposed_text)

                if fits:
                    current_caption["words"].append(word)
                    current_caption["end"] = word["end"]
                    current_caption["text"] = proposed_text
                else:
                    if current_caption["text"]:
                        captions.append(current_caption)
                    current_caption = {
                        "start": word["start"],
                        "end": word["end"],
                        "words": [word],
                        "text": word["word"]
                    }

        if current_caption["text"]:
            captions.append(current_caption)

        return captions

    def has_partial_sentence(self, text: str) -> bool:
        return not any(text.endswith(punc) for punc in ['.', '!', '?', ',', ';', ':'])

    def generate_captions(self, audio_path: str, output_json="captions.json") -> List[Caption]:
        if os.path.exists(output_json):
            with open(output_json, 'r') as f:
                data = json.load(f)
                return [Caption(
                    text=c["text"],
                    start_ms=c["start_ms"],
                    duration_ms=c["duration_ms"],
                    tokens=[Token(**t) for t in c["tokens"]]
                ) for c in data]

        segments, _ = self.model.transcribe(audio_path, language="en")
        
        def fit_function(text):
            text_width = self.get_text_size(text)[0]
            return text_width <= (self.video_width - self.padding * 2)

        captions_data = self.parse_segments(
            segments,
            fit_function=fit_function,
            allow_partial_sentences=False
        )

        captions = []
        for cap in captions_data:
            tokens = [
                Token(
                    text=w["word"].strip(),
                    start_ms=w["start"] * 1000,
                    end_ms=w["end"] * 1000
                ) for w in cap["words"]
            ]
            captions.append(Caption(
                text=cap["text"].strip(),
                start_ms=cap["start"] * 1000,
                duration_ms=(cap["end"] - cap["start"]) * 1000,
                tokens=tokens
            ))

        with open(output_json, 'w') as f:
            json.dump([{
                "text": c.text,
                "start_ms": c.start_ms,
                "duration_ms": c.duration_ms,
                "tokens": [{"text": t.text, "start_ms": t.start_ms, "end_ms": t.end_ms} for t in c.tokens]
            } for c in captions], f, indent=2)
        
        return captions

    def get_text_size(self, text: str):
        font = ImageFont.truetype(self.font_family, self.font_size)
        text_width = font.getlength(text)
        text_height = font.size
        return (text_width, text_height)

    def create_text_clip(self, text: str, color: str, stroke_color: str):
        return TextClip(
            text,
            fontsize=self.font_size,
            color=color,
            font=self.font_family,
            stroke_color=stroke_color,
            stroke_width=self.stroke_width
        )

    def create_shadow(self, text: str):
        shadow = self.create_text_clip(text, "black", "black")
        shadow = shadow.set_opacity(0.5)
        return shadow.resize(lambda t: 1 + self.shadow_blur * t)

    def create_captioned_video(self, video_path: str, captions_json: str, output_path: str):
        video = VideoFileClip(video_path)
        self.video_width = video.w
        self.video_height = video.h

        with open(captions_json, 'r') as f:
            captions = [Caption(
                text=c["text"],
                start_ms=c["start_ms"],
                duration_ms=c["duration_ms"],
                tokens=[Token(**t) for t in c["tokens"]]
            ) for c in json.load(f)]

        clips = [video]
        text_y_position = self.video_height // 1.5

        for caption in captions:
            caption_duration = caption.duration_ms / 1000
            start_time = caption.start_ms / 1000

            # Create shadow
            shadow = self.create_shadow(caption.text)
            shadow = shadow.set_position(("center", text_y_position))
            shadow = shadow.set_start(start_time).set_duration(caption_duration)
            clips.append(shadow)

            # Create text
            text_clip = self.create_text_clip(caption.text, self.font_color, self.stroke_color)
            text_clip = text_clip.set_position(("center", text_y_position))
            text_clip = text_clip.set_start(start_time).set_duration(caption_duration)
            clips.append(text_clip)

        final_video = CompositeVideoClip(clips, size=video.size)
        final_video.write_videofile(
            output_path,
            codec="libx264",
            audio_codec="aac",
            fps=video.fps,
            threads=4
        )
        final_video.close()
        video.close()

def process_video(input_path: str, audio_path: str, output_path: str = None):
    output_path = output_path or input_path.rsplit('.', 1)[0] + '_styled.mp4'
    captioner = StyledVideoCaptioner()
    captions_json = "styled_captions.json"
    captioner.generate_captions(audio_path, captions_json)
    captioner.create_captioned_video(input_path, captions_json, output_path)



if __name__ == "__main__":
    process_video(r"C:\Users\sanjai\Downloads\result (1).mp4", "audio1.wav", "output_captioned_video.mp4")