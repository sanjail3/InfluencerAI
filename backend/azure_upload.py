from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient




def upload_blob(local_file_path,blob_name):
    try:
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        container_client = blob_service_client.get_container_client(container_name)

        if not container_client.exists():
            container_client.create_container()

        
        blob_client = container_client.get_blob_client(blob_name)
        with open(local_file_path, "rb") as audio_file:
            blob_client.upload_blob(audio_file, overwrite=True)
        
        print(f"File '{local_file_path}' uploaded to blob '{blob_name}' in container '{container_name}'.")
        
        final_url=f"{url}{blob_name}"
        return final_url
        
    

    except Exception as e:
        print(f"An error occurred: {e}")
