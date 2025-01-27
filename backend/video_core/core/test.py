from utils.AI.audioAI import AudioAI
import os
# from utils.converter.video_converter import VideoConverter
from VideoGPT.core.video_generator import VideoGenerator
import tempfile
import os
from moviepy.editor import *

temp_dir = tempfile.TemporaryDirectory()

video_generator=VideoGenerator()
script_parts={"hi I am Sanjai who are you"}




# audio_path = "audio\\voice.mp3"
#
# video_generator.generate_audio(
#                             output_file=audio_path,
#                             script_parts=script_parts,
#
#
folder_path="C:\\Users\\sanjai\\AppData\\Local\\Temp\\tmpd6sfff2n"
audio_path = os.path.join(folder_path, "voice.mp3")

audio = AudioFileClip(audio_path)
print(audio)
audio_duration = audio.duration

print(audio_duration)

# Check if audio duration is valid
if audio_duration is None:
    print("Could not determine audio duration.")




# import requests
#
# response = requests.post(
#     f"https://api.stability.ai/v2beta/stable-image/generate/ultra",
#     headers={
#         "authorization": f"Bearer sk-ubJbqGrIBKSc4do0QKfQzyFezthodt1hBCak9cmOP0KwNZgq",
#         "accept": "image/*"
#     },
#     files={"none": ''},
#     data={
#         "prompt": "Explore the cursed graveyard, where tombstones stand tall and whispers of the dead fill the night air.', 'image': 'Desolate graveyard with crumbling tombstones and eerie mist.",
#         "output_format": "webp",
#     },
# )
#
# if response.status_code == 200:
#     with open("./lighthouse.webp", 'wb') as file:
#         file.write(response.content)
# else:
#     raise Exception(str(response.json()))