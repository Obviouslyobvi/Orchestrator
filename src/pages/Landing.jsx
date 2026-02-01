import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import PricingCards from '../components/PricingCards';
import LiveRankingsSection from '../components/LiveRankingsSection';
import MemoryFeatureSection from '../components/MemoryFeatureSection';
import { Link } from 'react-router-dom';

const comparisons = [
  {
    model: 'ChatGPT',
    description: 'Best for creative brainstorming and marketing hooks.'
  },
  {
    model: 'Claude',
    description: 'Best for nuanced writing and long-form clarity.'
  },
  {
    model: 'Gemini',
    description: 'Best for analyzing data and spotting bugs fast.'
  }
];

const features = [
  {
    title: 'Live Model Routing',
    description: 'Checks real-time benchmarks to always pick the best model.'
  },
  {
    title: 'Prompt Builder',
    description: 'Generates optimized, copy-ready prompts for each model.'
  },
  {
    title: 'Persistent Memory',
    description: 'Remembers your context, preferences, and decisions across devices.'
  },
  {
    title: 'Project Tracker',
    description: 'See all your projects, steps, and progress in one place.'
  },
  {
    title: 'Google Drive Sync',
    description: 'Everything saves to your Google Drive automatically.'
  },
  {
    title: 'Benchmark Transparency',
    description: 'See exactly why each model was chosen, with its current score.'
  }
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-base text-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <LiveRankingsSection />
      <MemoryFeatureSection />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-surface p-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Why Not Just Use One AI?</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-muted">
              Comparison
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {comparisons.map((item) => (
              <div
                key={item.model}
                className="rounded-2xl border border-border bg-base p-5"
              >
                <h3 className="text-lg font-semibold">{item.model}</h3>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="features" className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h2 className="text-3xl font-semibold">Features</h2>
            <p className="mt-2 text-sm text-muted">
              Everything you need to orchestrate multi-model workflows.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PricingCards />
      <section className="px-6 py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-3xl border border-border bg-surface p-12 text-center">
          <h2 className="text-3xl font-semibold">Ready to orchestrate?</h2>
          <p className="text-sm text-muted">
            Build your next project with every AI model working in harmony.
          </p>
          <Link
            to="/app"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black shadow-soft"
          >
            Launch the App
          </Link>
        </div>
      </section>
      <footer className="border-t border-border px-6 py-10 text-sm text-muted">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <span className="font-semibold text-white">OrchestrateAI</span>
          <div className="flex gap-6">
            <a href="#how-it-works" className="hover:text-white">
              How It Works
            </a>
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
          </div>
          <span>© 2026 OrchestrateAI</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
