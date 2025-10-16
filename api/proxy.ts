// This is a Vercel serverless function that acts as a proxy to the OpenRouter API.
// It allows us to keep the API key secret on the server.
// Create a file at /api/proxy.ts with this content.

// Copied from constants.ts to avoid bundling issues with Vercel serverless functions.
const MODEL_NAME = 'deepseek/deepseek-chat-v3.1:free';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages } = request.body;
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.error("API_KEY environment variable not set on Vercel.");
    return response.status(500).json({ error: "The API key is not configured on the server." });
  }

  if (!messages) {
    return response.status(400).json({ error: "Missing 'messages' in request body." });
  }

  try {
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        // Recommended headers for free usage
        'HTTP-Referer': 'https://chatbot-chi-topaz.vercel.app/', 
        'X-Title': 'Yui AI Chatbot',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: messages,
      }),
    });

    const responseData = await openRouterResponse.json();

    if (!openRouterResponse.ok) {
      console.error("OpenRouter API error:", responseData);
      return response.status(openRouterResponse.status).json(responseData);
    }
    
    return response.status(200).json(responseData);

  } catch (error) {
    console.error("Error in proxy function:", error);
    return response.status(500).json({ error: "An internal server error occurred while contacting the AI model." });
  }
}