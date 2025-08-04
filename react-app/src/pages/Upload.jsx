import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [targetColumn, setTargetColumn] = useState('Churn');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [metadata, setMetadata] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && !selectedFile.name.endsWith('.csv')) {
            setError('Please select a CSV file');
            return;
        }
        setFile(selectedFile);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('target_column', targetColumn);

        try {
            const response = await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMetadata(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h2>Upload Dataset</h2>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select Dataset (CSV file):</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            accept=".csv"
                            className="form-control" 
                        />
                    </div>
                    <div className="form-group">
                        <label>Target Column:</label>
                        <input 
                            type="text" 
                            value={targetColumn} 
                            onChange={(e) => setTargetColumn(e.target.value)}
                            className="form-control"
                            placeholder="Enter target column name (e.g., Churn)" 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading || !file}
                    >
                        {loading ? 'Uploading...' : 'Upload Dataset'}
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>

            {metadata && (
                <div className="card result-card">
                    <h3>Upload Successful!</h3>
                    <div className="metadata-display">
                        <h4>Dataset Information:</h4>
                        <ul>
                            <li><strong>Total Columns:</strong> {metadata.columns.length}</li>
                            <li><strong>Target Column:</strong> {metadata.target}</li>
                        </ul>
                        
                        <h4>Columns:</h4>
                        <ul>
                            {metadata.columns.map(col => (
                                <li key={col}>
                                    {col} 
                                    {metadata.missing_values[col] > 0 && 
                                        ` (${metadata.missing_values[col]} missing values)`}
                                    {` - ${metadata.dtypes[col]}`}
                                </li>
                            ))}
                        </ul>

                        <h4>Sample Data:</h4>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        {metadata.columns.map(col => (
                                            <th key={col}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {metadata.sample_data.map((row, idx) => (
                                        <tr key={idx}>
                                            {metadata.columns.map(col => (
                                                <td key={col}>{row[col]}</td>
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

export default Upload;