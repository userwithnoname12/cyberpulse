import { AlertCircle, RefreshCw } from "lucide-react";

function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state">
      <AlertCircle size={32} className="error-icon" />
      <p className="error-state-message">{message}</p>
      {onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          <RefreshCw size={14} /> Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;