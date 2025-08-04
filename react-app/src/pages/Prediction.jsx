import React, { useState } from 'react';
import axios from 'axios';

const Prediction = () => {
    const [file, setFile] = useState(null);
    const [model, setModel] = useState('svm');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file.');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('test_file', file);
        formData.append('model_name', model);

        try {
            const response = await axios.post('http://localhost:8000/predict', formData);
            setResult(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Prediction failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h2>Predict Churn</h2>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Test Data (CSV):</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            accept=".csv"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Model:</label>
                        <select 
                            value={model} 
                            onChange={(e) => setModel(e.target.value)}
                            className="form-control"
                        >
                            <option value="svm">SVM</option>
                            <option value="logistic_regression">Logistic Regression</option>
                            <option value="random_forest">Random Forest</option>
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading || !file}
                    >
                        {loading ? 'Predicting...' : 'Predict'}
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>

            {result && (
                <div className="card result-card">
                    <h3>Prediction Results</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    {Object.keys(result.preview[0]).map(header => (
                                        <th key={header}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {result.preview.map((row, idx) => (
                                    <tr key={idx}>
                                        {Object.values(row).map((value, i) => (
                                            <td key={i}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prediction;
