# Customer Churn Prediction Platform (FastAPI + ML + GenAI)

A complete machine learning application built with FastAPI to:

* Predict customer churn using multiple ML models.
* Explain predictions using a Generative AI model from Hugging Face.

---

## 🚀 Features

* Upload CSV dataset
* Configurable data preprocessing (missing value, encoding, scaling)
* Train multiple models (Logistic Regression, Random Forest, SVM, Naive Bayes)
* Save and reuse trained models
* Batch inference on test CSV
* Natural language summaries for each prediction using `mistralai/Mixtral-8x7B-Instruct-v0.1`
* Downloadable result with prediction + GenAI insights

---

## Sample data

* You can find a sample train and test data in this folder to work with.

---

## 📂 Folder Structure

.
├── app
│   ├── core
│   │   └── config.py
│   ├── routers
│   │   ├── upload.py
│   │   ├── data_cleaning.py
│   │   ├── training.py
│   │   └── predict.py
│   ├── utils
│   │   ├── file_ops.py
│   │   ├── model_utils.py
│   │   └── preprocessing.py
│   └── main.py
├── data
│   ├── raw
│   ├── cleaned
│   ├── metadata
│   └── predictions
├── models
├── session
│   └── last_upload.json
├── requirements.txt
└── README.md
```

---

## ⚖️ Dependencies

```
pip install -r requirements.txt
```

**requirements.txt**

```
fastapi
uvicorn
pandas
scikit-learn
joblib
python-multipart
dotenv
langchain
huggingface_hub
```

---

## 🌐 Running the App

```bash
uvicorn app.main:app --reload
```

Open your browser at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🤹 Step-by-Step API Workflow

### 1. `/upload`

* Upload CSV file (from the sample data folder) 
* Specify target column (e.g., `Churn`)
* Output: column types, missing values, preview

### 2. `/data_cleaning`

* Select:

  * Missing strategy: `drop` or `impute`
  * Encoding: `label` or `onehot`
  * Scaling: `standard` or `minmax`
* Automatically applies on last uploaded dataset
* Saves cleaned data & metadata

### 3. `/train_models`

* Choose one or more models:

  * `logistic_regression`
  * `random_forest`
  * `svm`
* Trains and saves models in `models/`
* Returns accuracy, precision, recall, F1, ROC AUC, confusion matrix

### 4. `/predict`

* Upload a test CSV (from the sample data folder) 
* Choose trained model (e.g., `svm`)
* Auto-preprocesses test data using stored metadata
* Predicts churn and probabilities
* Generates GenAI summary per row using Hugging Face
* Output: downloadable CSV with all predictions + insights

---

## 🔧 HuggingFace Integration (Free Tier)

Ensure you have `.env` file with:

```
HUGGINGFACEHUB_API_TOKEN=your_token_here
```

Using:

```python
llm = HuggingFaceEndpoint(
    repo_id="mistralai/Mixtral-8x7B-Instruct-v0.1",
    task="text-generation"
)
model = ChatHuggingFace(llm=llm)
```

---

## 💾 Sample Result

Downloadable CSV will include:

* All original features
* `Churn Prediction`
* `Churn Probability`
* `Summary` (AI explanation)

---

## Added UI (Frontend ) using React (vite)

* Home page
![alt text](<Screenshot 2025-08-04 222216.png>)

* Upload page
![alt text](<Screenshot 2025-08-04 222317.png>)

* Data Cleaning page
![alt text](<Screenshot 2025-08-04 222350.png>)

* Training page
![alt text](<Screenshot 2025-08-04 222419.png>)

* Prediction page
![alt text](<Screenshot 2025-08-04 222527.png>)

## 🌟 Future Enhancements

* Dockerize app
* Confusion matrix and ROC curve visualization
* Versioned model management
* SQLite/NoSQL database for logs

---

## 🎓 Author

Built by Dheeraj Kumar



------------------------------------------------------------------------------------------------------------------------------



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
