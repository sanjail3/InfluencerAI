GENERATE_VIDEO_FROM_TOPIC = {
    "template": """- you are a professional content creator and you need to write a video script on the following notes: {topic} , script should be {duration} long dont go beyond limit and it should be engaging
    - script should be in {language} language
    - strictly follow the this syntax:
    - SYNTAX:{syntax}
    - use double quotes for the keys and values for json so that we can parse it easily
    - number of parts should be based on number of images which is {num_of_images}.
    - you can add details from your own knowledge
    - be creative
    - keep the tone of the script {tone}
    - return only the script nothing else just the script
    - this video should go viral on youtube shorts and tiktok
    - give just the script that i can directly pass to text to speech no voice effect no background just the voiceover
    - dont add any sound effects or background music just plain text
    - image prompts should be very very descriptive more than 50 words you should describe each and every aspect of image details
    -ex image prompt- Vibrant, impressionistic painting featuring a winding path through a forest. The layout is horizontal, with the path curving from the bottom center to the upper right. The subject is a solitary figure walking along the path, surrounded by tall trees. The ground reflects the colors of the leaves, suggesting a glistening wet surface, possibly after rain. The sky is a gradient of blue hues, adding depth to the scene. The painting uses thick, textured brushstrokes, giving it a three-dimensional feel. The overall mood is serene and contemplative.
    -your image prompt should descibe each and ever scene and high quality 
    - also keep in mind following instructions:
    INSTUCTIONS:{instructions}""",
    "input_variables": [
        "topic",
        "duration",
        "tone",
        "instructions",
        "language",
        "num_of_images",
        "syntax",
    ],
}
