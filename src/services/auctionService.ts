
import { Auction, Bid, User } from "../types/auction";
import { toast } from "@/components/ui/use-toast";

// Mock users
const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", avatar: "/placeholder.svg" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", avatar: "/placeholder.svg" },
  { id: "3", name: "Alice Johnson", email: "alice@example.com", avatar: "/placeholder.svg" },
];

// Mock auctions
const generateMockAuctions = (): Auction[] => {
  const now = new Date();
  
  return [
    {
      id: "1",
      title: "Vintage Rolex Watch",
      description: "A beautiful vintage Rolex watch in excellent condition. This rare timepiece features a gold bezel and leather strap.",
      imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=500",
      category: "Jewelry",
      startingPrice: 1000,
      currentPrice: 1250,
      startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      endDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      sellerId: "1",
      sellerName: "John Doe",
      bids: [
        { id: "b1", userId: "2", userName: "Jane Smith", amount: 1050, timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
        { id: "b2", userId: "3", userName: "Alice Johnson", amount: 1250, timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000) },
      ],
      status: "active"
    },
    {
      id: "2",
      title: "Modern Art Painting",
      description: "Original modern art painting by emerging artist. Abstract design with vibrant colors on canvas.",
      imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=500",
      category: "Art",
      startingPrice: 500,
      currentPrice: 750,
      startDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      endDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      sellerId: "3",
      sellerName: "Alice Johnson",
      bids: [
        { id: "b3", userId: "1", userName: "John Doe", amount: 600, timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
        { id: "b4", userId: "2", userName: "Jane Smith", amount: 750, timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000) },
      ],
      status: "active"
    },
    {
      id: "3",
      title: "Antique Oak Desk",
      description: "Beautiful antique oak writing desk from the 19th century. Perfect condition with original brass handles.",
      imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=500",
      category: "Furniture",
      startingPrice: 800,
      currentPrice: 800,
      startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      endDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
      sellerId: "2",
      sellerName: "Jane Smith",
      bids: [],
      status: "active"
    },
    {
      id: "4",
      title: "Vintage Camera Collection",
      description: "Collection of 5 vintage film cameras from the 1960s and 1970s. All in working condition.",
      imageUrl: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&q=80&w=500",
      category: "Electronics",
      startingPrice: 350,
      currentPrice: 720,
      startDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      endDate: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 hours from now
      sellerId: "1",
      sellerName: "John Doe",
      bids: [
        { id: "b5", userId: "3", userName: "Alice Johnson", amount: 450, timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) },
        { id: "b6", userId: "2", userName: "Jane Smith", amount: 550, timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
        { id: "b7", userId: "3", userName: "Alice Johnson", amount: 720, timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
      ],
      status: "active"
    },
    {
      id: "5",
      title: "Limited Edition Sneakers",
      description: "Limited edition designer sneakers, never worn. Size 10. Comes with original box and authenticity certificate.",
      imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=500",
      category: "Fashion",
      startingPrice: 200,
      currentPrice: 425,
      startDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      endDate: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
      sellerId: "3",
      sellerName: "Alice Johnson",
      bids: [
        { id: "b8", userId: "1", userName: "John Doe", amount: 290, timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
        { id: "b9", userId: "2", userName: "Jane Smith", amount: 350, timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
        { id: "b10", userId: "1", userName: "John Doe", amount: 425, timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
      ],
      status: "ended"
    },
  ];
};

let auctionData: Auction[] = generateMockAuctions();

// Mock current user
let currentUser: User | null = null;

// Mock login
export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        currentUser = user;
        localStorage.setItem("currentUser", JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 500);
  });
};

// Mock register
export const register = (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        reject(new Error("Email already exists"));
      } else {
        const newUser: User = {
          id: `${mockUsers.length + 1}`,
          name,
          email,
          avatar: "/placeholder.svg"
        };
        mockUsers.push(newUser);
        currentUser = newUser;
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        resolve(newUser);
      }
    }, 500);
  });
};

// Mock logout
export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser = null;
      localStorage.removeItem("currentUser");
      resolve();
    }, 200);
  });
};

// Check if user is authenticated
export const checkAuth = (): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
      }
      resolve(currentUser);
    }, 200);
  });
};

// Get current user
export const getCurrentUser = (): User | null => {
  return currentUser;
};

// Get all auctions
export const getAuctions = (): Promise<Auction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Update auction status based on dates
      const now = new Date();
      auctionData.forEach(auction => {
        if (now < auction.startDate) {
          auction.status = "upcoming";
        } else if (now > auction.endDate) {
          auction.status = "ended";
        } else {
          auction.status = "active";
        }
      });
      resolve([...auctionData]);
    }, 500);
  });
};

// Get auction by ID
export const getAuctionById = (id: string): Promise<Auction> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const auction = auctionData.find(a => a.id === id);
      if (auction) {
        // Update status based on current time
        const now = new Date();
        if (now < auction.startDate) {
          auction.status = "upcoming";
        } else if (now > auction.endDate) {
          auction.status = "ended";
        } else {
          auction.status = "active";
        }
        resolve({...auction});
      } else {
        reject(new Error("Auction not found"));
      }
    }, 300);
  });
};

// Place a bid
export const placeBid = (auctionId: string, amount: number): Promise<Auction> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!currentUser) {
        reject(new Error("You must be logged in to place a bid"));
        return;
      }
      
      const auctionIndex = auctionData.findIndex(a => a.id === auctionId);
      
      if (auctionIndex === -1) {
        reject(new Error("Auction not found"));
        return;
      }
      
      const auction = auctionData[auctionIndex];
      
      // Check if auction is active
      const now = new Date();
      if (now < auction.startDate) {
        reject(new Error("Auction has not started yet"));
        return;
      }
      
      if (now > auction.endDate) {
        reject(new Error("Auction has already ended"));
        return;
      }
      
      // Check if bid amount is higher than current price
      if (amount <= auction.currentPrice) {
        reject(new Error("Bid must be higher than current price"));
        return;
      }
      
      // Check if seller is not bidding on their own item
      if (auction.sellerId === currentUser.id) {
        reject(new Error("You cannot bid on your own auction"));
        return;
      }
      
      // Create new bid
      const newBid: Bid = {
        id: `b${Math.random().toString(36).substring(2, 9)}`,
        userId: currentUser.id,
        userName: currentUser.name,
        amount,
        timestamp: new Date()
      };
      
      // Update auction with new bid
      const updatedAuction = {
        ...auction,
        currentPrice: amount,
        bids: [...auction.bids, newBid]
      };
      
      // Update auction in data
      auctionData[auctionIndex] = updatedAuction;
      
      // Show success toast
      toast({
        title: "Bid Placed Successfully!",
        description: `You are now the highest bidder at $${amount}`,
      });
      
      resolve(updatedAuction);
    }, 600);
  });
};

// Create new auction
export const createAuction = (auctionData: AuctionFormData): Promise<Auction> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!currentUser) {
        reject(new Error("You must be logged in to create an auction"));
        return;
      }
      
      const now = new Date();
      const endDate = new Date(now.getTime() + auctionData.duration * 60 * 60 * 1000);
      
      const newAuction: Auction = {
        id: `${Math.random().toString(36).substring(2, 9)}`,
        title: auctionData.title,
        description: auctionData.description,
        imageUrl: auctionData.imageUrl || "https://images.unsplash.com/photo-1588344799137-9947e96e780f?auto=format&fit=crop&q=80&w=500",
        category: auctionData.category,
        startingPrice: auctionData.startingPrice,
        currentPrice: auctionData.startingPrice,
        startDate: now,
        endDate: endDate,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        bids: [],
        status: "active"
      };
      
      // Add to auctions
      auctionData = [newAuction, ...auctionData];
      
      resolve(newAuction);
    }, 800);
  });
};

// Get user's auctions (created by user)
export const getUserAuctions = (): Promise<Auction[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!currentUser) {
        reject(new Error("You must be logged in"));
        return;
      }
      
      const userAuctions = auctionData.filter(auction => auction.sellerId === currentUser?.id);
      resolve(userAuctions);
    }, 500);
  });
};

// Get user's bids (auctions user has bid on)
export const getUserBids = (): Promise<Auction[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!currentUser) {
        reject(new Error("You must be logged in"));
        return;
      }
      
      const biddedAuctions = auctionData.filter(auction => 
        auction.bids.some(bid => bid.userId === currentUser?.id)
      );
      resolve(biddedAuctions);
    }, 500);
  });
};

// Simulate real-time bidding events (for testing real-time updates)
let bidInterval: number | null = null;

export const startRealtimeBidSimulation = (callback: (auction: Auction) => void): void => {
  if (bidInterval) {
    clearInterval(bidInterval);
  }
  
  bidInterval = window.setInterval(() => {
    // Pick a random active auction
    const activeAuctions = auctionData.filter(a => a.status === "active");
    if (activeAuctions.length === 0) return;
    
    const randomAuction = activeAuctions[Math.floor(Math.random() * activeAuctions.length)];
    
    // Create a simulated bid by a random user (not the current user)
    const bidders = mockUsers.filter(u => u.id !== currentUser?.id && u.id !== randomAuction.sellerId);
    if (bidders.length === 0) return;
    
    const bidder = bidders[Math.floor(Math.random() * bidders.length)];
    
    // Calculate a new bid amount (5-15% higher than current price)
    const bidIncrease = randomAuction.currentPrice * (0.05 + Math.random() * 0.1);
    const newBidAmount = Math.round(randomAuction.currentPrice + bidIncrease);
    
    // Create and add the bid
    const newBid: Bid = {
      id: `b${Math.random().toString(36).substring(2, 9)}`,
      userId: bidder.id,
      userName: bidder.name,
      amount: newBidAmount,
      timestamp: new Date()
    };
    
    // Find and update the auction
    const auctionIndex = auctionData.findIndex(a => a.id === randomAuction.id);
    if (auctionIndex !== -1) {
      const updatedAuction = {
        ...auctionData[auctionIndex],
        currentPrice: newBidAmount,
        bids: [...auctionData[auctionIndex].bids, newBid]
      };
      
      auctionData[auctionIndex] = updatedAuction;
      
      // Notify via callback
      callback(updatedAuction);
    }
  }, 15000); // Simulate a bid every 15 seconds
};

export const stopRealtimeBidSimulation = (): void => {
  if (bidInterval) {
    clearInterval(bidInterval);
    bidInterval = null;
  }
};
