import { useState } from 'react';
import { X, Phone, Mail, ArrowLeft, Loader2, ShieldCheck, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type AuthScreenProps = {
  mode: 'signup' | 'login';
  onClose: () => void;
  onSuccess: () => void;
};

type AuthMethod = 'phone' | 'email';

const MOCK_OTP = '1234';
const DEMO_PASSWORD = 'GhummiGhummiDemo!2024';

function phoneToEmail(phone: string) {
  return `+91${phone}@ghummighummi.app`;
}

export default function AuthScreen({ mode, onClose, onSuccess }: AuthScreenProps) {
  const [method, setMethod] = useState<AuthMethod>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === 'signup';

  // Mock phone OTP: show the code entry screen instantly (no real SMS sent)
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (phone.length < 10) return;
    setOtpSent(true);
  };

  // Verify mock OTP: if code is 1234, create a real Supabase session
  // using a generated email/password so the dashboard auth works
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp !== MOCK_OTP) {
      setError('Invalid code. Use 1234 for demo login.');
      return;
    }

    setLoading(true);
    try {
      const generatedEmail = phoneToEmail(phone);

      // Try sign-in first; if the user doesn't exist, sign up then sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: generatedEmail,
        password: DEMO_PASSWORD,
      });

      if (signInError) {
        // User doesn't exist yet — create the account
        const { error: signUpError } = await supabase.auth.signUp({
          email: generatedEmail,
          password: DEMO_PASSWORD,
        });
        if (signUpError) throw signUpError;

        // Immediately sign in after sign-up
        const { error: retrySignInError } = await supabase.auth.signInWithPassword({
          email: generatedEmail,
          password: DEMO_PASSWORD,
        });
        if (retrySignInError) throw retrySignInError;
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignup) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up rounded-t-3xl bg-white p-6 pb-8 shadow-2xl sm:rounded-3xl sm:p-8">
        {/* Drag handle */}
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-200 sm:hidden" />

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={otpSent ? () => { setOtpSent(false); setOtp(''); setError(null); } : onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="font-display text-2xl font-bold text-gray-900">
          {isSignup ? 'Join Ghummi Ghummi' : 'Welcome back'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {isSignup
            ? 'Sign up to connect with verified locals.'
            : 'Log in to continue your journey.'}
        </p>

        {/* Trust badge */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2">
          <ShieldCheck className="h-4 w-4 text-teal-600" strokeWidth={2.5} />
          <span className="text-xs font-medium text-teal-700">
            100% KYC Verified &amp; SOS Safety Enabled
          </span>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* OTP verification step */}
        {otpSent ? (
          <form onSubmit={handleOtpVerify} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Enter the code sent to +91 {phone}
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="----"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-center text-2xl font-bold tracking-[0.5em] text-gray-900 outline-none transition-colors focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200"
              />
            </div>

            {/* Demo code hint */}
            <div className="flex items-center gap-2 rounded-xl bg-sunset-50 px-4 py-2.5">
              <MessageSquare className="h-4 w-4 shrink-0 text-sunset-500" strokeWidth={2.5} />
              <p className="text-xs font-medium text-sunset-700">
                Demo mode: use code <span className="font-bold tracking-wider">1234</span> to log in instantly.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sunset-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-sunset-500/25 transition-all hover:bg-sunset-600 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify & Continue'}
            </button>

            <button
              type="button"
              onClick={() => { setOtp(''); setError(null); }}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
            >
              Resend code
            </button>
          </form>
        ) : (
          <>
            {/* Method tabs */}
            <div className="mt-6 flex gap-2 rounded-xl bg-gray-100 p-1">
              <button
                onClick={() => setMethod('phone')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  method === 'phone' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                <Phone className="h-4 w-4" /> Phone
              </button>
              <button
                onClick={() => setMethod('email')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  method === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                <Mail className="h-4 w-4" /> Email
              </button>
            </div>

            {/* Phone form */}
            {method === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone number
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3.5 text-sm font-medium text-gray-600">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base text-gray-900 outline-none transition-colors focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={phone.length < 10}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-sunset-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-sunset-500/25 transition-all hover:bg-sunset-600 active:scale-[0.98] disabled:opacity-50"
                >
                  Send OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleEmailSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base text-gray-900 outline-none transition-colors focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base text-gray-900 outline-none transition-colors focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !email || password.length < 6}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-sunset-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-sunset-500/25 transition-all hover:bg-sunset-600 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : isSignup ? 'Create account' : 'Log in'}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium text-gray-400">or</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google */}
            <button
              onClick={async () => {
                setError(null);
                setLoading(true);
                try {
                  await supabase.auth.signInWithOAuth({ provider: 'google' });
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Google sign-in failed.');
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 text-base font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <p className="mt-6 text-center text-xs text-gray-400">
          By continuing you agree to our Terms &amp; Privacy Policy.
        </p>
      </div>
    </div>
  );
}
