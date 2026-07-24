export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface Content {
  id?: number | string;
  key: string;
  title: string;
  body: string;
  type: string;
}

export interface MediaFile {
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
  galleryImages: string[];
  isFeatured: boolean;
  isHidden: boolean;
  order: number;
  seoTitle: string;
  seoDescription: string;
  beforeImage?: string;
  afterImage?: string;
}
