function LodgingOptions({ lodging, selectedLodging, onSelectLodging, nights }) {
  return (
    <div className="options-container">
      <h2>🏨 Available Lodging ({nights} night{nights !== 1 ? 's' : ''})</h2>
      <div className="options-grid">
        {lodging.map(place => (
          <div
            key={place.id}
            className={`option-card ${selectedLodging?.id === place.id ? 'selected' : ''}`}
            onClick={() => onSelectLodging(place)}
          >
            <div className="option-header">
              <h3>{place.name}</h3>
              <div className="price-info">
                <span className="price">${place.pricePerNight}/night</span>
                <span className="total-price">${place.pricePerNight * nights} total</span>
              </div>
            </div>
            <div className="option-details">
              <div className="detail-row">
                <span className="label">Type:</span>
                <span>{place.type}</span>
              </div>
              <div className="detail-row">
                <span className="label">Rating:</span>
                <span>⭐ {place.rating}/5</span>
              </div>
              <div className="detail-row">
                <span className="label">Location:</span>
                <span>{place.location}</span>
              </div>
              <div className="detail-row amenities">
                <span className="label">Amenities:</span>
                <div className="amenities-list">
                  {place.amenities.map((amenity, idx) => (
                    <span key={idx} className="amenity-tag">{amenity}</span>
                  ))}
                </div>
              </div>
            </div>
            {selectedLodging?.id === place.id && (
              <div className="selected-badge">✓ Selected</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LodgingOptions;
