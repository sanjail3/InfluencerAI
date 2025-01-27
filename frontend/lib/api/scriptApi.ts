import { ScriptResponse } from "../types/script";
import { dummyScriptData } from "../data/dummyScripts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export async function generateScripts(productInfo: any): Promise<ScriptResponse> {
  try {
    const response = await fetch(`${API_URL}/generate_scripts1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productInfo),
    });

    if (!response.ok) {
      throw new Error('Failed to generate scripts');
    }

    return await response.json();
  } catch (error) {
    console.log('Using dummy script data due to API error:', error);
    // throw new Error('Failed to fetch product information');
    return dummyScriptData;
  }
}