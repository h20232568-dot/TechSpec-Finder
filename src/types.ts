export interface Device {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  display: string;
  displaySize: number;
  battery: number;
  weight: number;
  chipset: string;
  imageUrl: string;
  rating?: number;
  score?: number;
  category?: 'Premium' | 'Value' | 'Gaming' | 'All';
  description?: string;
  tags?: string[];
  os: string;
  geekbench?: {
    single: number;
    multi: number;
  };
}

export type Page = 'search' | 'results' | 'compare' | 'chat' | 'profile';

export interface SearchFilters {
  brand?: string;
  year?: number;
  minDisplay?: number;
  maxDisplay?: number;
  minBattery?: number;
  maxBattery?: number;
  minWeight?: number;
  maxWeight?: number;
  minPrice?: number;
  maxPrice?: number;
  minScore?: number;
}
