import { useState } from 'react';

function ItineraryGenerator({ destination, startDate, endDate, onItineraryGenerated }) {
  const [interests, setInterests] = useState([]);
  const [travelPace, setTravelPace] = useState('moderate');
  const [dailyBudget, setDailyBudget] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableInterests = [
    'Culture & History',
    'Food & Dining',
    'Adventure & Outdoor',
    'Relaxation & Wellness',
    'Shopping',
    'Nightlife',
    'Nature & Parks',
    'Art & Museums',
    'Photography',
    'Local Experiences'
  ];

  const toggleInterest = (interest) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleGenerate = async () => {
    if (interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          interests,
          travelPace,
          dailyBudget
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const data = await response.json();
      onItineraryGenerated(data);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="itinerary-generator">
      <h2>🗓️ Generate Smart Itinerary</h2>
      <p className="generator-subtitle">
        Create a personalized day-by-day plan for your trip to {destination}
      </p>

      <div className="generator-section">
        <h3>What interests you?</h3>
        <div className="interests-grid">
          {availableInterests.map(interest => (
            <button
              key={interest}
              className={`interest-tag ${interests.includes(interest) ? 'selected' : ''}`}
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div className="generator-section">
        <h3>Travel Pace</h3>
        <div className="pace-options">
          <label className="pace-option">
            <input
              type="radio"
              name="pace"
              value="slow"
              checked={travelPace === 'slow'}
              onChange={(e) => setTravelPace(e.target.value)}
            />
            <div className="pace-card">
              <span className="pace-icon">🐌</span>
              <span className="pace-name">Slow</span>
              <span className="pace-desc">Relaxed with lots of downtime</span>
            </div>
          </label>

          <label className="pace-option">
            <input
              type="radio"
              name="pace"
              value="moderate"
              checked={travelPace === 'moderate'}
              onChange={(e) => setTravelPace(e.target.value)}
            />
            <div className="pace-card">
              <span className="pace-icon">🚶</span>
              <span className="pace-name">Moderate</span>
              <span className="pace-desc">Balanced schedule</span>
            </div>
          </label>

          <label className="pace-option">
            <input
              type="radio"
              name="pace"
              value="fast"
              checked={travelPace === 'fast'}
              onChange={(e) => setTravelPace(e.target.value)}
            />
            <div className="pace-card">
              <span className="pace-icon">🏃</span>
              <span className="pace-name">Fast</span>
              <span className="pace-desc">Packed with activities</span>
            </div>
          </label>
        </div>
      </div>

      <div className="generator-section">
        <h3>Daily Budget (per person)</h3>
        <div className="budget-input-container">
          <input
            type="range"
            min="50"
            max="500"
            step="25"
            value={dailyBudget}
            onChange={(e) => setDailyBudget(parseInt(e.target.value))}
            className="budget-slider"
          />
          <span className="budget-value">${dailyBudget}/day</span>
        </div>
        <div className="budget-labels">
          <span>Budget</span>
          <span>Luxury</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <button
        className="btn-primary generate-btn"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? '✨ Generating Your Itinerary...' : '✨ Generate Itinerary'}
      </button>
    </div>
  );
}

export default ItineraryGenerator;
