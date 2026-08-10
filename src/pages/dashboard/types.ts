export interface Message {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface Content {
  id?: number | string;
  key: string;
  title: string;
  body: string;
  type: string;
  created_at?: string;
  updated_at?: string;
}

export interface MediaFile {
  storage_path?: string;
  id: string | number;
  name: string;
  url: string;
  type?: string;
  size?: number;
  created_at?: string;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  location: string;
  serviceType: string;
  client: string;
  completionDate: string;
  materialsUsed: string;
  coverImage: string;
  image?: string;
  date?: string;
  galleryImages: string[];
  isFeatured: boolean;
  isHidden: boolean;
  order: number;

  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoCanonical?: string;
  seoImage?: string;
  seoNoIndex?: boolean;

  beforeImage?: string;
  afterImage?: string;
}
