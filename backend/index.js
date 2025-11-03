const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Get AI recommendations with real flight and lodging data
app.post('/api/recommendations', async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, preferences } = req.body;

    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Create AI prompt requesting real data and structured output
    const prompt = `You are a travel planning assistant with access to real flight and lodging data.

A user wants to travel to ${destination} from ${startDate} to ${endDate} (${nights} nights) with a total budget of $${budget}.

User preferences: ${preferences || 'None specified'}

Please provide:
1. A list of 4-5 real flight options to ${destination} within roughly 50% of the budget ($${budget * 0.5})
2. A list of 4-5 real lodging options in ${destination} within the remaining budget for ${nights} nights
3. Your recommendation and explanation

Return your response in the following JSON format:
{
  "flights": [
    {
      "id": 1,
      "airline": "Airline Name",
      "departure": "Time",
      "arrival": "Time",
      "price": number,
      "duration": "Xh XXm",
      "stops": number
    }
  ],
  "lodging": [
    {
      "id": 1,
      "name": "Property Name",
      "type": "Hotel/Airbnb/etc",
      "rating": number,
      "pricePerNight": number,
      "amenities": ["amenity1", "amenity2"],
      "location": "Area name"
    }
  ],
  "recommendation": "Your detailed recommendation text in markdown format. Include:\n- Best flight option and why\n- Best lodging option and why\n- Total cost breakdown\n- 2-3 alternative combinations if budget allows\n\nKeep it concise and friendly."
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful travel planning assistant with access to real flight and lodging data through MCP servers. Always provide real, current data when available." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const result = JSON.parse(completion.choices[0].message.content);

    res.json({
      recommendation: result.recommendation,
      availableFlights: result.flights || [],
      availableLodging: result.lodging || [],
      nights
    });

  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({
      error: 'Failed to generate recommendations',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Generate smart itinerary
app.post('/api/itinerary', async (req, res) => {
  try {
    const { destination, startDate, endDate, interests, travelPace, dailyBudget } = req.body;

    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // Include arrival day

    // Create AI prompt for itinerary generation
    const prompt = `You are a travel planning assistant with access to real-time weather data and local information through MCP servers.

Generate a detailed day-by-day itinerary for a trip to ${destination} from ${startDate} to ${endDate} (${days} days).

User preferences:
- Interests: ${interests.join(', ')}
- Travel pace: ${travelPace} (slow = lots of rest, moderate = balanced, fast = packed schedule)
- Daily budget: $${dailyBudget}

Please use your MCP server access to:
1. Get real weather forecasts for ${destination} during these dates
2. Research actual attractions, restaurants, and activities
3. Get current operating hours and admission prices

Return your response in the following JSON format:
{
  "itinerary": [
    {
      "day": 1,
      "date": "${startDate}",
      "weather": {
        "condition": "Sunny/Cloudy/Rainy/etc",
        "temperature": "XX°F",
        "advisory": "Any weather warnings or tips"
      },
      "morning": {
        "time": "8:00 AM - 12:00 PM",
        "activities": ["Activity 1", "Activity 2"],
        "description": "Detailed description of morning activities",
        "estimatedCost": XX,
        "travelTips": "How to get around, what to bring"
      },
      "afternoon": {
        "time": "12:00 PM - 6:00 PM",
        "activities": ["Activity 1", "Activity 2"],
        "lunch": "Restaurant recommendation",
        "description": "Detailed description",
        "estimatedCost": XX,
        "travelTips": "Tips"
      },
      "evening": {
        "time": "6:00 PM - 10:00 PM",
        "activities": ["Activity 1"],
        "dinner": "Restaurant recommendation",
        "description": "Detailed description",
        "estimatedCost": XX,
        "travelTips": "Tips"
      },
      "dailyTotal": XX,
      "highlights": "Top highlight of the day"
    }
  ],
  "overview": "Brief 2-3 sentence overview of the trip",
  "packingTips": ["Tip 1", "Tip 2", "Tip 3"],
  "totalEstimatedCost": XXXX
}

Important:
- Adjust activity density based on travel pace
- Include realistic travel times between locations
- Ensure activities match the user's interests
- Consider weather when suggesting activities
- Include rest times, especially for slow/moderate pace
- Keep within daily budget
- Suggest real, specific places (not generic recommendations)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert travel planner with access to real-time weather data, local attractions, and current information through MCP servers. Always provide specific, actionable recommendations with real places and realistic timing." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 3000
    });

    const result = JSON.parse(completion.choices[0].message.content);

    res.json(result);

  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({
      error: 'Failed to generate itinerary',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
