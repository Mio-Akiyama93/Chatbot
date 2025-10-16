// This is a Vercel serverless function that acts as a proxy to the OpenRouter API.
// It allows us to keep the API key secret on the server.
// Create a file at /api/proxy.ts with this content.

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages, model } = request.body;
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.error("API_KEY environment variable not set on Vercel.");
    return response.status(500).json({ error: "The API key is not configured on the server." });
  }

  if (!messages || !model) {
    return response.status(400).json({ error: "Missing 'messages' or 'model' in request body." });
  }

  // Dynamically set headers based on the request's origin for portability
  const referer = request.headers.referer || 'https://chatbot-chi-topaz.vercel.app/'; // A fallback
  const siteUrl = new URL(referer).origin;
  const siteTitle = new URL(referer).hostname;

  try {
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        // Recommended headers for free usage, now dynamic
        'HTTP-Referer': siteUrl, 
        'X-Title': `Yui AI Chatbot (${siteTitle})`,
      },
      body: JSON.stringify({
        model: model,
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