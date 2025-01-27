"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  Play, 
  Pause,
  Video, 
  Plus,
  Calendar,
  MoreVertical,
  Volume2,
  VolumeX
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/create/LoadingSpinner";
import { CreateProjectDialog } from "./CreateProjectDialog";

interface Project {
  id: string;
  name: string;
  websiteUrl: string;
  createdAt: string;
  videos: Video[];
}

interface Video {
  id: string;
  title: string;
  blobUrl: string;
  createdAt: string;
  status: string;
}

const VideoThumbnail = ({ video, onPlay }: { video: Video; onPlay: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        onPlay();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

 
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-900/40 to-pink-900/20">
      <video
        ref={videoRef}
        src={video.blobUrl}
        className="h-full w-full object-cover"
        muted={isMuted}
        loop
        playsInline
      />
      <div className="absolute inset-0 flex items-center justify-center  transition-opacity hover:bg-black/50">
        <div className="flex space-x-2">
          <Button
            size="icon"
            variant="secondary"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-purple-100" />
            ) : (
              <Play className="h-5 w-5 text-purple-100" />
            )}
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-purple-100" />
            ) : (
              <Volume2 className="h-5 w-5 text-purple-100" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVideo = async (projectId: string, videoId: string) => {
    try {
      await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
      });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            Your Projects
          </h1>
          <div className="w-full md:w-auto">
            <CreateProjectDialog>
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 transition-all w-full group"
              >
                <Plus className="w-4 h-4 mr-2 text-purple-100 group-hover:text-white" />
                <span className="text-purple-50 group-hover:text-white">New Project</span>
              </Button>
            </CreateProjectDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/30 hover:border-purple-500/50 transition-all overflow-hidden hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative">
                {project.videos.length > 0 ? (
                  <VideoThumbnail 
                    video={project.videos[0]} 
                    onPlay={() => setActiveVideo(project.videos[0].id)}
                  />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-pink-900/10 flex items-center justify-center">
                    <Video className="w-12 h-12 text-purple-400/30" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-purple-50">{project.name}</h3>
                    <div className="flex items-center text-purple-300/80 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(project.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-purple-200 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                      <DropdownMenuItem 
                        className="focus:bg-slate-700 text-purple-100"
                        onClick={() => router.push(`/create/video?projectId=${project.id}`)}
                      >
                        <Plus className="w-4 h-4 mr-2 text-purple-300" />
                        New Video
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="focus:bg-red-900/30 text-red-400"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  {project.videos.map((video) => (
                    <div 
                      key={video.id}
                      className="group bg-slate-800/20 hover:bg-slate-700/30 rounded-lg p-3 flex items-center justify-between transition-all border border-slate-700/30"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Video className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-purple-50 truncate">{video.title}</h4>
                          <Badge 
                            variant="outline" 
                            className="mt-1 border-none bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200"
                          >
                            {video.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-purple-300 hover:bg-purple-500/20"
                          onClick={() => router.push(`/create/video/output?url=${encodeURIComponent(video.blobUrl)}&projectId=${project.id}`)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/20"
                          onClick={() => handleDeleteVideo(project.id, video.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}