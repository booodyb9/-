export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface Content {
  id?: number;
  key: string;
  title: string;
  body: string;
  type: string;
}

export interface MediaFile {
  id: number;
  name: string;
  url: string;
}
