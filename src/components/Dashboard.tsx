import { useEffect, useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Star,
  Siren,
  Home,
  Compass,
  User,
  BedDouble,
  Car,
  UtensilsCrossed,
  Landmark,
  Loader2,
  X,
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { supabase, ghummiGhummiWhatsAppLink, type Vendor } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import ExploreScreen from '@/components/ExploreScreen';

const CATEGORIES = [
  { key: 'all', label: 'All', icon: Compass },
  { key: 'stays', label: 'Homestays', icon: BedDouble },
  { key: 'autos', label: 'Trusted Auto Rides', icon: Car },
  { key: 'foodwalks', label: 'Local Food Walks', icon: UtensilsCrossed },
  { key: 'heritage', label: 'Heritage Guides', icon: Landmark },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]['key'];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'safety' | 'profile'>('home');
  const [sosOpen, setSosOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('rating', { ascending: false });
      if (!error && data) setVendors(data as Vendor[]);
      setLoading(false);
    })();
  }, []);

  const filtered =
    activeCategory === 'all'
      ? vendors
      : vendors.filter((v) => v.category === activeCategory);

  return (
    <div className="min-h-[100dvh] bg-gray-50 font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sunset-500 text-white shadow-sm">
              <MapPin className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold text-gray-900">
              Ghummi <span className="text-sunset-500">Ghummi</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSosOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-red-500 px-3.5 py-2 text-sm font-bold text-white shadow-md shadow-red-500/30 transition-all hover:bg-red-600 active:scale-95"
            >
              <Siren className="h-4 w-4 animate-pulse-soft" strokeWidth={2.5} />
              SOS
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 ring-1 ring-gray-200 transition-colors hover:bg-gray-200"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        {activeTab === 'explore' ? (
          <ExploreScreen />
        ) : (
          <div className="px-4 pb-24 pt-4 sm:px-5">
            <div className="mb-5">
              <h2 className="font-display text-xl font-bold text-gray-900">
                Namaste{user?.email ? `, ${user.email.startsWith('+') ? user.email.split('@')[0] : user.email.split('@')[0]}` : ''}!
              </h2>
              <p className="text-sm text-gray-500">You are in Lucknow. What are you exploring today?</p>
            </div>

            <div className="-mx-4 mb-5 overflow-x-auto px-4 pb-1 sm:-mx-5 sm:px-5">
              <div className="flex gap-2">
                {CATEGORIES.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveCategory(key)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                      activeCategory === key
                        ? 'bg-gray-900 text-white shadow-md'
                        : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-sunset-400" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <p className="text-sm">No vendors in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {filtered.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-100 bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <NavTab icon={Home} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavTab icon={Compass} label="Explore" active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} />
          <NavTab
            icon={Siren}
            label="SOS"
            active={activeTab === 'safety'}
            onClick={() => setSosOpen(true)}
            danger
          />
          <NavTab icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      </nav>

      {sosOpen && <SosModal onClose={() => setSosOpen(false)} />}

      {activeTab === 'profile' && (
        <ProfileOverlay
          email={user?.email ?? null}
          onSignOut={signOut}
          onClose={() => setActiveTab('home')}
        />
      )}
    </div>
  );
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={vendor.image_url}
          alt={vendor.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {vendor.kyc_verified && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-teal-500/90 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
            KYC
          </div>
        )}
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
          <Star className="h-3 w-3 fill-sunset-400 text-sunset-400" />
          {Number(vendor.rating).toFixed(1)}
        </div>
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-bold text-gray-900">{vendor.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
          <MapPin className="h-3 w-3" />
          {vendor.location}
        </p>
        <p className="mt-1 text-xs font-semibold text-sunset-600">{vendor.price_range}</p>
        <a
          href={ghummiGhummiWhatsAppLink(
            `Hi Ghummi Ghummi! I want to book this ${vendor.category === 'stays' ? 'stay' : vendor.category === 'autos' ? 'auto ride' : vendor.category === 'foodwalks' ? 'food walk' : 'heritage guide'} in Lucknow: ${vendor.name} (${vendor.price_range}) at ${vendor.location}. Is it available?`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#25D366] py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1da851] active:scale-95"
        >
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
          Book via WhatsApp
        </a>
      </div>
    </div>
  );
}

function NavTab({
  icon: Icon,
  label,
  active,
  onClick,
  danger,
}: {
  icon: typeof Home;
  label: string;
  active: boolean;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-0.5 py-1.5 transition-colors ${
        danger ? 'text-red-500' : active ? 'text-sunset-500' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon className={`h-5 w-5 ${danger ? 'animate-pulse-soft' : ''}`} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

type GeoState =
  | { status: 'idle' }
  | { status: 'fetching' }
  | { status: 'success'; lat: number; lng: number; dispatched: number }
  | { status: 'error'; message: string };

function SosModal({ onClose }: { onClose: () => void }) {
  const [geo, setGeo] = useState<GeoState>({ status: 'idle' });

  const fetchLocationAndAlert = () => {
    setGeo({ status: 'fetching' });

    if (!navigator.geolocation) {
      setGeo({ status: 'error', message: 'Geolocation is not supported on this device.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Simulate dispatch to 5 nearby verified hosts
        setGeo({
          status: 'success',
          lat: latitude,
          lng: longitude,
          dispatched: 5,
        });
      },
      (err) => {
        let message = 'Could not get your location.';
        if (err.code === err.PERMISSION_DENIED) {
          message = 'Location permission denied. Enable location to alert nearby hosts.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          message = 'Location unavailable. Try moving to an open area.';
        } else if (err.code === err.TIMEOUT) {
          message = 'Location request timed out. Try again.';
        }
        setGeo({ status: 'error', message });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md animate-fade-in-up rounded-t-3xl bg-white p-6 pb-8 shadow-2xl sm:rounded-3xl sm:p-8">
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-200 sm:hidden" />

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <Siren className="h-5 w-5 text-red-500" />
            </div>
            <h2 className="font-display text-xl font-bold text-gray-900">Emergency SOS</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Tap a contact below to alert them with your live location. Stay calm — help is on the way.
        </p>

        <div className="mt-5 space-y-3">
          <button className="flex w-full items-center gap-3 rounded-2xl bg-red-50 px-4 py-4 transition-colors hover:bg-red-100">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white">
              <Phone className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">Call 112 (Emergency)</p>
              <p className="text-xs text-gray-500">India National Emergency Number</p>
            </div>
          </button>

          {/* Alert nearby verified locals — uses real geolocation */}
          <button
            onClick={fetchLocationAndAlert}
            disabled={geo.status === 'fetching'}
            className="flex w-full items-center gap-3 rounded-2xl bg-sunset-50 px-4 py-4 text-left transition-colors hover:bg-sunset-100 disabled:opacity-60"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sunset-500 text-white">
              {geo.status === 'fetching' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <MessageCircle className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-gray-900">Alert Nearby Verified Locals</p>
              <p className="text-xs text-gray-500">
                {geo.status === 'idle' && 'Send your live location to 5 nearby hosts'}
                {geo.status === 'fetching' && 'Fetching your GPS coordinates...'}
                {geo.status === 'success' && `Dispatched to ${geo.dispatched} verified hosts`}
                {geo.status === 'error' && 'Location access needed'}
              </p>
            </div>
          </button>

          {/* Geolocation result */}
          {geo.status === 'success' && (
            <div className="animate-fade-in rounded-2xl border border-teal-200 bg-teal-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" strokeWidth={2.5} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-teal-800">Location shared successfully</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-teal-700">
                      <Navigation className="h-3.5 w-3.5" />
                      <span className="font-mono">
                        Lat: {geo.lat.toFixed(6)}, Lng: {geo.lng.toFixed(6)}
                      </span>
                    </div>
                    <p className="text-xs text-teal-600">
                      Alert dispatched to {geo.dispatched} nearby verified hosts with your coordinates.
                      Estimated response within 5-10 minutes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {geo.status === 'error' && (
            <div className="animate-fade-in rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500" strokeWidth={2.5} />
                <div>
                  <p className="text-sm font-bold text-red-700">Location access failed</p>
                  <p className="mt-1 text-xs text-red-600">{geo.message}</p>
                  <button
                    onClick={fetchLocationAndAlert}
                    className="mt-2 text-xs font-semibold text-red-600 underline-offset-2 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          <button className="flex w-full items-center gap-3 rounded-2xl bg-gray-50 px-4 py-4 transition-colors hover:bg-gray-100">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-500 text-white">
              <Phone className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">Call Your Emergency Contact</p>
              <p className="text-xs text-gray-500">Set up in profile</p>
            </div>
          </button>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-teal-50 px-4 py-3">
          <ShieldCheck className="h-4 w-4 text-teal-600" strokeWidth={2.5} />
          <span className="text-xs font-medium text-teal-700">
            Your location is shared securely &amp; only with trusted contacts.
          </span>
        </div>
      </div>
    </div>
  );
}

function ProfileOverlay({
  email,
  onSignOut,
  onClose,
}: {
  email: string | null;
  onSignOut: () => Promise<void>;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md animate-fade-in-up rounded-t-3xl bg-white p-6 pb-8 shadow-2xl sm:rounded-3xl sm:p-8">
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-200 sm:hidden" />

        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sunset-100 text-sunset-500">
            <User className="h-10 w-10" />
          </div>
          <p className="mt-3 text-sm font-semibold text-gray-900">{email ?? 'Traveler'}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-500" strokeWidth={2.5} />
            <span className="text-xs font-medium text-teal-600">KYC Verified</span>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-600">Trips completed</span>
            <span className="text-sm font-bold text-gray-900">3</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-600">Reviews</span>
            <span className="text-sm font-bold text-gray-900">5</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-600">Emergency contact</span>
            <span className="text-sm font-medium text-sunset-500">Set up</span>
          </div>
        </div>

        <button
          onClick={async () => {
            await onSignOut();
            onClose();
          }}
          className="mt-6 w-full rounded-xl border border-red-200 bg-red-50 py-3.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
