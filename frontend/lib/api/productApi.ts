import { ApiResponse } from "../types/product";
import { dummyProductData } from "../data/dummyProduct";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export async function fetchProductInfo(url: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/information_extractor1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error('Failed to fetch product information');
    }

    return await response.json();
  } catch (error) {
    console.log('Using dummy data due to API error:', error);
    // throw new Error('Failed to fetch product information');
    return dummyProductData;
  }
}