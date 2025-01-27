"use client";

import { useSearchParams } from 'next/navigation';
import { VideoPlayer } from "@/components/video/Videoplayer";
import { VideoControls } from "@/components/video/VideoController";
import { LoadingSpinner } from "@/components/create/LoadingSpinner";
import { CreatePageHeader } from '@/components/create/CreatePageHeader';
import React, { Suspense, useEffect, useState } from 'react';

interface Video {
  id: string;
  title: string;
  description: string;
  blobUrl: string;
  status: string;
  createdAt: string;
}

export default function VideoOutputPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VideoOutputContent />
    </Suspense>
  );
}

function VideoOutputContent() {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('url');
  const projectId = searchParams.get('projectId');
  const [projectVideos, setProjectVideos] = useState<Video[]>([]);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (projectId) {
      fetchProjectVideos();
    }
  }, [projectId]);

  

  const fetchProjectVideos = async () => {
    try {
      const response = await fetch(`/api/videos/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      const videos = await response.json();
      setProjectVideos(videos);
    } catch (error) {
      console.error('Error fetching project videos:', error);
    }
  };

  if (!videoUrl) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CreatePageHeader 
          title="AI Video Ads"
          subtitle="Generate videos from your product links"
        />
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 flex flex-col items-center">
            <VideoPlayer videoUrl={videoUrl} />
            <VideoControls videoUrl={videoUrl} />
          </div>
          {projectVideos.length > 0 && (
            <div className="lg:w-1/3">
              <h3 className="text-xl font-semibold mb-4">Project Videos</h3>
              <div className="space-y-4">
                {projectVideos.map((video) => (
                  <div 
                    key={video.id} 
                    className="p-4 bg-purple-900/20 rounded-lg cursor-pointer hover:bg-purple-900/30"
                    onClick={() => window.location.href = `/create/video/output?url=${encodeURIComponent(video.blobUrl)}&projectId=${projectId}`}
                  >
                    <h4 className="font-medium">{video.title}</h4>
                    <p className="text-sm opacity-70">{new Date(video.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}