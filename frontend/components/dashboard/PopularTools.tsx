import { Card } from "@/components/ui/card";
import { Play, Wand2, Video, LineChart } from "lucide-react";

const tools = [
  {
    title: "AI shorts",
    description: "Transform idea into viral videos",
    icon: Play,
  },
  {
    title: "AI editing",
    description: "Let AI edit your video",
    icon: Wand2,
  },
  {
    title: "Batch mode",
    description: "Generate dozens of videos at once",
    icon: Video,
  },
  {
    title: "Analytics",
    description: "Track your content performance",
    icon: LineChart,
  },
];

export function PopularTools() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Popular tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, index) => (
          <Card
            key={index}
            className="bg-gradient-to-br from-purple-900/30 via-purple-900/20 to-black/30 border-purple-800/30 p-6 rounded-xl hover:scale-105 transition-transform cursor-pointer backdrop-blur-sm"
          >
            <div className="bg-gradient-to-br from-purple-600/30 to-purple-900/30 p-3 rounded-lg w-fit mb-4">
              <tool.icon className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
            <p className="text-purple-200">{tool.description}</p>
          </Card>
        ))}
      </div>
    </>
  );
}