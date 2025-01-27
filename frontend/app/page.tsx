import { ThemeToggle } from '@/components/landing-page/theme-toggle';
import { Rocket } from 'lucide-react';
import { Hero } from '@/components/landing-page/sections/hero';
import { Problems } from '@/components/landing-page/sections/problems';
import { Solutions } from '@/components/landing-page/sections/solutions';
import { CTA } from '@/components/landing-page/sections/cta';
import { LandingPagePricing } from '@/components/landing-page/pricing-page';


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-purple-950">
      <header className="border-b">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold">Influencer AI</span>
          </div>
          <ThemeToggle />
        </nav>
      </header>

      <main>
        <Hero />
        <Problems />
        <Solutions />
        <LandingPagePricing />
        <CTA />
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Influencer AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}