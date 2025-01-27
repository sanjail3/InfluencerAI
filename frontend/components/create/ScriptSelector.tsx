import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Script } from "@/lib/types/script";
import { Book, Lightbulb, ListChecks, MessageCircle, PlayCircle } from "lucide-react";
import { formStyles } from '@/lib/styles/formStyles';
import { CreatorSelector } from "./CreatorSelector";
import { fetchCreatorsAndVoices } from "@/lib/api/creatorApi";
import { LoadingSpinner } from './LoadingSpinner';


const icons = {
  "Don't Worry Style": MessageCircle, 
  "Storytime Style": Book,
  "Problem-Solution Style": Lightbulb,
  "3 Reasons Why Style": ListChecks,
  "Tutorial Style": PlayCircle,
};

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

interface ScriptSelectorProps {
  scripts: Script[];
  onBack: () => void;
  onRegenerate: () => void;
  fromColor?: string;
  viaColor?: string;
  toColor?: string;
  screenshot_data: string;
}

export function ScriptSelector({ 
  scripts, 
  onBack, 
  onRegenerate,
  fromColor = "#4158D0",
  viaColor = "#C850C0",
  toColor = "#FFCC70",
  screenshot_data,
}: ScriptSelectorProps) {
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [showCreatorSelector, setShowCreatorSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [creatorData, setCreatorData] = useState<any>(null);
 

  const handleScriptSelect = async (script: Script) => {
    setSelectedScript(script);
    // updateVideoData({ script: script.title })
    setIsLoading(true);
    try {
      const data = await fetchCreatorsAndVoices();
      setCreatorData(data);
      setShowCreatorSelector(true);
    } catch (error) {
      console.error('Error fetching creators:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner text="Fetching creators..." />
      </div>
    );
  }

  if (showCreatorSelector && creatorData) {
    return (
      <CreatorSelector
        creators={creatorData.creators}
        voices={creatorData.voices}
        onBack={() => setShowCreatorSelector(false)}
        onNext={(creator, voice) => {
          console.log('Selected creator:', creator, 'voice:', voice);
        }}
        screenshot_data={screenshot_data}
        selectedScript={selectedScript?.script||''}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className={`${formStyles.heading} text-2xl sm:text-3xl`}>
          Choose Your Script Style
        </h2>
        <p className="text-purple-200/90 text-base sm:text-lg mt-2">
          Select the script style that best fits your video
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {scripts.map((script, index) => {
          const Icon = icons[script.title as keyof typeof icons] || MessageCircle;
          return (
            <div
              key={index}
              className="rounded-3xl bg-gradient-to-r p-0.5 hover:shadow-glow hover:brightness-150 transition-all cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(to right, ${fromColor}, ${viaColor}, ${toColor})`,
              }}
              onClick={() => handleScriptSelect(script)}
            >
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r opacity-20 blur-20"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${fromColor}, ${viaColor}, ${toColor})`,
                  }}
                />
                <div 
                  className={`relative rounded-3xl bg-blue-950 p-6 transition-all ${
                    selectedScript?.title === script.title ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-purple-600/50 to-pink-600/50 group-hover:from-purple-500/60 group-hover:to-pink-500/60 transition-colors shadow-lg shadow-purple-900/20">
                      <Icon className="w-6 h-6 text-purple-100" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-purple-100">
                        {script.title}
                      </h3>
                      <p className="text-purple-200/90 line-clamp-3">
                        {script.script}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className={`${formStyles.button.ghost} hover:bg-purple-500/10`}
        >
          Back
        </Button>
        <Button
          onClick={onRegenerate}
          className={`bg-gradient-to-r from-[#d550ac] to-[#7773FA]  hover:shadow-glow hover:brightness-150`}
        >
          Regenerate
        </Button>
      </div>
    </div>
  );
}