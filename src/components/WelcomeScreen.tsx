import { ShieldCheck, MapPin, Sparkles, ArrowRight } from 'lucide-react';

const BG_IMAGE =
  'https://images.pexels.com/photos/34459415/pexels-photo-34459415.jpeg?auto=compress&cs=tinysrgb&w=1080';

type WelcomeScreenProps = {
  onGetStarted: () => void;
  onLogIn: () => void;
};

export default function WelcomeScreen({ onGetStarted, onLogIn }: WelcomeScreenProps) {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-black font-sans text-white">
      <img
        src={BG_IMAGE}
        alt="Rumi Darwaza, Lucknow"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="relative z-10 flex min-h-[100dvh] flex-col px-6 pb-10 pt-14 sm:px-8">
        {/* Trust badge */}
        <div className="flex justify-center animate-fade-in">
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-teal-300" strokeWidth={2.5} />
            <span className="text-xs font-medium tracking-wide text-white/90 sm:text-sm">
              100% KYC Verified &amp; SOS Safety Enabled
            </span>
          </div>
        </div>

        {/* Branding */}
        <div className="flex flex-1 flex-col items-center justify-end pb-8 text-center">
          <div className="mb-3 flex items-center gap-1.5 animate-fade-in-up opacity-0" style={{ animationDelay: '0.15s' }}>
            <MapPin className="h-5 w-5 text-sunset-400" strokeWidth={2.5} />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-sunset-300">
              Lucknow, India
            </span>
          </div>

          <h1
            className="font-display text-5xl font-extrabold leading-tight tracking-tight animate-fade-in-up opacity-0 sm:text-6xl"
            style={{ animationDelay: '0.25s' }}
          >
            Ghummi <span className="text-sunset-400">Ghummi</span>
          </h1>

          <p
            className="mt-5 max-w-xs text-base font-normal leading-relaxed text-white/85 animate-fade-in-up opacity-0 sm:max-w-sm sm:text-lg"
            style={{ animationDelay: '0.4s' }}
          >
            Your travel buddy for safe stays, trusted auto rides, and local exploration.
          </p>

          <div
            className="mt-7 flex flex-wrap items-center justify-center gap-2.5 animate-fade-in-up opacity-0"
            style={{ animationDelay: '0.55s' }}
          >
            {['Safe Stays', 'Trusted Autos', 'Food Walks'].map((label) => (
              <span
                key={label}
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm ring-1 ring-white/15"
              >
                <Sparkles className="h-3 w-3 text-teal-300" strokeWidth={2.5} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.7s' }}>
          <button
            onClick={onGetStarted}
            type="button"
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-sunset-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-sunset-500/30 transition-all duration-300 hover:bg-sunset-600 active:scale-[0.98] sm:py-5"
          >
            Get Started
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
          </button>

          <button
            onClick={onLogIn}
            type="button"
            className="w-full rounded-2xl border border-white/30 bg-transparent px-6 py-4 text-base font-medium text-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 active:scale-[0.98] sm:py-5"
          >
            I already have an account,{' '}
            <span className="font-semibold text-white underline-offset-4 hover:underline">Log In</span>
          </button>
        </div>
      </div>
    </div>
  );
}
