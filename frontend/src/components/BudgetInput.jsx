function BudgetInput({ tripData, onInputChange, onGetRecommendations, loading }) {
  return (
    <div className="budget-input-section">
      <h2>Trip Details</h2>
      <div className="input-grid">
        <div className="input-group">
          <label htmlFor="destination">Destination</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={tripData.destination}
            onChange={onInputChange}
            placeholder="e.g., Lisbon, Portugal"
          />
        </div>

        <div className="input-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={tripData.startDate}
            onChange={onInputChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={tripData.endDate}
            onChange={onInputChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="budget">Total Budget ($)</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={tripData.budget}
            onChange={onInputChange}
            min="100"
            step="50"
          />
        </div>

        <div className="input-group full-width">
          <label htmlFor="preferences">Preferences (optional)</label>
          <input
            type="text"
            id="preferences"
            name="preferences"
            value={tripData.preferences}
            onChange={onInputChange}
            placeholder="e.g., prefer direct flights, close to downtown"
          />
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={onGetRecommendations}
        disabled={loading}
      >
        {loading ? 'Loading...' : '🤖 Get AI Recommendations'}
      </button>
    </div>
  );
}

export default BudgetInput;
