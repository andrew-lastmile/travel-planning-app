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
    const { destination, startDate, endDate, budget, preferences } = req.body;

    // Validate required fields
    if (!destination || !startDate || !endDate || !budget) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['destination', 'startDate', 'endDate', 'budget']
      });
    }

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

    res.status(200).json({
      recommendation: result.recommendation,
      availableFlights: result.flights || [],
      availableLodging: result.lodging || [],
      nights
    });

  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({
      error: 'Failed to generate recommendations',
      details: error.message
    });
  }
}