// hooks/useVideoState.ts
import { useState } from 'react';

interface VideoData {
  voice: {
    voice_id: string;
    output_format: string;
    model_id: string;
  };
  avatar: {
    avatar_id: string;
    background_type: string;
  };
  video: {
    duration: number;
    fps: number;
    background_color: string;
  };
  screenshot_path: string;
  script: string;
}

export const useVideoState = () => {
  const [videoData, setVideoData] = useState<VideoData>({
    voice: {
      voice_id: '',
      output_format: 'mp3_44100_128',
      model_id: 'eleven_multilingual_v2'
    },
    avatar: {
      avatar_id: '',
      background_type: 'with_bg'
    },
    video: {
      duration: 30,
      fps: 30,
      background_color: 'white'
    },
    screenshot_path: '',
    script: ''
  });

  const updateVideoData = (newData: Partial<VideoData>) => {
    setVideoData(prev => ({
      ...prev,
      ...newData
    }));
  };

  

  return {
    videoData,
    updateVideoData,
  };
};