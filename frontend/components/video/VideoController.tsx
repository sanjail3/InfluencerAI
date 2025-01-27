"use client";

import { Button } from "@/components/ui/button";
import { Download, Share2, Heart } from 'lucide-react';
import { formStyles } from '@/lib/styles/formStyles';

interface VideoControlsProps {
  videoUrl: string;
}

export function VideoControls({ videoUrl }: VideoControlsProps) {
  const handleDownload = async () => {
    try {
      // Fetch the video file
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Set the filename for download
      const filename = videoUrl.split('/').pop() || 'video.mp4';
      link.download = filename;
      
      // Append link to body, click it, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Revoke the blob URL to free up memory
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading video:', error);
      // Fallback to direct link if fetch fails
      window.open(videoUrl, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my AI-generated video!',
          url: videoUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-[400px] mt-6 flex items-center justify-between gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-full  hover:bg-purple-900/40 text-purple-300"
      >
        <Heart className="w-6 h-6" />
      </Button>

      <Button
        onClick={handleDownload}
        className={`${formStyles.button.primary} bg-gradient-to-r from-[#d550ac] to-[#7773FA] flex-1 h-12 rounded-full font-medium`}
      >
        <Download className="w-5 h-5 mr-2" />
        Download Video
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleShare}
        className="w-12 h-12 rounded-full hover:bg-purple-900/40 text-purple-300"
      >
        <Share2 className="w-6 h-6" />
      </Button>
    </div>
  );
}