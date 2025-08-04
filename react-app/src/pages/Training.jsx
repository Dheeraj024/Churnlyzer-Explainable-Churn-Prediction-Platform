import React, { useState } from 'react';
import axios from 'axios';

const Training = () => {
    const [models, setModels] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleModelChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setModels(prev => [...prev, value]);
        } else {
            setModels(prev => prev.filter(model => model !== value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (models.length === 0) {
            setError('Please select at least one model.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8000/train_models', {
                models: models
            });
            setResults(response.data.results);
        } catch (err) {
            setError(err.response?.data?.detail || 'Training failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h2>Train Models</h2>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select Models to Train:</label>
                        <div className="checkbox-group">
                            <div className="checkbox-item">
                                <input 
                                    type="checkbox" 
                                    id="logistic_regression"
                                    value="logistic_regression" 
                                    onChange={handleModelChange} 
                                    checked={models.includes('logistic_regression')}
                                />
                                <label htmlFor="logistic_regression">Logistic Regression</label>
                            </div>
                            <div className="checkbox-item">
                                <input 
                                    type="checkbox" 
                                    id="random_forest"
                                    value="random_forest" 
                                    onChange={handleModelChange} 
                                    checked={models.includes('random_forest')}
                                />
                                <label htmlFor="random_forest">Random Forest</label>
                            </div>
                            <div className="checkbox-item">
                                <input 
                                    type="checkbox" 
                                    id="svm"
                                    value="svm" 
                                    onChange={handleModelChange} 
                                    checked={models.includes('svm')}
                                />
                                <label htmlFor="svm">SVM</label>
                            </div>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading || models.length === 0}
                    >
                        {loading ? 'Training...' : 'Train Selected Models'}
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>

            {results && (
                <div className="card result-card">
                    <h3>Training Results</h3>
                    <div className="results-grid">
                        {Object.entries(results).map(([model, result]) => (
                            <div key={model} className="model-result">
                                <h4>{model.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h4>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Accuracy:</td>
                                            <td>{(result.accuracy * 100).toFixed(2)}%</td>
                                        </tr>
                                        <tr>
                                            <td>Precision:</td>
                                            <td>{(result.precision * 100).toFixed(2)}%</td>
                                        </tr>
                                        <tr>
                                            <td>Recall:</td>
                                            <td>{(result.recall * 100).toFixed(2)}%</td>
                                        </tr>
                                        <tr>
                                            <td>F1 Score:</td>
                                            <td>{(result.f1_score * 100).toFixed(2)}%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Training;