import { Link } from 'react-router-dom';

const navItems = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' }
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-base/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          OrchestrateAI
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Link
          to="/app"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black shadow-soft transition hover:scale-105"
        >
          Launch App
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
