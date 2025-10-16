import { Message } from '../types';

export const fetchChatCompletion = async (messages: Message[]): Promise<string> => {
  try {
    const response = await fetch("/api/proxy", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Proxy API error:", errorData);
        const message = errorData.error?.message || `HTTP error! status: ${response.status}`;
        if (response.status === 500 && errorData.error?.includes("API key is not configured")) {
             return "Eep! The API key isn't configured... I can't talk right now. *sad noises* The site owner needs to fix it on Vercel.";
        }
        throw new Error(message);
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