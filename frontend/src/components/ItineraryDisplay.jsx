import { useState } from 'react';

function ItineraryDisplay({ itineraryData }) {
  const [expandedDays, setExpandedDays] = useState(new Set([1]));

  const toggleDay = (day) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      return newSet;
    });
  };

  const { itinerary, overview, packingTips, totalEstimatedCost } = itineraryData;

  const getWeatherIcon = (condition) => {
    const lower = condition.toLowerCase();
    if (lower.includes('sun') || lower.includes('clear')) return '☀️';
    if (lower.includes('cloud')) return '☁️';
    if (lower.includes('rain')) return '🌧️';
    if (lower.includes('storm')) return '⛈️';
    if (lower.includes('snow')) return '❄️';
    return '🌤️';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="itinerary-display">
      <div className="itinerary-header">
        <h2>🗺️ Your Personalized Itinerary</h2>
        <button onClick={handlePrint} className="btn-secondary print-btn">
          🖨️ Print
        </button>
      </div>

      <div className="itinerary-overview">
        <p>{overview}</p>
        <div className="overview-stats">
          <div className="stat">
            <span className="stat-label">Total Days</span>
            <span className="stat-value">{itinerary.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Estimated Cost</span>
            <span className="stat-value">${totalEstimatedCost}</span>
          </div>
        </div>
      </div>

      {packingTips && packingTips.length > 0 && (
        <div className="packing-tips">
          <h3>🎒 Packing Tips</h3>
          <ul>
            {packingTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="itinerary-timeline">
        {itinerary.map((day) => (
          <div key={day.day} className="day-card">
            <div
              className="day-header"
              onClick={() => toggleDay(day.day)}
            >
              <div className="day-title">
                <span className="day-number">Day {day.day}</span>
                <span className="day-date">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="day-meta">
                {day.weather && (
                  <span className="weather-badge">
                    {getWeatherIcon(day.weather.condition)} {day.weather.temperature}
                  </span>
                )}
                <span className="day-cost">${day.dailyTotal}</span>
                <span className={`expand-icon ${expandedDays.has(day.day) ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>
            </div>

            {expandedDays.has(day.day) && (
              <div className="day-content">
                {day.weather?.advisory && (
                  <div className="weather-advisory">
                    ⚠️ {day.weather.advisory}
                  </div>
                )}

                {day.highlights && (
                  <div className="day-highlight">
                    ⭐ <strong>Today's Highlight:</strong> {day.highlights}
                  </div>
                )}

                {/* Morning */}
                <div className="time-block">
                  <div className="time-block-header">
                    <span className="time-icon">🌅</span>
                    <div>
                      <h4>Morning</h4>
                      <span className="time-range">{day.morning.time}</span>
                    </div>
                  </div>
                  <div className="time-block-content">
                    <div className="activities">
                      {day.morning.activities.map((activity, idx) => (
                        <span key={idx} className="activity-badge">{activity}</span>
                      ))}
                    </div>
                    <p>{day.morning.description}</p>
                    {day.morning.travelTips && (
                      <div className="travel-tips">
                        <strong>💡 Tips:</strong> {day.morning.travelTips}
                      </div>
                    )}
                    <div className="cost-estimate">
                      Estimated cost: ${day.morning.estimatedCost}
                    </div>
                  </div>
                </div>

                {/* Afternoon */}
                <div className="time-block">
                  <div className="time-block-header">
                    <span className="time-icon">☀️</span>
                    <div>
                      <h4>Afternoon</h4>
                      <span className="time-range">{day.afternoon.time}</span>
                    </div>
                  </div>
                  <div className="time-block-content">
                    {day.afternoon.lunch && (
                      <div className="meal-suggestion">
                        🍽️ <strong>Lunch:</strong> {day.afternoon.lunch}
                      </div>
                    )}
                    <div className="activities">
                      {day.afternoon.activities.map((activity, idx) => (
                        <span key={idx} className="activity-badge">{activity}</span>
                      ))}
                    </div>
                    <p>{day.afternoon.description}</p>
                    {day.afternoon.travelTips && (
                      <div className="travel-tips">
                        <strong>💡 Tips:</strong> {day.afternoon.travelTips}
                      </div>
                    )}
                    <div className="cost-estimate">
                      Estimated cost: ${day.afternoon.estimatedCost}
                    </div>
                  </div>
                </div>

                {/* Evening */}
                <div className="time-block">
                  <div className="time-block-header">
                    <span className="time-icon">🌙</span>
                    <div>
                      <h4>Evening</h4>
                      <span className="time-range">{day.evening.time}</span>
                    </div>
                  </div>
                  <div className="time-block-content">
                    {day.evening.dinner && (
                      <div className="meal-suggestion">
                        🍽️ <strong>Dinner:</strong> {day.evening.dinner}
                      </div>
                    )}
                    <div className="activities">
                      {day.evening.activities.map((activity, idx) => (
                        <span key={idx} className="activity-badge">{activity}</span>
                      ))}
                    </div>
                    <p>{day.evening.description}</p>
                    {day.evening.travelTips && (
                      <div className="travel-tips">
                        <strong>💡 Tips:</strong> {day.evening.travelTips}
                      </div>
                    )}
                    <div className="cost-estimate">
                      Estimated cost: ${day.evening.estimatedCost}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItineraryDisplay;
