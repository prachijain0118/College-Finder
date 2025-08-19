import { useState } from 'react';

interface DebugPanelProps {
  apiKey: string;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);

  const apiKeyStatus = apiKey ? 'Configured' : 'Missing';
  const maskedApiKey = apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : 'Not set';

  return (
    <div className="debug-panel">
      <button 
        className="debug-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Debug Information"
      >
        🔧
      </button>
      
      {isOpen && (
        <div className="debug-content">
          <h4>🔍 Debug Information</h4>
          <div className="debug-item">
            <strong>API Key Status:</strong> 
            <span className={`status ${apiKeyStatus.toLowerCase()}`}>
              {apiKeyStatus}
            </span>
          </div>
          <div className="debug-item">
            <strong>API Key:</strong> {maskedApiKey}
          </div>
          <div className="debug-item">
            <strong>Environment:</strong> {import.meta.env.MODE}
          </div>
          <div className="debug-instructions">
            <h5>Troubleshooting:</h5>
            <ul>
              <li>Ensure your .env file contains VITE_GEMINI_API_KEY</li>
              <li>Check browser console for detailed error messages</li>
              <li>Verify your Gemini API key is valid and has quota remaining</li>
              <li>Try searching for major cities like Mumbai, Delhi, Bangalore</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
