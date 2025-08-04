
import React, { useState } from 'react';
import axios from 'axios';

const DataCleaning = ({ setCleanedData }) => {
    const [missingStrategy, setMissingStrategy] = useState('drop');
    const [encoding, setEncoding] = useState('label');
    const [scaling, setScaling] = useState('standard');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('missing_strategy', missingStrategy);
        formData.append('encoding', encoding);
        formData.append('scaling', scaling);

        try {
            const response = await axios.post('http://localhost:8000/data_cleaning', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setCleanedData(response.data);
            setError('');
        } catch (err) {
            setError(err.response ? err.response.data.error : 'An error occurred.');
        }
    };

    return (
        <div>
            <h2>Data Cleaning</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Missing Value Strategy:</label>
                    <select value={missingStrategy} onChange={(e) => setMissingStrategy(e.target.value)}>
                        <option value="drop">Drop</option>
                        <option value="impute">Impute</option>
                    </select>
                </div>
                <div>
                    <label>Encoding:</label>
                    <select value={encoding} onChange={(e) => setEncoding(e.target.value)}>
                        <option value="label">Label</option>
                        <option value="onehot">One-Hot</option>
                    </select>
                </div>
                <div>
                    <label>Scaling:</label>
                    <select value={scaling} onChange={(e) => setScaling(e.target.value)}>
                        <option value="standard">Standard</option>
                        <option value="minmax">Min-Max</option>
                    </select>
                </div>
                <button type="submit">Clean Data</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default DataCleaning;
