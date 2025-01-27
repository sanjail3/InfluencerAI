"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, Play } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GlitchText from "../ui/glitch-text";
import { CreateProjectDialog } from "./CreateProjectDialog";



export function FeaturedProducts() {
  const router = useRouter();

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Featured Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-purple-900/40 to-black relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-black/90 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2000&auto=format&fit=crop"
            alt="AI Video"
            width={800}
            height={400}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                {/* <h3 className="text-2xl font-bold mb-3">AI Video Ads</h3> */}
                <GlitchText
                  starCount={50}
                  text="AI Video Ads"
                />
                <p className="text-purple-200 text-lg mb-6">
                  Make engaging video ads with a few clicks
                </p>
                <div className="flex gap-3">
                <CreateProjectDialog />
                  <Button variant="ghost" className="bg-purple-900/30 backdrop-blur-sm">
                    <GraduationCap className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-400/90 text-black font-medium rounded-full text-sm">
                Hot
              </span>
            </div>
            {/* Rest of the component remains the same */}
          </div>
        </Card>
        {/* Second card remains the same */}
      </div>
    </div>
  );
}