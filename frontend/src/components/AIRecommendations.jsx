import ReactMarkdown from 'react-markdown';

function AIRecommendations({ recommendation }) {
  return (
    <div className="ai-recommendations">
      <h2>🤖 AI Travel Assistant</h2>
      <div className="recommendation-content">
        <ReactMarkdown>{recommendation}</ReactMarkdown>
      </div>
    </div>
  );
}

export default AIRecommendations;
