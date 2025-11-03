# AI Travel Planning App

An AI-assisted travel planning application that helps users plan flights, lodging, and personalized itineraries within their budget.

## Features

### Core Features
- AI-powered travel recommendations using OpenAI GPT-4o-mini with real data access via MCP servers
- Budget allocation between flights and lodging
- Interactive flight and lodging selection
- Real-time budget visualization with charts and progress bars

### 🗓️ Smart Itinerary Generator (NEW!)
- **Personalized Day-by-Day Planning**: AI creates custom itineraries based on your interests
- **Real Weather Integration**: Activities adapt to actual weather forecasts
- **Travel Pace Options**: Choose between slow (relaxed), moderate (balanced), or fast (packed) schedules
- **Interest-Based Recommendations**: Select from 10 interest categories (culture, food, adventure, etc.)
- **Budget-Conscious**: Set daily budgets and get cost estimates for each activity
- **Detailed Timelines**: Morning, afternoon, and evening plans with specific activities
- **Local Recommendations**: Real restaurant and attraction suggestions
- **Packing Tips**: Custom packing advice based on your destination and dates
- **Print-Friendly**: Export your itinerary for offline access

### Design
- Responsive design for mobile and desktop
- Beautiful timeline UI with expandable day cards
- Weather icons and activity badges

## Tech Stack

**Frontend:**
- React with Vite
- Recharts for data visualization
- CSS3 for styling

**Backend:**
- Node.js with Express
- OpenAI API (GPT-4o-mini) for AI recommendations
- Real flight and lodging data via OpenAI's MCP server integrations
- Weather data integration through MCP servers

## Local Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd travel-planning-app
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Create a `.env` file in the `backend` directory:
```bash
cp .env.example .env
```

5. Add your OpenAI API key to the `.env` file:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

### Running Locally

1. Start the backend server (from the `backend` directory):
```bash
npm run dev
```

The backend will run on http://localhost:3001

2. In a new terminal, start the frontend (from the `frontend` directory):
```bash
npm run dev
```

The frontend will run on http://localhost:5173

3. Open your browser and navigate to http://localhost:5173

## Deployment to Vercel

### Step 1: Prepare Your Repository

1. Make sure all your code is committed to a Git repository (GitHub, GitLab, or Bitbucket)
2. Push your changes to the remote repository

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in with your Git provider
2. Click "Add New Project"
3. Import your repository
4. Configure the project:
   - Framework Preset: Vite
   - Root Directory: `./frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables in the Vercel dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key
6. Click "Deploy"

### Step 3: Configure Backend on Vercel

The backend is configured to run as a serverless function on Vercel. The `vercel.json` file in the root directory handles the routing between frontend and backend.

### Step 4: Update API Endpoint

After deployment, update the API endpoint in the frontend code:

In `frontend/src/components/TripPlanner.jsx`, change:
```javascript
fetch('http://localhost:3001/api/recommendations', ...)
```

To:
```javascript
fetch('/api/recommendations', ...)
```

This will use relative URLs that work both locally (with a proxy) and in production.

### Environment Variables

Make sure to add the following environment variable in your Vercel project settings:
- `OPENAI_API_KEY`: Your OpenAI API key

## Project Structure

```
travel-planning-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TripPlanner.jsx
│   │   │   ├── BudgetInput.jsx
│   │   │   ├── FlightOptions.jsx
│   │   │   ├── LodgingOptions.jsx
│   │   │   ├── AIRecommendations.jsx
│   │   │   └── BudgetVisualization.jsx
│   │   ├── styles/
│   │   │   └── TripPlanner.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── index.js
│   ├── .env.example
│   └── package.json
├── vercel.json
├── .gitignore
└── README.md
```

## Usage

1. Enter your destination, travel dates, and budget
2. Optionally add preferences (e.g., "direct flights preferred")
3. Click "Get AI Recommendations"
4. Review the AI's suggestions
5. Select your preferred flight and lodging options
6. View the budget breakdown and visualization

## Features in Detail

### AI Recommendations
The app uses OpenAI's GPT-4 to analyze available options and provide personalized recommendations based on your budget and preferences.

### Budget Visualization
- Real-time pie chart showing budget allocation
- Progress bar indicating budget usage
- Detailed cost breakdown
- Over-budget warnings

### Flexible Planning
- Manual selection of flights and lodging
- Compare multiple options
- See total costs in real-time

## Budget Considerations

This app is designed to stay under $700 for the entire project:
- OpenAI API: ~$100-200 (depending on usage)
- Vercel hosting: Free tier (sufficient for demo)
- Domain (optional): ~$10-15/year

Total estimated cost: ~$100-200 for development and demo

## Future Enhancements

Potential features for future versions:
- Real-time pricing data integration
- Multi-city trip planning
- Export itinerary as PDF
- User accounts and saved trips
- Alternative date suggestions
- Price alerts and tracking

## License

MIT

## Support

For issues or questions, please create an issue in the GitHub repository.
