# app/routers/upload.py

from fastapi import APIRouter, UploadFile, Form
from fastapi.responses import JSONResponse
import pandas as pd
import os, json
from app.utils.file_ops import save_file
from app.core.config import RAW_DATA_DIR

router = APIRouter()

@router.post("/upload")
async def upload_dataset(file: UploadFile, target_column: str = Form(...)):
    try:
        # Save file to disk
        file_path = save_file(file, RAW_DATA_DIR)

        # Read CSV
        df = pd.read_csv(file_path)

        if target_column not in df.columns:
            return JSONResponse(status_code=400, content={"error": f"Target column '{target_column}' not found in dataset."})

        metadata = {
            "columns": df.columns.tolist(),
            "target": target_column,
            "missing_values": df.isnull().sum().to_dict(),
            "dtypes": df.dtypes.astype(str).to_dict(),
            "sample_data": df.head(5).to_dict(orient="records")
        }

        session_dir = "session"
        os.makedirs(session_dir, exist_ok=True)
        
        # Save session info for later steps
        session_info = {
            "file_name": file.filename,
            "target_column": target_column
        }
        with open("session/last_upload.json", "w") as f:
            json.dump(session_info, f)


        return metadata

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
