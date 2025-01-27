export function Problems() {
  return (
    <section className="bg-purple-50 py-16 dark:bg-purple-950/30">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Struggling with Content Creation? 🤔
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          <ProblemCard
            emoji="⏰"
            title="Time-Consuming Content Creation"
            description="Hours spent filming, editing, and managing social media posts"
          />
          <ProblemCard
            emoji="💰"
            title="Expensive Production Costs"
            description="High costs of hiring creators and production teams"
          />
          <ProblemCard
            emoji="📊"
            title="Inconsistent Results"
            description="Unpredictable engagement and conversion rates"
          />
          <ProblemCard
            emoji="🎯"
            title="Scaling Challenges"
            description="Difficulty maintaining quality while growing presence"
          />
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border-2 border-purple-200/20 bg-white p-6 shadow-sm dark:bg-purple-900/5">
      <div className="mb-4 text-4xl">{emoji}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}