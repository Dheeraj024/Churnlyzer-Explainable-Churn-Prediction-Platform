from fastapi import APIRouter, UploadFile, Form
from fastapi.responses import FileResponse, JSONResponse
import pandas as pd
import os
import joblib
import json
from io import StringIO
from dotenv import load_dotenv
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from app.core.config import MODELS_DIR, METADATA_DIR

router = APIRouter()

load_dotenv()


@router.post("/predict")
async def predict_churn(test_file: UploadFile, model_name: str = Form(...)):
    try:
        # Step 1: Load test CSV
        test_content = await test_file.read()
        test_df_original = pd.read_csv(StringIO(test_content.decode("utf-8")))
        test_df = test_df_original.copy()  # We'll preprocess this one

        # Step 2: Load preprocessing metadata
        with open(os.path.join("session", "last_upload.json"), "r") as f:
            session_info = json.load(f)
        metadata_path = os.path.join(
            METADATA_DIR, f"{session_info['file_name'].replace('.csv', '')}_metadata.json")
        with open(metadata_path, "r") as f:
            metadata = json.load(f)

        target_col = session_info["target_column"]

        # Step 3: Drop ID columns
        test_df.drop(
            columns=metadata["removed_columns"], errors='ignore', inplace=True)

        # Step 4: Impute missing values
        for col in test_df.columns:
            if test_df[col].isnull().sum() > 0:
                if test_df[col].dtype == 'object':
                    test_df[col].fillna(test_df[col].mode()[0], inplace=True)
                else:
                    test_df[col].fillna(test_df[col].median(), inplace=True)

        # Step 5: Encode
        if metadata["encoders"]:
            for col, classes in metadata["encoders"].items():
                test_df[col] = test_df[col].apply(
                    lambda x: classes.index(x) if x in classes else -1)
        else:
            # One-hot encoding (use same columns as training)
            for col in metadata["categorical_columns"]:
                if col in test_df.columns:
                    test_df = pd.get_dummies(test_df, columns=[col])
            for col in metadata["scalers"]["columns"]:
                if col not in test_df.columns:
                    test_df[col] = 0  # placeholder for missing columns

        # Step 6: Scaling
        scaler_type = metadata["scalers"]["type"]
        num_cols = metadata["scalers"]["columns"]
        if scaler_type == "standard":
            mean = metadata["scalers"]["mean"]
            scale = metadata["scalers"]["scale"]
            test_df[num_cols] = (test_df[num_cols] - mean) / scale
        elif scaler_type == "minmax":
            min_ = metadata["scalers"]["min"]
            max_ = metadata["scalers"]["max"]
            test_df[num_cols] = (test_df[num_cols] - min_) / (max_ - min_)

        # Step 7: Load model
        model_path = os.path.join(MODELS_DIR, f"{model_name}.pkl")
        if not os.path.exists(model_path):
            return JSONResponse(status_code=404, content={"error": "Model not found."})

        model = joblib.load(model_path)

        # Step 8: Predict
        proba = model.predict_proba(test_df)[:, 1]
        pred = model.predict(test_df)

        # Step 9: HuggingFace Summarization
        llm = HuggingFaceEndpoint(
            repo_id="mistralai/Mixtral-8x7B-Instruct-v0.1",
            task="text-generation")

        chat_model = ChatHuggingFace(llm=llm)

        summaries = []
        for i, row in test_df_original.iterrows():
            prompt = f"""
Customer data: {row.to_dict()}
Prediction: {int(pred[i])}, Churn Probability: {float(proba[i]):.2f}
Explain in 1-2 lines why this customer may or may not churn.
            """
            result = chat_model.invoke(prompt)
            summaries.append(result.content.strip())

        # Step 10: Append Results
        test_df["Churn Prediction"] = pred
        test_df["Churn Probability"] = proba
        test_df["Summary"] = summaries

        # Step 11: Save and Return
        os.makedirs("data/predictions", exist_ok=True)
        result_path = f"data/predictions/{model_name}_prediction_result.csv"
        test_df.to_csv(result_path, index=False)

        test_df_original = test_df_original.assign(
    **{
        "Churn Prediction": pred,
        "Churn Probability": proba,
        "Summary": summaries
    })

        preview = test_df_original.head(5).to_dict(orient="records")
        return {
            "preview": preview,
            "download_link": result_path
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
