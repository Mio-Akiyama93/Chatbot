import { Message } from '../types';
import { OPENROUTER_API_URL, MODEL_NAME, API_REFERER, API_TITLE } from '../constants';

export const fetchChatCompletion = async (messages: Message[]): Promise<string> => {
  // The API key is expected to be available in the environment variables.
  // In a Vercel deployment, this would be configured in the project settings as OPENROUTER_API_KEY.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return "Eep! The API key isn't configured... I can't talk right now. *sad noises* The site owner needs to fix it.";
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': API_REFERER,
        'X-Title': API_TITLE,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.error?.message || 'Failed to fetch response from API');
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
