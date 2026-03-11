import { GoogleGenAI } from "@google/genai";
import { BankingDecision, BankingMetrics } from "../../types";

export async function generateJustification(
  decision: BankingDecision,
  metrics: BankingMetrics
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "API Key not found. Please configure GEMINI_API_KEY.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    Explain why this banking transaction was ${decision} based on the following metrics:
    - IR (Irreversibility): ${metrics.IR.toFixed(2)}
    - CIZ (Conflict Zone): ${metrics.CIZ.toFixed(2)}
    - DTS (Time Sensitivity): ${metrics.DTS.toFixed(2)}
    - TSG (Total Guard): ${metrics.TSG.toFixed(2)}
    
    Provide a professional and concise justification for a bank administrator.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash-latest",
      contents: prompt,
    });
    return response.text || "No justification generated.";
  } catch (error) {
    console.error("Error generating justification:", error);
    return "Error generating justification via Gemini AI.";
  }
}
