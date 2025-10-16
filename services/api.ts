import { Message } from '../types';
import { MODEL_NAME } from '../constants';

const API_KEY = process.env.API_KEY;

export const fetchChatCompletion = async (messages: Message[]): Promise<string> => {
  if (!API_KEY) {
    return "Eep! The API key isn't configured... I can't talk right now. *sad noises* The site owner needs to fix it.";
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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

    if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenRouter API error:", errorData);
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Error fetching chat completion:", error);
    if (error instanceof Error) {
        return `omg, sorry! I had a little problem... >.< Could you try again? (${error.message})`;
    }
    return "Oopsie, something went wrong! *cries* Please try again in a bit!";
  }
};