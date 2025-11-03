function FlightOptions({ flights, selectedFlight, onSelectFlight }) {
  return (
    <div className="options-container">
      <h2>✈️ Available Flights</h2>
      <div className="options-grid">
        {flights.map(flight => (
          <div
            key={flight.id}
            className={`option-card ${selectedFlight?.id === flight.id ? 'selected' : ''}`}
            onClick={() => onSelectFlight(flight)}
          >
            <div className="option-header">
              <h3>{flight.airline}</h3>
              <span className="price">${flight.price}</span>
            </div>
            <div className="option-details">
              <div className="detail-row">
                <span className="label">Departure:</span>
                <span>{flight.departure}</span>
              </div>
              <div className="detail-row">
                <span className="label">Arrival:</span>
                <span>{flight.arrival}</span>
              </div>
              <div className="detail-row">
                <span className="label">Duration:</span>
                <span>{flight.duration}</span>
              </div>
              <div className="detail-row">
                <span className="label">Stops:</span>
                <span>{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</span>
              </div>
            </div>
            {selectedFlight?.id === flight.id && (
              <div className="selected-badge">✓ Selected</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlightOptions;
