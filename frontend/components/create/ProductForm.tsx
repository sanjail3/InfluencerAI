import  { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import AnimatedGradientText from '../ui/gradient-text';
import { LoadingSpinner } from "./LoadingSpinner";
import { ScriptSelector } from "./ScriptSelector";
import { generateScripts } from '@/lib/api/scriptApi';
import { Script } from '@/lib/types/script';
import Image from 'next/image';

interface ProductFormProps {
  productInfo: {
    product_name: string;
    product_description: string;
    problem_their_solving: string;
    unique_selling_point: string;
    features: string;
    pricing: string;
  };
  screenshot: string;
  onBack: () => void;
  screenshot_data: string;
}

export function ProductForm({ productInfo, screenshot, onBack, screenshot_data }: ProductFormProps) {
  const [formData, setFormData] = useState(productInfo);
  const [isGeneratingScripts, setIsGeneratingScripts] = useState(false);
  const [scripts, setScripts] = useState<Script[]>([]);

  const [scriptData, setscriptData] = useState({
    product_info: {
      ...productInfo, // The main product data
    },
    duration: 30, // Default value
    language: "English", // Default value
    tone: "professional", // Default value
    target_audience: "diabetes patients", // Default value
  }
  )

  const formFields = [
    { key: 'product_name', rows: 2 },
    { key: 'product_description', rows: 4 },
    { key: 'problem_their_solving', rows: 3 },
    { key: 'unique_selling_point', rows: 3 },
    { key: 'features', rows: 3 },
    { key: 'pricing', rows: 2 }
  ];
  const handleNext = async () => {
    setIsGeneratingScripts(true);
    // updateVideoData({
    //   screenshot_path: screenshot
    // });
    try {
      const response = await generateScripts(scriptData);
      setScripts(response.scripts);
    } catch (error) {
      console.error('Error generating scripts:', error);
    } finally {
      setIsGeneratingScripts(false);
    }
  };

  if (isGeneratingScripts) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner text="Generating scripts..." />
      </div>
    );
  }

  if (scripts.length > 0) {
    return (
      <ScriptSelector 
        scripts={scripts} 
        onBack={() => setScripts([])} 
        onRegenerate={handleNext}
        screenshot_data={screenshot_data}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <BackgroundGradient className="rounded-[22px] p-1">
        <Card className="border-0 p-6 sm:p-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h1 className="text-center text-2xl sm:text-3xl mb-8 font-bold text-foreground/90">Product Details</h1>
          
          {/* <AnimatedGradientText className="text-center text-2xl sm:text-3xl mb-8 font-bold from-blue-300 via-blue-600 to-purple-300">
            
          </AnimatedGradientText> */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {formFields.slice(0, 3).map(({ key, rows }) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium font-bold">
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                  <Textarea
                    value={formData[key as keyof typeof formData]}
                    onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                    className="w-full resize-none border border-purple-600/40 rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows={rows}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="aspect-video rounded-lg border border-purple-600/40 shadow-lg shadow-purple-900/20 overflow-hidden mb-6">
                <div className="relative w-full h-full">
                  <Image
                    src={screenshot}
                    alt="Product screenshot"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {formFields.slice(3).map(({ key, rows }) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium text-foreground/90">
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                  <Textarea
                    value={formData[key as keyof typeof formData]}
                    onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                    className="w-full resize-none border border-purple-600/40 rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows={rows}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-foreground/90 hover:text-foreground hover:bg-foreground/10"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-[#d550ac] to-[#7773FA]  text-white hover:opacity-90 transition-opacity"
            >
              Next
            </Button>
          </div>
        </Card>
      </BackgroundGradient>
    </div>
  );
}