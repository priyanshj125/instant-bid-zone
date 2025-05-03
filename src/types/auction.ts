
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Bid {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: Date;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  startingPrice: number;
  currentPrice: number;
  startDate: Date;
  endDate: Date;
  sellerId: string;
  sellerName: string;
  bids: Bid[];
  status: 'upcoming' | 'active' | 'ended';
}

export interface AuctionFormData {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  startingPrice: number;
  duration: number; // in hours
}
