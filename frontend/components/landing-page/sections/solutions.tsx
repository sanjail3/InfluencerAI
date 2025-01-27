import { FeatureCard } from '../feature-card';
import { Clock, Layout, Users, TrendingUp, MessageCircle, DollarSign } from 'lucide-react';

export function Solutions() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="mb-12 text-center text-3xl font-bold">
        Meet Your AI Content Solution 🎯
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={Clock}
          emoji="⚡"
          title="Automated Content Creation"
          description="Generate UGC-style content in minutes with AI avatars"
        />
        <FeatureCard
          icon={Layout}
          emoji="🎨"
          title="Smart Ad Creation"
          description="Create converting ads without design skills"
        />
        <FeatureCard
          icon={Users}
          emoji="🎭"
          title="AI Avatar Library"
          description="Access diverse AI presenters for your brand"
        />
        <FeatureCard
          icon={TrendingUp}
          emoji="📈"
          title="Performance Analytics"
          description="Track and optimize content performance"
        />
        <FeatureCard
          icon={MessageCircle}
          emoji="🤝"
          title="Smart Engagement"
          description="AI-powered community management"
        />
        <FeatureCard
          icon={DollarSign}
          emoji="💰"
          title="Cost Efficiency"
          description="90% lower cost than traditional UGC"
        />
      </div>
    </section>
  );
}