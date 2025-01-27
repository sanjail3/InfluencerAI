import { CreatorResponse } from '../types/creator';
import { dummyCreatorData } from '../data/dummyCreators';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export async function fetchCreatorsAndVoices(): Promise<CreatorResponse> {
  try {
    const voicesResponse = await fetch(`${API_URL}/get_voices`);
    const creatorsResponse = await fetch(`${API_URL}/get_creators`);

    if (!voicesResponse.ok || !creatorsResponse.ok) {
      throw new Error('Failed to fetch voices or creators');
    }

    const voices = await voicesResponse.json();
    const creators = await creatorsResponse.json();

    return {
      voices,
      creators,
    };
    
  } catch (error) {
    console.log('Using dummy creator data:', error);
    throw error;
  }
}