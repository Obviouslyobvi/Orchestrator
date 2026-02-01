const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started.',
    features: [
      'Up to 5 active projects',
      'Basic memory (20 items)',
      'Live model routing'
    ]
  },
  {
    name: 'Pro',
    price: '$10/mo',
    description: 'For power users and teams.',
    features: [
      'Unlimited projects',
      'Unlimited memory',
      'Custom model preferences'
    ]
  }
];

const PricingCards = () => {
  return (
    <section id="pricing" className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold">Pricing</h2>
          <p className="mt-2 text-sm text-muted">
            Simple pricing to get you orchestrating in minutes.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-2xl border border-border bg-surface p-8"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <span className="text-2xl font-semibold text-accent">
                  {plan.price}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{plan.description}</p>
              <ul className="mt-6 space-y-2 text-sm text-muted">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black">
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingCards;
