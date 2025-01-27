import os
from dotenv import load_dotenv
import edge_tts

load_dotenv()

class AudioAI:
    def __init__(self, output_format="audio/wav", voice="en-US-AriaNeural"):
        self.output_format = output_format
        self.voice = voice

    async def generate(self, prompt, output_file="audio.wav"):
        try:
            communicate = edge_tts.Communicate(prompt, self.voice)
            with open(output_file, "wb") as audio_file:
                async for data in communicate.stream():
                    if data["type"] == "audio":
                        audio_file.write(data["data"])

            print(f"Audio saved to {output_file}")

        except Exception as e:
            print(f"Error generating audio: {e}")

if __name__ == "__main__":
    import asyncio
    audio_ai = AudioAI()
    asyncio.run(audio_ai.generate(prompt="The weather is very good today. Let's go to the beach.", output_file="audio/audio1.wav"))
