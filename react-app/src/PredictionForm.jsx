import React, { useState } from 'react';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    feature1: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="feature1"
          value={formData.feature1}
          onChange={handleChange}
          placeholder="Feature 1"
        />
        <button type="submit">Predict</button>
      </form>
      {prediction && <div>Prediction: {prediction}</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default PredictionForm;
