import os
from dotenv import load_dotenv
import openai
from langchain.llms import OpenAI
import requests
load_dotenv()

class ImageAI:
    def __init__(self, api_key, model_name="dall-e-3"):
        self.api_key = api_key
        self.model_name = "dall-e-3"
        openai.api_key = self.api_key

    def generate(self, prompt, output_file="image.png"):
        try:
            response = openai.Image.create(
                prompt=prompt,
                n=1,
                size="1024x1792",
                model="dall-e-3"
            )
            image_url = response['data'][0]['url']

            # Download the image from the URL
            image_data = requests.get(image_url).content

            with open(output_file, "wb") as f:
                f.write(image_data)

            print(f"Image saved to {output_file}")

        except Exception as e:
            print(f"Error generating image: {e}")

if __name__ == "__main__":
    api_key = os.getenv("OPENAI_API_KEY")
    image_ai = ImageAI(api_key=api_key)
    image_ai.generate(prompt="A futuristic city skyline at sunset", output_file="image1.png")
