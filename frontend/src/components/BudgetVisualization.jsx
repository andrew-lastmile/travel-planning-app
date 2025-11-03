import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function BudgetVisualization({ totalBudget, flightCost, lodgingCost, remainingBudget }) {
  const data = [
    { name: 'Flights', value: flightCost, color: '#3b82f6' },
    { name: 'Lodging', value: lodgingCost, color: '#10b981' },
    { name: 'Remaining', value: remainingBudget > 0 ? remainingBudget : 0, color: '#e5e7eb' }
  ];

  const totalSpent = flightCost + lodgingCost;
  const percentUsed = ((totalSpent / totalBudget) * 100).toFixed(1);
  const isOverBudget = totalSpent > totalBudget;

  return (
    <div className="budget-visualization">
      <h2>💰 Budget Summary</h2>

      <div className="budget-stats">
        <div className="stat-card">
          <span className="stat-label">Total Budget</span>
          <span className="stat-value">${totalBudget}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Spent</span>
          <span className={`stat-value ${isOverBudget ? 'over-budget' : ''}`}>
            ${totalSpent}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Remaining</span>
          <span className={`stat-value ${isOverBudget ? 'over-budget' : ''}`}>
            ${remainingBudget}
          </span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div
            className={`progress-fill ${isOverBudget ? 'over-budget' : ''}`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
        <span className="progress-label">{percentUsed}% of budget used</span>
      </div>

      {isOverBudget && (
        <div className="budget-warning">
          ⚠️ You're over budget by ${Math.abs(remainingBudget)}
        </div>
      )}

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="breakdown">
        <h3>Cost Breakdown</h3>
        <div className="breakdown-item">
          <span className="breakdown-label">✈️ Flight:</span>
          <span className="breakdown-value">${flightCost}</span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">🏨 Lodging:</span>
          <span className="breakdown-value">${lodgingCost}</span>
        </div>
        <div className="breakdown-divider"></div>
        <div className="breakdown-item total">
          <span className="breakdown-label">Total:</span>
          <span className="breakdown-value">${totalSpent}</span>
        </div>
      </div>
    </div>
  );
}

export default BudgetVisualization;
