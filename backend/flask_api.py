
from flask import Flask, request, jsonify
from selenium import webdriver
import asyncio
import base64
import io
from typing import Dict, Any, Tuple
from crawl4ai import AsyncWebCrawler
from crawl4ai.extraction_strategy import LLMExtractionStrategy
from pydantic import BaseModel, Field
import json
from datetime import datetime
from cachetools import TTLCache
from PIL import Image
from script_writer import ScriptGenerator,ScriptConfig,AdScriptResponse
from flask_cors import CORS
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient 
import os
from enum import Enum
import requests

from flask import Flask, request, jsonify
from azure.storage.blob import BlobServiceClient
import replicate
import requests
import logging
import os
import json
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from moviepy.editor import *
import asyncio
from functools import partial
from concurrent.futures import ThreadPoolExecutor
import tempfile
import cv2
import moviepy.editor as mpe
from moviepy.editor import VideoFileClip, CompositeVideoClip, vfx
from moviepy.video.fx.all import resize, mask_color
import numpy as np

app = Flask(__name__)

CORS(app)


AZURE_CONNECTION_STRING = os.getenv("AZURE_CONNECTION_STRING")
AZURE_CONTAINER_NAME = os.getenv("AZURE_CONTAINER_NAME")
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
AZURE_STORAGE_ACCOUNT_URL=os.getenv("AZURE_STORAGE_ACCOUNT_URL")
container_name = "video-gpt"

screenshot_cache = TTLCache(maxsize=100, ttl=3600)
info_cache = TTLCache(maxsize=100, ttl=3600)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class InformationResponse(BaseModel):
    product_name: str = Field(..., description="The name of the product")
    product_description: str = Field(..., description="Brief description of the product and what it does")
    problem_their_solving: str = Field(..., description="What problem it solves and how it solves it")
    unique_selling_point: str = Field(..., description="The unique selling point of the product")
    features: str = Field(..., description="The features of the product")
    customer_reviews: str = Field(..., description="The customer reviews of the product and their testimonials")
    pricing: str = Field(..., description="The various pricing plans of the product")

class AvatarEnum(Enum):
    """
    Enum to map avatar IDs with their names and genders.
    """
    MAYA = {"id": "001", "name": "Maya", "gender": "female"}
    ISABELLA = {"id": "002", "name": "isabella", "gender": "female"}
    SARA  = {"id": "003", "name": "Sara", "gender": "female"}
    EMMA = {"id": "004", "name": "Emma", "gender": "female"}
    RYAN = {"id": "005", "name": "Ryan", "gender": "male"}
    ANANYA = {"id": "006", "name": "Ananya", "gender": "female"}
    SOPHIA = {"id": "007", "name": "Sophia", "gender": "female"}
    ABI = {"id": "008", "name": "Abi", "gender": "female"}
    LEO = {"id": "009", "name": "Leo", "gender": "male"}
    JAMES = {"id": "010", "name": "James", "gender": "male"}

class AzureBlobStorage:
    def __init__(self):
        self.blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        self.container_client = self.blob_service_client.get_container_client(container_name)

    def upload_file(self, file_path: str, blob_name: str) -> str:
        with open(file_path, "rb") as data:
            self.container_client.upload_blob(name=blob_name, data=data, overwrite=True)
        return self.container_client.url + "/" + blob_name
    def get_avatar_video_url(self, avatar_id: str, bg_type: str) -> str:
        blob_name = f"avatars_1/{bg_type}/{avatar_id}.mov"
        return self.container_client.url + "/" + blob_name

    def list_avatar_videos(self, bg_type: str) -> list:
        
        blob_prefix = f"avatars_1/{bg_type}/"
        avatars = []

        blobs = self.container_client.list_blobs(name_starts_with=blob_prefix)
        for blob in blobs:
            blob_name = blob.name.split("/")[-1]  # Extract the file name
            avatar_id = blob_name.split(".")[0]  # Extract the avatar ID
            avatars.append({
                "id": avatar_id,
                "preview_url": f"{self.container_client.url}/{blob.name}"
            })

        return avatars
azure_storage=AzureBlobStorage()
class ProductInfoExtractor:
    @staticmethod
    async def extract_product_info(url: str, api_token: str) -> Dict[str, Any]:
        # Check cache first
        cache_key = f"info_{url}"
        if cache_key in info_cache:
            return info_cache[cache_key]

        async with AsyncWebCrawler(verbose=True) as crawler:
            result = await crawler.arun(
                url=url,
                word_count_threshold=1,
                extraction_strategy=LLMExtractionStrategy(
                    provider="openai/gpt-4o",
                    api_token=api_token,
                    schema=InformationResponse.model_json_schema(),
                    extraction_type="schema",
                    instruction="From the crawled content, extract all the product information. "
                              "Extract the required content in a structured JSON format."
                ),
                bypass_cache=True,
            )
            
            info = json.loads(result.extracted_content)
            info_cache[cache_key] = info
            return info

def capture_screenshot_as_base64(url: str, width: int = 1080, height: int = 2000) -> Tuple[str, str]:
    """
    Capture screenshot and return as base64 string with image dimensions
    """
    # Check cache first
    cache_key = f"screenshot_{url}"
    if cache_key in screenshot_cache:
        return screenshot_cache[cache_key]

    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument(f"--window-size={width},{height}")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(url)
    
    # Allow page to load
    driver.implicitly_wait(2)
    
    # Capture screenshot
    png_data = driver.get_screenshot_as_png()
    driver.quit()
    
    # Optimize image size
    img = Image.open(io.BytesIO(png_data))
    img = img.convert('RGB')  # Convert to RGB to reduce size
    
    # Resize if image is too large
    max_dimension = 1920
    if img.width > max_dimension or img.height > max_dimension:
        ratio = min(max_dimension/img.width, max_dimension/img.height)
        new_size = (int(img.width * ratio), int(img.height * ratio))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    
    buffer = io.BytesIO()
    img.save(buffer, format='JPEG', quality=85, optimize=True)
    base64_image = base64.b64encode(buffer.getvalue()).decode()
    
    dimensions = {'width': img.width, 'height': img.height}
    result = (base64_image, dimensions)
    

    screenshot_cache[cache_key] = result
    
    return result

@app.route('/information_extractor', methods=['POST'])
async def extract_information():
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({
                "error": "Missing required parameters. Please provide 'url' and 'api_token'"
            }), 400

        # Create event loop for async operations
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        # Extract product information and capture screenshot concurrently
        product_info = await ProductInfoExtractor.extract_product_info(url, api_token)
        base64_screenshot, dimensions = capture_screenshot_as_base64(url)
        
        response = {
            "product_information": product_info,
            "screenshot": {
                "data": f"data:image/jpeg;base64,{base64_screenshot}",
                "dimensions": dimensions
            }
        }
        
        return jsonify(response), 200

    except Exception as e:
        return jsonify({
            "error": f"An error occurred: {str(e)}"
        }), 500

@app.route('/generate_scripts', methods=['POST'])
async def generate_scripts():
    try:
        data = request.get_json()
        config = ScriptConfig(
            duration=data.get('duration', 30),
            language=data.get('language', 'English'),
            tone=data.get('tone', 'professional'),
            target_audience=data.get('target_audience', 'general')
        )
        
        product_info = data.get('product_info')
        if not product_info:
            return jsonify({
                "error": "Missing product information"
            }), 400

       
        generator = ScriptGenerator()
        scripts_response = generator.generate_scripts(product_info, config)
        
        return jsonify({
            "scripts": scripts_response.dict()['scripts']
        }), 200

    except Exception as e:
        return jsonify({
            "error": f"An error occurred: {str(e)}"
        }), 500


@app.route('/get_voices', methods=['GET'])
def get_voices():
    """
    Flask endpoint to fetch a list of all available voices for a user.

    Query Parameters:
        api_key (str): Your Eleven Labs API key (required).
        show_legacy (bool): Whether to include legacy premade voices in the response (optional, default is False).

    Returns:
        JSON: A list of voices or an error message.
    """
    api_key = os.getenv("ELEVEN_API_KEY")
    if not api_key:
        return jsonify({"error": "API key is required"}), 400

    show_legacy = request.args.get('show_legacy', 'false').lower() == 'true'

    url = "https://api.elevenlabs.io/v1/voices"
    headers = {
        "xi-api-key": api_key
    }
    params = {
        "show_legacy": str(show_legacy).lower()  # Convert boolean to lowercase string ('true' or 'false')
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)
        voices_data = response.json().get("voices", [])

        formatted_voices = [
            {
                "voice_id": voice["voice_id"],
                "name": voice["name"],
                "accent": voice["labels"].get("accent", "unknown"),
                "description": voice["labels"].get("description", "unknown"),
                "age": voice["labels"].get("age", "unknown"),
                "gender": voice["labels"].get("gender", "unknown"),
                "use_case": voice["labels"].get("use_case", "unknown"),
                "preview_url": voice.get("preview_url", "N/A")
            }
            for voice in voices_data
        ]

        return jsonify({"voices": formatted_voices})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_creators", methods=["GET"])
def get_creators():
    """
    Flask route to retrieve a list of creators with details mapped from Azure Blob Storage and AvatarEnum.

    Returns:
        JSON: A list of creators with their details.
    """
    bg_type = request.args.get("bg_type", "with_bg")  # Default to 'with_bg'
    blob_avatars = azure_storage.list_avatar_videos(bg_type)
    creators = []

    for blob_avatar in blob_avatars:
        avatar_id = blob_avatar["id"]
        preview_url = blob_avatar["preview_url"]

        # Map the avatar to AvatarEnum if present, otherwise use defaults
        matching_avatar = next(
            (avatar for avatar in AvatarEnum if avatar.value["id"] == avatar_id),
            None
        )

        if matching_avatar:
            creator = {
                "id": avatar_id,
                "name": matching_avatar.value["name"],
                "gender": matching_avatar.value["gender"],
                "description": "AI UGC Creator",
                "preview_url": preview_url
            }
        else:
            creator = {
                "id": avatar_id,
                "name": avatar_id.capitalize(),  # Default name
                "gender": "unknown", 
                "description": "unknown",
                "preview_url": preview_url
            }

        creators.append(creator)

    return jsonify(creators)

class VoiceConfig(BaseModel):
    voice_id: str
    output_format: str = "mp3_44100_128"
    model_id: str = "eleven_multilingual_v2"

class AvatarConfig(BaseModel):
    avatar_id: str
    background_type: str = "with_bg"  # or "without_bg"

class VideoConfig(BaseModel):
    duration: int = 30
    fps: int = 30
    background_color: str = "white"

class ProductionConfig(BaseModel):
    voice: VoiceConfig
    avatar: AvatarConfig
    video: VideoConfig
    screenshot_path: str
    script: str



# Video Processing Pipeline
class VideoProcessor:
    def __init__(self):
        self.storage = AzureBlobStorage()
        self.executor = ThreadPoolExecutor(max_workers=3)

    async def text_to_speech(self, text: str, voice_config: VoiceConfig) -> str:
        from elevenlabs import play
        from elevenlabs.client import ElevenLabs

        client = ElevenLabs(
        api_key="sk_28f88a4d31a932f315563035badca0118152c60c475797bf", # Defaults to ELEVEN_API_KEY or ELEVENLABS_API_KEY
        )

        
                
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_file:
                output_path = temp_file.name
                logger.info(f"Creating temporary audio file: {output_path}")
                try:
                    response = client.text_to_speech.convert(
                        voice_id=voice_config.voice_id,
                        output_format="mp3_44100_128",
                        text=text,
                        model_id= "eleven_multilingual_v2",

                        
                    )
                    with open(output_path, "wb") as f:
                        for chunk in response:
                            if chunk:
                                f.write(chunk)
                    print(f"Audio saved to {output_path}")
                    
                    blob_name = f"audio_generated/{os.path.basename(output_path)}"
                    print(f"Audio saved to {output_path}")
                    return self.storage.upload_file(output_path, blob_name)

                except Exception as e:
                    print(f"Error generating audio: {e}")

       
        

    async def create_background_video(self, screenshot_path: str, config: VideoConfig) -> str:
        def _process_video():
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_file:
                output_path = temp_file.name
                clip = (ImageClip(screenshot_path)
                       .set_duration(config.duration))
                clip.write_videofile(output_path, codec="libx264", 
                                   audio_codec="aac", fps=config.fps)
                return output_path

        # Run in thread pool
        output_path = await asyncio.get_event_loop().run_in_executor(
            self.executor, _process_video)
        
        # Upload to blob storage
        blob_name = f"background_videos/{os.path.basename(output_path)}"
        self.storage.upload_file(output_path, blob_name)
        return output_path 

    async def lipsync_video(self, video_url: str, audio_url: str) -> str:
        output = replicate.run(
            "skytells-research/lipsync:968cd240f3099f8b8025c3762cd13912e35608dfac03b868525a2f312c409407",
            input={
                "face": video_url,
                "audio": audio_url,
                "fps": 25,
                "pads": "0 10 0 0",
                "smooth": True,
                "resize_factor": 0
            }
        )
        response = requests.get(output, stream=True)
        with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_file:
                output_path = temp_file.name
                if response.status_code == 200:
                    with open(output_path, "wb") as file:
                        
                        for chunk in response.iter_content(chunk_size=8192): 
                            if chunk:
                                file.write(chunk)

                    print(f"Video downloaded and saved as {output_path}")
        return output_path

    async def create_final_video(self, 
                               lipsync_with_bg: str, 
                               lipsync_without_bg: str, 
                               background_video: str) -> str:
        def _process_video():
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_file:
                output_path = temp_file.name
                reel_clip = mpe.VideoFileClip(background_video)
                avatar_with_bg = mpe.VideoFileClip(lipsync_with_bg)
                avatar_without_bg = mpe.VideoFileClip(lipsync_without_bg, has_mask=True)
                avatar_without_bg = avatar_without_bg.fx(mask_color, color=[0, 128, 0], thr=50, s=5)

                # Duration splits
                total_duration = avatar_with_bg.duration
                intro_duration = max(5, min(total_duration * 0.25, 15))  # 1/4 duration, capped at 5-15s
                end_duration = intro_duration
                product_demo_duration = total_duration - (intro_duration + end_duration)

                # Video dimensions
                W, H = 1080, 1920
                position = 'right'

                # ----------------------------------------
                # 1. Intro: Avatar with Background
                # ----------------------------------------
                avatar_intro = (avatar_with_bg
                                .subclip(0, intro_duration)
                                .resize(width=W)  # Full width, no zoom
                                .set_position(('center', 'center')))

                reel_demo = reel_clip.subclip(0, product_demo_duration).fadein(1)

                # ----------------------------------------
                # 2. Faster Transition to Bottom-Right (1-2s) - Without Background
                # ----------------------------------------
                x_pos = W * 0.40 if position == 'right' else W * 0.04

                avatar_transition = (avatar_without_bg
                                    .subclip(intro_duration, intro_duration + 2)
                                    .resize(width=W * 0.7)  # Slightly larger during transition
                                    .set_position(lambda t: (x_pos, H * 0.7)))

                

                avatar_side = (avatar_without_bg
                            .subclip(intro_duration, intro_duration + product_demo_duration)
                            .resize(width=W * 0.5)  # Larger avatar size for product demo
                            .set_position(lambda t: (x_pos, H * 0.5)))

                # ----------------------------------------
                # 4. End Card: Avatar with Background
                # ----------------------------------------
                avatar_end = (avatar_with_bg
                            .subclip(total_duration - end_duration, total_duration)
                            .resize(width=W)  # Full width, no zoom
                            .set_position(('center', 'center')))

               
                final_clip = CompositeVideoClip([
                    # reel_intro,  # Intro Reel
                    avatar_intro,  # Full-screen Avatar Intro (With Background)
                    avatar_transition.set_start(intro_duration),  # Fast Transition
                    reel_demo.set_start(intro_duration),  # Product Demo (Reel Content)
                    avatar_side.set_start(intro_duration),  # Larger Side Avatar (Without Background)
                    # reel_end.set_start(total_duration - end_duration),  # End Reel
                    avatar_end.set_start(total_duration - end_duration)  # End Full-Screen Avatar (With Background)
                ], size=(W, H))

                # Export Final Video
                final_clip.write_videofile(
                output_path,
                fps=30,
                remove_temp=True,
                codec="libx264",
                audio_codec="aac",
                threads=6,
                bitrate="8000k",  # Increase video bitrate for high quality
                ffmpeg_params=["-crf", "18", "-preset", "slow"]  # High-quality export
            )
               
            return output_path

        # Run in thread pool
        local_output_path = await asyncio.get_event_loop().run_in_executor(
            self.executor, _process_video)

        blob_name = f"generated_videos/{os.path.basename(local_output_path)}"
        return self.storage.upload_file(local_output_path, blob_name)
    

# API Routes


@app.route('/api/generate-video', methods=['POST'])
async def generate_video():
    try:
        data = request.get_json()
        base64_screenshot = data['screenshot_path']
        
        # Clean and process the base64 string
        try:
            # Remove whitespace
            base64_screenshot = base64_screenshot.strip()
            
            # Extract the actual base64 data after the comma
            if "data:" in base64_screenshot and ";base64," in base64_screenshot:
                base64_screenshot = base64_screenshot.split(";base64,")[1]
            
            # Remove any non-base64 characters
            base64_screenshot = ''.join(c for c in base64_screenshot 
                if c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=')
            
            # Add padding if needed
            padding_needed = len(base64_screenshot) % 4
            if padding_needed:
                base64_screenshot += '=' * (4 - padding_needed)
            
            # Decode the base64 string
            img_data = base64.b64decode(base64_screenshot)
            
            # Create a temporary file with a proper path
            with tempfile.NamedTemporaryFile(suffix='.jpeg', delete=False) as temp_img:
                temp_img_path = temp_img.name
                temp_img.write(img_data)
            
            # Update the config with the temporary file path
            config_data = {
                **data,
                'screenshot_path': temp_img_path  # Use the proper temporary file path
            }
            config = ProductionConfig(**config_data)
            config.voice.voice_id =  "cgSgspJ2msm6clMCkdW9"
            config.avatar.avatar_id = "002"
            
            # Rest of your video processing code
            processor = VideoProcessor()
            storage = AzureBlobStorage()
            
            logger.info("Generating audio from script...")
            audio_url = await processor.text_to_speech(config.script, config.voice)
            
            logger.info("Getting avatar videos...")
            avatar_with_bg = storage.get_avatar_video_url(
                config.avatar.avatar_id, "with_bg")
            avatar_without_bg = storage.get_avatar_video_url(
                config.avatar.avatar_id, "without_bg")
            
            logger.info("Creating background video...")
            background_video = await processor.create_background_video(
                temp_img_path,  # Use the temporary file path here
                config.video
            )
            
            logger.info("Generating lipsync videos...")
            lipsync_tasks = [
                processor.lipsync_video(avatar_with_bg, audio_url),
                processor.lipsync_video(avatar_without_bg, audio_url)
            ]
            lipsync_with_bg, lipsync_without_bg = await asyncio.gather(*lipsync_tasks)
            
            logger.info("Creating final video...")
            final_video_url = await processor.create_final_video(
                lipsync_with_bg, lipsync_without_bg, background_video)
            
            # Clean up the temporary file
            os.unlink(temp_img_path)
            
            return jsonify({
                "status": "success",
                "video_url": final_video_url
            })
            
        except Exception as e:
            raise ValueError(f"Error processing base64 image: {str(e)}")
            
    except Exception as e:
        logger.error(f"Error generating video: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)