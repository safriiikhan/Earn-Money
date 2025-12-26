
import { GoogleGenAI } from "@google/genai";
import { PACKAGES, DAILY_AD_LIMIT, AD_RATE, REFERRAL_BONUS } from '../constants';

const getPlatformContext = () => {
  const packageInfo = Object.values(PACKAGES)
    .filter(p => p.price > 0)
    .map(p => `- ${p.name}: Cost $${p.price}, Daily Max $${p.dailyEarning}, Min Withdraw $${p.minWithdraw}`)
    .join('\n');

  return `
    AdVault Platform Information:
    - Business Model: Watch ads and earn money.
    - Daily Ad Limit: ${DAILY_AD_LIMIT} ads.
    - Earning per Ad: $${AD_RATE}.
    - Referral Bonus: $${REFERRAL_BONUS.toFixed(2)} per active friend.
    - Packages:
    ${packageInfo}
    - Withdrawal Methods: Binance Pay, JazzCash, EasyPaisa (currently JazzCash/Binance preferred).
    - Support: Processing takes 1-6 hours for plans and 24-48 hours for withdrawals.
  `;
};

/**
 * Fetches earning tips from the AI.
 */
export const getEarningTips = async (userBalance: number, currentPackage: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "Maximize your earnings by watching all 100 daily ads and referring active friends!";

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User has a balance of $${userBalance} and is on the ${currentPackage} package. Give 2 short, encouraging tips on how they can maximize their earnings on AdVault.`,
      config: {
        systemInstruction: "You are a helpful Earning Assistant for AdVault. Keep it brief and professional.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Tips error:", error);
    return "Watch 100 ads daily to maximize your package's earning potential.";
  }
};

/**
 * Handles chatbot interaction.
 */
export const getChatResponse = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], userMessage: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "I'm having trouble connecting to my brain right now. Please check your API key.";

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history, { role: 'user', parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: `You are AdVault AI, a friendly and professional support assistant for the AdVault premium earning platform. 
        Your goal is to help users understand packages, earning strategies, and platform features.
        
        ${getPlatformContext()}
        
        Guidelines:
        - Be encouraging and helpful.
        - If asked about earning more, suggest upgrading packages or referring friends.
        - Always keep responses concise (max 3-4 sentences).
        - If asked about technical issues, tell them to contact support via the dashboard.`,
        temperature: 0.8,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Chat AI error:", error);
    return "I'm sorry, I encountered an error. How else can I assist you with AdVault?";
  }
};
