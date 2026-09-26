import { useState } from 'react';
import {
  MapPin,
  Star,
  Navigation,
  Landmark,
  Store,
  UtensilsCrossed,
  Compass,
  Filter,
  X,
  Share2,
  Clock,
} from 'lucide-react';
import { ghummiGhummiWhatsAppLink } from '@/lib/supabase';

export type Hotspot = {
  id: string;
  name: string;
  category: 'heritage' | 'markets' | 'foodwalks' | 'gems';
  image: string;
  lat: number;
  lng: number;
  rating: number;
  distance: number;
  blurb: string;
};

const HOTSPOTS: Hotspot[] = [
  {
    id: 'rumi-darwaza',
    name: 'Rumi Darwaza',
    category: 'heritage',
    image: 'https://images.pexels.com/photos/34459415/pexels-photo-34459415.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 26.8490,
    lng: 80.9170,
    rating: 4.8,
    distance: 1.2,
    blurb: 'Iconic 60-foot Awadhi gateway built in 1784. Stunning at sunset.',
  },
  {
    id: 'bara-imambara',
    name: 'Bara Imambara',
    category: 'heritage',
    image: 'https://images.pexels.com/photos/24416541/pexels-photo-24416541.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 26.8485,
    lng: 80.9165,
    rating: 4.9,
    distance: 1.5,
    blurb: 'Grand Nawabi monument with the famous Bhulbhulaiya labyrinth.',
  },
  {
    id: 'chota-imambara',
    name: 'Chota Imambara',
    category: 'heritage',
    image: 'https://images.pexels.com/photos/9179544/pexels-photo-9179544.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 26.8510,
    lng: 80.9180,
    rating: 4.7,
    distance: 1.8,
    blurb: 'Ornate shrine with chandeliers, gold interiors, and reflection pool.',
  },
  {
    id: 'residency',
    name: 'British Residency Ruins',
    category: 'heritage',
    image: 'https://images.pexels.com/photos/22686432/pexels-photo-22686432.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 26.8600,
    lng: 80.9300,
    rating: 4.5,
    distance: 3.2,
    blurb: 'Ruins of the 1857 siege. Quiet gardens and powerful history.',
  },
  {
    id: 'aminabad',
    name: 'Aminabad Market',
    category: 'markets',
    image: 'https://images.pexels.com/photos/10589517/pexels-photo-10589517.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 26.8530,
    lng: 80.9200,
    rating: 4.6,
    distance: 0.8,
    blurb: 'Bustling bazaar for chikan embroidery, kebabs, and jewelry.',
  },
  {
    id: 'hazratganj',
    name: 'Hazratganj Shopping',
    category: 'markets',
    image: 'https://images.pexels.com/photos/14940419/pexels-photo-14940419.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 26.8560,
    lng: 80.9300,
    rating: 4.5,
    distance: 2.0,
    blurb: 'Colonial-era boulevard with bookshops, cafes, and jutti stores.',
  },
  {
    id: 'chowk',
    name: 'Chowk Old Market',
    category: 'markets',
    image: 'https://images.pexels.com/photos/984534/pexels-photo-984534.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 26.8495,
    lng: 80.9160,
    rating: 4.7,
    distance: 1.0,
    blurb: 'Narrow lanes of ittar, zardozi, and the best basket chaat in town.',
  },
  {
    id: 'tunday-walk',
    name: 'Tunday Kababi Food Walk',
    category: 'foodwalks',
    image: 'https://images.pexels.com/photos/18215050/pexels-photo-18215050.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 26.8535,
    lng: 80.9210,
    rating: 4.9,
    distance: 0.9,
    blurb: 'Legendary Galouti kebab trail through Aminabad. 4 stops, 2 hours.',
  },
  {
    id: 'chowk-food',
    name: 'Chowk Night Food Trail',
    category: 'foodwalks',
    image: 'https://images.pexels.com/photos/9646846/pexels-photo-9646846.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 26.8490,
    lng: 80.9155,
    rating: 4.8,
    distance: 1.1,
    blurb: 'Evening crawl: basket chaat, kulfi, nihari, and sheermal.',
  },
  {
    id: 'cafe-hop',
    name: 'Hazratganj Cafe Hop',
    category: 'foodwalks',
    image: 'https://images.pexels.com/photos/39059254/pexels-photo-39059254.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 26.8565,
    lng: 80.9310,
    rating: 4.6,
    distance: 2.3,
    blurb: 'Cafe hopping along Hazratganj with coffee, kebab rolls, and stories.',
  },
  {
    id: 'janeshwar',
    name: 'Janeshwar Mishra Park',
    category: 'gems',
    image: 'https://images.pexels.com/photos/13308431/pexels-photo-13308431.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 26.8700,
    lng: 80.9500,
    rating: 4.7,
    distance: 5.5,
    blurb: "Asia's largest park. Sunrise walks, cycling, and peacocks.",
  },
  {
    id: 'ambedkar',
    name: 'Ambedkar Memorial Park',
    category: 'gems',
    image: 'https://images.pexels.com/photos/39112063/pexels-photo-39112063.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 26.8650,
    lng: 80.9450,
    rating: 4.6,
    distance: 4.8,
    blurb: 'Monumental sandstone park with elephant statues and evening lights.',
  },
];

const EXPLORE_FILTERS = [
  { key: 'all', label: 'All Hotspots', icon: Filter },
  { key: 'heritage', label: 'Heritage', icon: Landmark },
  { key: 'markets', label: 'Markets', icon: Store },
  { key: 'foodwalks', label: 'Food Walks', icon: UtensilsCrossed },
  { key: 'gems', label: 'Hidden Gems', icon: Compass },
] as const;

type FilterKey = (typeof EXPLORE_FILTERS)[number]['key'];

const CATEGORY_STYLES: Record<Hotspot['category'], { bg: string; text: string; label: string; accent: string }> = {
  heritage: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Heritage', accent: 'bg-amber-500' },
  markets: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Market', accent: 'bg-rose-500' },
  foodwalks: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Food Walk', accent: 'bg-orange-500' },
  gems: { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Hidden Gem', accent: 'bg-teal-500' },
};

function openDirections(hotspot: Hotspot) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${hotspot.lat},${hotspot.lng}&destination_place_id=${encodeURIComponent(hotspot.name)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  const filtered =
    activeFilter === 'all'
      ? HOTSPOTS
      : HOTSPOTS.filter((h) => h.category === activeFilter);

  const sorted = [...filtered].sort((a, b) => a.distance - b.distance);

  return (
    <div className="px-4 pb-24 pt-4 sm:px-5">
      {/* Header */}
      <div className="mb-5">
        <h2 className="font-display text-xl font-bold text-gray-900">Explore Lucknow</h2>
        <p className="text-sm text-gray-500">Hotspots near you, sorted by distance</p>
      </div>

      {/* Mini map-style banner */}
      <div className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-sunset-100 via-orange-50 to-teal-50 p-4 ring-1 ring-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sunset-500 text-white shadow-md">
            <Navigation className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">You are in Lucknow</p>
            <p className="text-xs text-gray-500">{sorted.length} hotspots within 6 km</p>
          </div>
        </div>
        {/* Decorative distance bars */}
        <div className="mt-3 space-y-1.5">
          {sorted.slice(0, 3).map((h) => (
            <div key={h.id} className="flex items-center gap-2">
              <span className="w-24 truncate text-xs text-gray-500">{h.name}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-sunset-400"
                  style={{ width: `${Math.max(15, 100 - h.distance * 15)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">{h.distance} km</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category filters */}
      <div className="-mx-4 mb-5 overflow-x-auto px-4 pb-1 sm:-mx-5 sm:px-5">
        <div className="flex gap-2">
          {EXPLORE_FILTERS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                activeFilter === key
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

      {/* Results count */}
      <p className="mb-3 text-xs font-medium text-gray-400">
        Showing {sorted.length} {sorted.length === 1 ? 'spot' : 'spots'}
        {activeFilter !== 'all' && ` in ${EXPLORE_FILTERS.find((f) => f.key === activeFilter)?.label}`}
      </p>

      {/* Hotspot cards */}
      <div className="space-y-3">
        {sorted.map((hotspot) => {
          const style = CATEGORY_STYLES[hotspot.category];
          return (
            <div
              key={hotspot.id}
              onClick={() => setSelectedHotspot(hotspot)}
              className="group flex cursor-pointer gap-3 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md active:scale-[0.99]"
            >
              {/* Image */}
              <div className="relative h-28 w-28 shrink-0 overflow-hidden sm:h-32 sm:w-32">
                <img
                  src={hotspot.image}
                  alt={hotspot.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                  <Navigation className="h-2.5 w-2.5" />
                  {hotspot.distance} km
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-center py-2 pr-3">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-bold text-gray-900">{hotspot.name}</h3>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.bg} ${style.text}`}>
                    {style.label}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs font-medium text-gray-500">
                    <Star className="h-3 w-3 fill-sunset-400 text-sunset-400" />
                    {hotspot.rating}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs text-gray-400">{hotspot.blurb}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="h-3 w-3" />
                  {hotspot.lat.toFixed(4)}, {hotspot.lng.toFixed(4)}
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col justify-center pr-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDirections(hotspot);
                  }}
                  className="flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800 active:scale-95"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Go
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {selectedHotspot && (
        <HotspotDetail
          hotspot={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
        />
      )}
    </div>
  );
}

function HotspotDetail({ hotspot, onClose }: { hotspot: Hotspot; onClose: () => void }) {
  const style = CATEGORY_STYLES[hotspot.category];

  const shareOnWhatsApp = () => {
    const message = `Check out ${hotspot.name} on Ghummi Ghummi! ${hotspot.blurb} Location: https://www.google.com/maps?q=${hotspot.lat},${hotspot.lng}`;
    window.open(ghummiGhummiWhatsAppLink(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        {/* Hero image */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={hotspot.image}
            alt={hotspot.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Category badge on image */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${style.bg} ${style.text}`}>
              {style.label}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
              <Star className="h-3 w-3 fill-sunset-400 text-sunset-400" />
              {hotspot.rating}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pb-8">
          <h2 className="font-display text-xl font-bold text-gray-900">{hotspot.name}</h2>

          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Navigation className="h-3.5 w-3.5 text-sunset-500" />
              {hotspot.distance} km away
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-gray-400" />
              {hotspot.lat.toFixed(4)}, {hotspot.lng.toFixed(4)}
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-gray-600">{hotspot.blurb}</p>

          {/* Quick info grid */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                Best Time
              </div>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {hotspot.category === 'foodwalks' ? 'Evening' : hotspot.category === 'markets' ? 'Afternoon' : 'Early AM / Sunset'}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                <Star className="h-3.5 w-3.5" />
                Rating
              </div>
              <p className="mt-1 text-sm font-semibold text-gray-900">{hotspot.rating} / 5.0</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => openDirections(hotspot)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98]"
            >
              <Navigation className="h-4 w-4" strokeWidth={2.5} />
              Get Directions
            </button>
            <button
              type="button"
              onClick={shareOnWhatsApp}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#1da851] active:scale-[0.98]"
            >
              <Share2 className="h-4 w-4" strokeWidth={2.5} />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
