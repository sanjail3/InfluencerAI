import { WaitlistForm } from '../waitlist-form';

export function CTA() {
  return (
    <section id="waitlist-section" className="relative bg-gradient-to-br from-purple-600 to-purple-800 py-24 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="mb-6 text-4xl font-bold">Ready to Transform Your Content Strategy? 🚀</h2>
        <p className="mb-12 text-lg text-purple-100">
          Join the waitlist today and be among the first to experience the future of AI-powered content creation ✨
        </p>
        <WaitlistForm />
      </div>
    </section>
  );
}