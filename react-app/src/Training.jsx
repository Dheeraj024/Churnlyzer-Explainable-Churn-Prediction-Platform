
import React, { useState } from 'react';
import axios from 'axios';

const Training = ({ setTrainingResults }) => {
    const [models, setModels] = useState([]);
    const [error, setError] = useState('');

    const handleModelChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setModels([...models, value]);
        } else {
            setModels(models.filter((model) => model !== value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (models.length === 0) {
            setError('Please select at least one model.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/train_models', { models });
            setTrainingResults(response.data);
            setError('');
        } catch (err) {
            setError(err.response ? err.response.data.error : 'An error occurred.');
        }
    };

    return (
        <div>
            <h2>Train Models</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select Models:</label>
                    <div>
                        <input type="checkbox" value="logistic_regression" onChange={handleModelChange} />
                        <label>Logistic Regression</label>
                    </div>
                    <div>
                        <input type="checkbox" value="random_forest" onChange={handleModelChange} />
                        <label>Random Forest</label>
                    </div>
                    <div>
                        <input type="checkbox" value="svm" onChange={handleModelChange} />
                        <label>SVM</label>
                    </div>
                </div>
                <button type="submit">Train</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Training;
