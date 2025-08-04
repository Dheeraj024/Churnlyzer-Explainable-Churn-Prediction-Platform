
import React, { useState } from 'react';
import axios from 'axios';

const Prediction = ({ setPredictionResult }) => {
    const [file, setFile] = useState(null);
    const [model, setModel] = useState('svm');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('test_file', file);
        formData.append('model_name', model);

        try {
            const response = await axios.post('http://localhost:8000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPredictionResult(response.data);
            setError('');
        } catch (err) {
            setError(err.response ? err.response.data.error : 'An error occurred.');
        }
    };

    return (
        <div>
            <h2>Predict Churn</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Test Data (CSV):</label>
                    <input type="file" onChange={handleFileChange} accept=".csv" />
                </div>
                <div>
                    <label>Model:</label>
                    <select value={model} onChange={(e) => setModel(e.target.value)}>
                        <option value="svm">SVM</option>
                        <option value="logistic_regression">Logistic Regression</option>
                        <option value="random_forest">Random Forest</option>
                    </select>
                </div>
                <button type="submit">Predict</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Prediction;
