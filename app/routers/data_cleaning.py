# app/routers/data_cleaning.py

from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse
import pandas as pd
import os
import json
from app.core.config import RAW_DATA_DIR, CLEANED_DATA_DIR, METADATA_DIR
from app.utils.preprocessing import clean_data

router = APIRouter()

@router.post("/data_cleaning")
def data_cleaning(
    missing_strategy: str = Form(...),   # drop or impute
    encoding: str = Form(...),           # label or onehot
    scaling: str = Form(...),            # standard or minmax
):

    try:
        # Load session info
        session_file = "session/last_upload.json"
        if not os.path.exists(session_file):
            return JSONResponse(status_code=400, content={"error": "No uploaded file found. Please upload a dataset first."})

        with open(session_file, "r") as f:
            session_info = json.load(f)

        file_name = session_info["file_name"]
        target_column = session_info["target_column"]
        
        # Load the dataset
        input_path = os.path.join(RAW_DATA_DIR, file_name)
        df = pd.read_csv(input_path)

        # Clean the data
        cleaned_df, metadata = clean_data(df, target_column, missing_strategy, encoding, scaling)

        # Save cleaned file
        os.makedirs(CLEANED_DATA_DIR, exist_ok=True)
        cleaned_path = os.path.join(CLEANED_DATA_DIR, f"cleaned_{file_name}")
        cleaned_df.to_csv(cleaned_path, index=False)


        # Save metadata
        os.makedirs(METADATA_DIR, exist_ok=True)
        metadata_path = os.path.join(METADATA_DIR, f"{file_name.replace('.csv', '')}_metadata.json")
        with open(metadata_path, "w") as f:
            json.dump(metadata, f, indent=4)

        return {
            "message": "Data cleaned successfully.",
            "cleaned_sample": cleaned_df.head(5).to_dict(orient="records"),
            "metadata": metadata
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
