import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { destination, startDate, endDate, interests, travelPace, dailyBudget } = req.body;

    // Validate required fields
    if (!destination || !startDate || !endDate || !interests || !travelPace || !dailyBudget) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['destination', 'startDate', 'endDate', 'interests', 'travelPace', 'dailyBudget']
      });
    }

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

    res.status(200).json(result);

  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({
      error: 'Failed to generate itinerary',
      details: error.message
    });
  }
}