import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  emoji: string;
}

export function FeatureCard({ icon: Icon, title, description, emoji }: FeatureCardProps) {
  return (
    <Card className="border-2 border-purple-200/20 bg-gradient-to-br from-white/5 to-purple-500/5">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
            <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-2xl">{emoji}</span>
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}