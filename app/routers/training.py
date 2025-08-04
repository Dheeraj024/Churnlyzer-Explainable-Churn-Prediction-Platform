from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List
import os
from app.core.config import RAW_DATA_DIR, CLEANED_DATA_DIR, METADATA_DIR
from app.utils.model_utils import train_and_evaluate

router = APIRouter()

class TrainRequest(BaseModel):
    models: List[str]  # e.g., ["logistic_regression", "random_forest"]

@router.post("/train_models")
def train_models(request: TrainRequest):
    try:
        results = train_and_evaluate(request.models)
    except FileNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not results:
        raise HTTPException(status_code=400, detail="No valid models selected.")

    return {"results": results}
