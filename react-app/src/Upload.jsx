import React, { useState } from 'react';
import axios from 'axios';

const Upload = ({ setMetadata }) => {
    const [file, setFile] = useState(null);
    const [targetColumn, setTargetColumn] = useState('Churn');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            console.error('Upload error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>Upload Dataset</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Dataset (CSV):</label>
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
                        placeholder="Enter target column name" 
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading || !file}
                    className="submit-button"
                >
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Upload;
