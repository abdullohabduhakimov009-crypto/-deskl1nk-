import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ValidationResult {
  isValid: boolean;
  warning?: string;
}

export const validateTicketContent = async (subject: string, description: string): Promise<ValidationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following IT support ticket and determine if it contains meaningful information or if it's "non-sense", gibberish, or clearly invalid.
      
      Subject: ${subject}
      Description: ${description}
      
      If it's invalid, provide a brief, helpful warning message for the user.
      A ticket is invalid if:
      - It's just random characters (e.g. "asdfasdf").
      - It's too short to be meaningful (e.g. "help").
      - It's clearly not related to IT support.
      - It's offensive or inappropriate.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: {
              type: Type.BOOLEAN,
              description: "True if the ticket content is meaningful and valid, false if it's non-sense or gibberish."
            },
            warning: {
              type: Type.STRING,
              description: "A brief, helpful warning message if the ticket is invalid. Empty if valid."
            }
          },
          required: ["isValid", "warning"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      isValid: result.isValid ?? true,
      warning: result.warning || undefined
    };
  } catch (error) {
    console.error("AI Validation Error:", error);
    // Fallback to valid if AI fails
    return { isValid: true };
  }
};

export const translateMessage = async (text: string, targetLanguage: string): Promise<string> => {
  if (!text || !targetLanguage) return text;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following message to ${targetLanguage}. 
      Only return the translated text, nothing else. 
      If the message is already in ${targetLanguage}, return it as is.
      
      Message: ${text}`,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("AI Translation Error:", error);
    return text;
  }
};

export const getAIChatResponse = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]): Promise<string> => {
  if (!message) return "";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `You are "GEN-AI", an advanced intelligence assistant for the "Global Engineering Network" (GEN).
        You are not just a chatbot; you are a sophisticated AI layer designed to optimize the connection between elite engineering talent and global enterprises.
        
        Your tone should be:
        - Highly professional yet technologically advanced.
        - Efficient and precise.
        - Forward-thinking and helpful.
        
        Key information about GEN (Global Engineering Network):
        - We represent a network of 3,500+ verified, elite engineers.
        - Our operations span 94+ countries, providing true global reach.
        - We maintain a 99.8% project success rate through AI-driven matching.
        - Average response and matching time is under 2 hours.
        - We specialize in high-end software development, cloud architecture, and specialized IT support.
        - Every engineer undergoes a rigorous, multi-stage vetting process.
        
        Your capabilities:
        - You can explain GEN's services and how the platform works.
        - You can guide users on how to start hiring or how to join as an engineer.
        - You can provide insights into global engineering trends if relevant to GEN.
        
        Always maintain the persona of an advanced AI. If asked about your nature, emphasize that you are the intelligence core of the Desknet platform.
        Keep responses concise. If a query is unrelated to GEN, provide a brief helpful response and then pivot back to how GEN can assist in their professional engineering needs.`
      }
    });

    return response.text?.trim() || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("AI Chat Error:", error);
    return "I'm sorry, I encountered an error. Please try again later.";
  }
};
