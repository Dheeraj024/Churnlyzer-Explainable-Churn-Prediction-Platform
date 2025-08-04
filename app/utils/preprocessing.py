# app/utils/preprocessing.py

import pandas as pd
import numpy as np
import json
from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder

def clean_data(df: pd.DataFrame, target: str, missing_strategy="drop", encoding="onehot", scaling="standard"):
    metadata = {
        "removed_columns": [],
        "categorical_columns": [],
        "numerical_columns": [],
        "encoders": {},
        "scalers": {}
    }

    # Step 1: Drop columns with 'id' in their name
    for col in df.columns:
        if 'id' in col.lower():
            metadata["removed_columns"].append(col)
    df = df.drop(columns=metadata["removed_columns"])

    # Step 2: Separate target
    X = df.drop(columns=[target])
    y = df[target]

    # Step 3: Handle missing values
    if missing_strategy == "drop":
        X = X.dropna()
    elif missing_strategy == "impute":
        for col in X.columns:
            if X[col].dtype == 'object':
                X[col] = X[col].fillna(X[col].mode()[0])
            else:
                X[col] = X[col].fillna(X[col].median())


    # Step 4: Encoding
    categorical_cols = X.select_dtypes(include=['object']).columns.tolist()
    metadata["categorical_columns"] = categorical_cols

    if encoding == "label":
        for col in categorical_cols:
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col])
            metadata["encoders"][col] = le.classes_.tolist()
    elif encoding == "onehot":
        X = pd.get_dummies(X, columns=categorical_cols)

    # Step 5: Scaling
    numerical_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    metadata["numerical_columns"] = numerical_cols

    if scaling == "standard":
        scaler = StandardScaler()
        X[numerical_cols] = scaler.fit_transform(X[numerical_cols])
        metadata["scalers"]["type"] = "standard"
        metadata["scalers"]["mean"] = scaler.mean_.tolist()
        metadata["scalers"]["scale"] = scaler.scale_.tolist()
        metadata["scalers"]["columns"] = numerical_cols

    elif scaling == "minmax":
        scaler = MinMaxScaler()
        X[numerical_cols] = scaler.fit_transform(X[numerical_cols])
        metadata["scalers"]["type"] = "minmax"
        metadata["scalers"]["min"] = scaler.data_min_.tolist()
        metadata["scalers"]["max"] = scaler.data_max_.tolist()
        metadata["scalers"]["columns"] = numerical_cols

    # Reattach target column
    X[target] = y.reset_index(drop=True)

    return X, metadata
