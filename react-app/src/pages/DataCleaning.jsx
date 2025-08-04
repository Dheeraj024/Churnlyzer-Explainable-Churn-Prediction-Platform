import React, { useState } from 'react';
import axios from 'axios';

const DataCleaning = () => {
    const [missingStrategy, setMissingStrategy] = useState('drop');
    const [encoding, setEncoding] = useState('label');
    const [scaling, setScaling] = useState('standard');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('missing_strategy', missingStrategy);
        formData.append('encoding', encoding);
        formData.append('scaling', scaling);

        try {
            const response = await axios.post('http://localhost:8000/data_cleaning', formData);
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h2>Data Cleaning</h2>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Missing Value Strategy:</label>
                        <select
                            value={missingStrategy}
                            onChange={(e) => setMissingStrategy(e.target.value)}
                            className="form-control"
                        >
                            <option value="drop">Drop</option>
                            <option value="impute">Impute</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Encoding Method:</label>
                        <select
                            value={encoding}
                            onChange={(e) => setEncoding(e.target.value)}
                            className="form-control"
                        >
                            <option value="label">Label Encoding</option>
                            <option value="onehot">One-Hot Encoding</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Scaling Method:</label>
                        <select
                            value={scaling}
                            onChange={(e) => setScaling(e.target.value)}
                            className="form-control"
                        >
                            <option value="standard">Standard Scaling</option>
                            <option value="minmax">Min-Max Scaling</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Clean Data'}
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>

            {result && (
                <div className="card result-card">
                    <h3>Data Cleaning Results</h3>
                    <div className="metadata-display">
                        <h4>Cleaning Summary:</h4>
                        <ul>
                            <li><strong>Removed Columns:</strong> {result.metadata.removed_columns.join(', ') || 'None'}</li>
                            <li><strong>Numerical Columns:</strong> {result.metadata.numerical_columns.join(', ')}</li>
                            <li><strong>Categorical Columns:</strong> {result.metadata.categorical_columns.join(', ')}</li>
                        </ul>

                        <h4>Sample Cleaned Data:</h4>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        {Object.keys(result.cleaned_sample[0] || {}).map(col => (
                                            <th key={col}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.cleaned_sample.map((row, idx) => (
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
                </div>
            )}
        </div>
    );
};

export default DataCleaning;
