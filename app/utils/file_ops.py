# app/utils/file_ops.py

import os
import shutil
from fastapi import UploadFile

def save_file(file: UploadFile, folder_path: str) -> str:
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(folder_path, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return file_path
