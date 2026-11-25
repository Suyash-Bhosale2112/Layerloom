import os
import shutil
import urllib.request
import zipfile

def install_node():
    dest_dir = os.path.join(os.environ['LOCALAPPDATA'], 'Programs', 'nodejs')
    os.makedirs(dest_dir, exist_ok=True)
    
    zip_path = os.path.join(os.environ['TEMP'], 'node-win-x64.zip')
    url = 'https://nodejs.org/dist/v22.14.0/node-v22.14.0-win-x64.zip'
    
    print(f"Downloading Node.js standalone from {url}...")
    urllib.request.urlretrieve(url, zip_path)
    print("Download complete. Extracting files...")
    
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(os.environ['TEMP'])
        
    extracted_folder = os.path.join(os.environ['TEMP'], 'node-v22.14.0-win-x64')
    for item in os.listdir(extracted_folder):
        src = os.path.join(extracted_folder, item)
        dst = os.path.join(dest_dir, item)
        if os.path.isdir(src):
            if os.path.exists(dst):
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
        else:
            shutil.copy2(src, dst)
            
    print(f"Node.js successfully installed to: {dest_dir}")

if __name__ == "__main__":
    install_node()
