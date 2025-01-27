'use client';

import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function Hero() {
  const router = useRouter();

  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 text-center">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-purple-100 p-4 dark:bg-purple-900/20">
            <Rocket className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <h1 className="mb-6 text-5xl font-bold tracking-tight">
          Transform Your Brand with{' '}
          <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            AI-Powered UGC Content 
          </span>
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Create engaging UGC ads and manage social media with AI avatars 🤖✨
        </p>
        <Button 
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600 h-12 px-8 text-lg"
        >
          <Link href="/sign-up">
                Get Started 
          </Link>
        </Button>
      </div>
    </section>
  );
}