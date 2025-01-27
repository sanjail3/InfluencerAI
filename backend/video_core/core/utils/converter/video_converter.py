from moviepy.editor import *
import numpy as np
import os

class VideoConverter:
    def __init__(self):
        self.folder_path = None

    def zoom_in_out(self, t):

        return 1.3 + 0.3 * np.sin(t / 3)

    def get_font_list(self):

        font_list = TextClip.list("font")
        return font_list

    def create_text_clips(self, subtitles, subtitle_options):
        # cat /etc/ImageMagick-6/policy.xml | sed 's/none/read,write/g'> /etc/ImageMagick-6/policy.xml
        # we need to execute this command
        # we will use subprocess module to execute this command
        import subprocess

        subprocess.call(
            "cat /etc/ImageMagick-6/policy.xml | sed 's/none/read,write/g'> /etc/ImageMagick-6/policy.xml",
            shell=True,
        )


        font_size = subtitle_options.get("font_size", 40)
        font_color = subtitle_options.get("font_color", "yellow")
        font = subtitle_options.get("font", "./static/fonts/Corben-Bold.ttf")
        stroke_width = subtitle_options.get("stroke_width", 0)
        stroke_color = subtitle_options.get("stroke_color", "black")
        positionX = subtitle_options.get("positionX", "center")
        positionY = subtitle_options.get("positionY", "center")
        clips = []
        for word in subtitles:
            word_text = word["word"]
            word_start = word["start"]
            word_end = word["end"]
            word_duration = word_end - word_start

            clip = TextClip(
                word_text,
                fontsize=font_size,
                color=font_color,
                method="caption",
                font=font,
            )
            clip = clip.set_start(word_start).set_end(word_end)
            print(clip.start, clip.end)
            clip = clip.set_position((positionX, positionY))

            clips.append(clip)

        return clips

    def create_video(
        self,
        folder_path,
        subtitles=None,
        subtitle_options={},
        output_file="video.mp4",
    ):

        self.folder_path = folder_path
        image_folder = os.path.join(self.folder_path, "images")
        image_files = sorted(
            [
                os.path.join(image_folder, img)
                for img in os.listdir(image_folder)
                if img.endswith(".png")
            ]
        )
        audio_file = os.path.join(self.folder_path, "voice.mp3")

        # Check if audio file exists
        if not os.path.exists(audio_file):
            print(f"Audio file {audio_file} does not exist.")
            return

        # Load audio file
        audio = AudioFileClip(audio_file)
        audio_duration = audio.duration

        # Check if audio duration is valid
        if audio_duration is None:
            print("Could not determine audio duration.")
            return

        # Calculate duration for each image
        image_duration = audio_duration / len(image_files)

        clips = []
        height = 1280
        width = 720
        # height = 480
        # width = 270
        # if width % 2 != 0:
        #     width = width - 1
        # width = int(width)
        print(width, height)
        for i in range(len(image_files)):
            print("processing image", i)
            clip = ImageClip(image_files[i]).set_duration(image_duration)
            clip = clip.resize((width, height))
            clip = clip.resize(self.zoom_in_out)
            clips.append(clip)

        print("concatenating")
        video_clip = concatenate_videoclips(clips, method="compose")
        video_clip = video_clip.set_audio(audio)
        # final_video.write_videofile(output_file, fps=30, threads=8, audio=True, codec='libx264')

        # print("adding subtitles")
        # text_clips = self.create_text_clips(subtitles, subtitle_options)
        # print("adding text clips")
        # video_clip = CompositeVideoClip([video_clip] + text_clips)
        print(video_clip.duration)
        print("writing")
        video_clip.write_videofile(
            os.path.join(self.folder_path, output_file),
            fps=24,
            threads=8,
            audio=True,
            codec="libx264",
            audio_codec="aac",
        )

        return os.path.join(self.folder_path, output_file)

if __name__ == "__main__":
    video_converter = VideoConverter()
    folder="D:\VideoGPT-master\contents"

    video_converter.create_video(folder_path=folder)


