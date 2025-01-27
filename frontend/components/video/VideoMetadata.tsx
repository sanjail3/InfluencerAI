"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Wand2, Music, User } from 'lucide-react';

export function VideoMetadata() {
  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Video Details Card */}
      <Card className="bg-gradient-to-br from-purple-900/40 via-purple-800/20 to-black border-purple-700/30 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Video Details</h2>
        
        <div className="space-y-4">
          <MetadataItem
            icon={Clock}
            label="Duration"
            value="00:30"
          />
          <MetadataItem
            icon={Wand2}
            label="Style"
            value="Modern & Dynamic"
          />
          <MetadataItem
            icon={Music}
            label="Background Track"
            value="Bladerunner"
          />
          <MetadataItem
            icon={User}
            label="Avatar"
            value="Elena"
          />
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-purple-900/40 via-purple-800/20 to-black border-purple-700/30 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-purple-200 hover:text-white hover:bg-purple-900/50"
          >
            Create Similar Video
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-purple-200 hover:text-white hover:bg-purple-900/50"
          >
            Edit Script
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-purple-200 hover:text-white hover:bg-purple-900/50"
          >
            Change Music
          </Button>
        </div>
      </Card>
    </div>
  );
}

function MetadataItem({ icon: Icon, label, value }: { 
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center">
        <Icon className="w-4 h-4 text-purple-400" />
      </div>
      <div>
        <p className="text-sm text-purple-300">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );
}