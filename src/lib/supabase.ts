import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Vendor = {
  id: string;
  name: string;
  category: 'stays' | 'autos' | 'foodwalks' | 'heritage';
  description: string;
  image_url: string;
  rating: number;
  price_range: string;
  location: string;
  kyc_verified: boolean;
  whatsapp_number: string;
};

export const GHUMMI_GHUMMI_WHATSAPP_NUMBER = '919305900598';

export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function ghummiGhummiWhatsAppLink(message: string): string {
  return whatsappLink(GHUMMI_GHUMMI_WHATSAPP_NUMBER, message);
}
