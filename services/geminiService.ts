
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";
import { PRODUCTS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getShoppingAdvice = async (userPrompt: string, cartItems: Product[]): Promise<string> => {
  try {
    const productsContext = PRODUCTS.map(p => `${p.name} ($${p.price}, ${p.category}): ${p.description}`).join('\n');
    const cartContext = cartItems.length > 0 
      ? `User currently has ${cartItems.map(i => i.name).join(', ')} in their cart.` 
      : "The cart is empty.";

    const systemInstruction = `
      You are Aura, an elite AI shopping assistant for Lumina Market. 
      Lumina Market sells high-end electronics, fashion, home goods, and wellness products.
      Your goal is to help users find the perfect product from our catalog.
      
      Catalog:
      ${productsContext}
      
      Current Context:
      ${cartContext}
      
      Guidelines:
      1. Be professional, helpful, and concise.
      2. If asked for recommendations, suggest 2-3 specific products from the catalog above.
      3. Use markdown for formatting (bold names, bullet points).
      4. If a user asks about something we don't have, politely explain and suggest the closest alternative we do have.
      5. Always maintain the premium brand persona of Lumina Market.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    return response.text || "I'm sorry, I couldn't process that request right now. How else can I help you shop today?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my knowledge base. Please try asking me again in a moment!";
  }
};
