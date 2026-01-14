import React, { useState } from 'react';
import './InputForm.css';

function InputForm({ selectedDS }) {
  const [inputData, setInputData] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle input submission
    console.log('Input data:', inputData);
  };

  return (
    <div className="input-form glass fade-in">
      <h3>🔧 Input Parameters</h3>
      
      <form onSubmit={handleSubmit} className="input-form-content">
        <div className="form-group">
          <label>Input Data:</label>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Enter your data (e.g., [1,2,3,4,5] for arrays)"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Operation:</label>
          <select>
            <option value="insert">Insert</option>
            <option value="delete">Delete</option>
            <option value="search">Search</option>
            <option value="traverse">Traverse</option>
          </select>
        </div>

        <div className="form-group">
          <label>Value:</label>
          <input type="text" placeholder="Enter value for operation" />
        </div>

        <button type="submit" className="submit-btn">
          🚀 Execute Operation
        </button>
      </form>

      <div className="quick-actions">
        <h4>Quick Actions:</h4>
        <div className="action-buttons">
          <button className="action-btn">Generate Random Data</button>
          <button className="action-btn">Clear All</button>
          <button className="action-btn">Load Example</button>
        </div>
      </div>
    </div>
  );
}

export default InputForm;