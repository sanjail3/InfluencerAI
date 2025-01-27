import { CreatorResponse } from '../types/creator';

export const dummyCreatorData: CreatorResponse = {
  creators: [
    {
      id: "1",
      name: "Alana",
      preview_url: "https://example.com/alana-preview.mp4",
      gender: "female",
      description: "Cloned actor, young woman"
    },
    {
      id: "2",
      name: "James",
      preview_url: "https://example.com/james-preview.mp4",
      gender: "male",
      description :"Cloned actor, middle-aged man"
    }
  ],
  voices: [
    {
      voice_id: "21m00Tcm4TlvDq8ikWAM",
      name: "Rachel",
      accent: "american",
      description: "calm",
      age: "young",
      gender: "female",
      use_case: "narration",
      preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/preview.mp3"
    },
    {
      voice_id: "29vD33N1CtxCmqQRPOHJ",
      name: "Michael",
      accent: "american",
      description: "professional",
      age: "middle-aged",
      gender: "male",
      use_case: "narration",
      preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/29vD33N1CtxCmqQRPOHJ/preview.mp3"
    }
  ]
};