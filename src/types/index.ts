export interface Couple {
  id: string;
  groomName: string;
  groomAlias?: string | null;
  groomBio?: string | null;
  groomImage?: string | null;
  brideName: string;
  brideAlias?: string | null;
  brideBio?: string | null;
  brideImage?: string | null;
  hashtag?: string | null;
  heroImage?: string | null;
  quoteImage?: string | null;
  storyImage?: string | null;
  weddingDate?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Event {
  id: string;
  title: string;
  subtitle?: string | null;
  time: string;
  date: string;
  location: string;
  address: string;
  mapUrl: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Gift {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Gallery {
  id: string;
  imageUrl: string;
  caption?: string | null;
  order: number;
  createdAt: Date | string;
}

export interface Guest {
  id: string;
  name: string;
  code: string;
  phone?: string | null;
  group?: string | null;
  partnerName?: string | null;
  side: number;
  rsvp?: RSVP | null;
  wishes?: Guestbook[];
  createdAt: Date | string;
}

export interface Guestbook {
  id: string;
  name: string;
  message: string;
  status: number;
  guestId?: string | null;
  guest?: Guest | null;
  likes: number;
  createdAt: Date | string;
}

export interface RSVP {
  id: string;
  name: string;
  attendance: string;
  guests?: string | null;
  createdAt: Date | string;
}

export interface Song {
  id: string;
  title: string;
  artist?: string | null;
  url: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
