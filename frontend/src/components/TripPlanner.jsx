import { useState } from 'react';
import BudgetInput from './BudgetInput';
import FlightOptions from './FlightOptions';
import LodgingOptions from './LodgingOptions';
import AIRecommendations from './AIRecommendations';
import BudgetVisualization from './BudgetVisualization';
import '../styles/TripPlanner.css';

function TripPlanner() {
  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: 700,
    preferences: ''
  });

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedLodging, setSelectedLodging] = useState(null);
  const [nights, setNights] = useState(0);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [availableOptions, setAvailableOptions] = useState({ flights: [], lodging: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData(prev => ({ ...prev, [name]: value }));
  };

  const calculateNights = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  };

  const handleGetRecommendations = async () => {
    if (!tripData.destination || !tripData.startDate || !tripData.endDate) {
      setError('Please fill in destination and dates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData)
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      setAiRecommendation(data.recommendation);
      setAvailableOptions({
        flights: data.availableFlights,
        lodging: data.availableLodging
      });
      setNights(data.nights);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalCost = () => {
    const flightCost = selectedFlight ? selectedFlight.price : 0;
    const lodgingCost = selectedLodging ? selectedLodging.pricePerNight * nights : 0;
    return flightCost + lodgingCost;
  };

  const getRemainingBudget = () => {
    return tripData.budget - getTotalCost();
  };

  return (
    <div className="trip-planner">
      <header className="header">
        <h1>✈️ AI Travel Planner</h1>
        <p>Plan your perfect trip within budget</p>
      </header>

      <div className="planner-container">
        <BudgetInput
          tripData={tripData}
          onInputChange={handleInputChange}
          onGetRecommendations={handleGetRecommendations}
          loading={loading}
        />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Getting AI recommendations...</p>
          </div>
        )}

        {aiRecommendation && (
          <AIRecommendations recommendation={aiRecommendation} />
        )}

        {availableOptions.flights.length > 0 && (
          <div className="options-section">
            <FlightOptions
              flights={availableOptions.flights}
              selectedFlight={selectedFlight}
              onSelectFlight={setSelectedFlight}
            />

            {tripData.startDate && tripData.endDate && (
              <LodgingOptions
                lodging={availableOptions.lodging}
                selectedLodging={selectedLodging}
                onSelectLodging={setSelectedLodging}
                nights={nights}
              />
            )}
          </div>
        )}

        {(selectedFlight || selectedLodging) && (
          <BudgetVisualization
            totalBudget={tripData.budget}
            flightCost={selectedFlight ? selectedFlight.price : 0}
            lodgingCost={selectedLodging ? selectedLodging.pricePerNight * nights : 0}
            remainingBudget={getRemainingBudget()}
          />
        )}
      </div>
    </div>
  );
}

export default TripPlanner;
