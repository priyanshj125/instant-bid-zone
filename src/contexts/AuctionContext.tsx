
import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { Auction } from "../types/auction";
import { 
  getAuctions, 
  getAuctionById, 
  placeBid, 
  createAuction, 
  getUserAuctions, 
  getUserBids,
  startRealtimeBidSimulation,
  stopRealtimeBidSimulation
} from "../services/auctionService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";

interface AuctionContextType {
  auctions: Auction[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  getAuction: (id: string) => Promise<Auction>;
  submitBid: (auctionId: string, amount: number) => Promise<void>;
  createNewAuction: (auctionData: any) => Promise<void>;
  userAuctions: Auction[];
  userBids: Auction[];
  loadUserAuctions: () => Promise<void>;
  loadUserBids: () => Promise<void>;
}

const AuctionContext = createContext<AuctionContextType>({} as AuctionContextType);

export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [userAuctions, setUserAuctions] = useState<Auction[]>([]);
  const [userBids, setUserBids] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleRealtimeBidUpdate = useCallback((updatedAuction: Auction) => {
    setAuctions(prevAuctions => 
      prevAuctions.map(auction => 
        auction.id === updatedAuction.id ? updatedAuction : auction
      )
    );

    // If current user was outbid, show notification
    if (user && 
        updatedAuction.bids.length >= 2 && 
        updatedAuction.bids[updatedAuction.bids.length - 2].userId === user.id) {
      toast({
        title: "You've been outbid!",
        description: `Someone has placed a higher bid of $${updatedAuction.currentPrice} on ${updatedAuction.title}`,
        variant: "destructive",
      });
    }
  }, [toast, user]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAuctions();
      setAuctions(data);
    } catch (error) {
      toast({
        title: "Failed to load auctions",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    refresh();

    // Start simulating real-time bids
    startRealtimeBidSimulation(handleRealtimeBidUpdate);

    return () => {
      // Clean up the real-time simulation when component unmounts
      stopRealtimeBidSimulation();
    };
  }, [refresh, handleRealtimeBidUpdate]);

  const getAuction = async (id: string): Promise<Auction> => {
    try {
      return await getAuctionById(id);
    } catch (error) {
      toast({
        title: "Failed to load auction",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const submitBid = async (auctionId: string, amount: number): Promise<void> => {
    try {
      const updatedAuction = await placeBid(auctionId, amount);
      // Update the auction in the auctions list
      setAuctions(prevAuctions => 
        prevAuctions.map(auction => 
          auction.id === auctionId ? updatedAuction : auction
        )
      );
      
      // Also update in userBids if it's there
      setUserBids(prevBids => 
        prevBids.map(auction => 
          auction.id === auctionId ? updatedAuction : auction
        )
      );
    } catch (error) {
      toast({
        title: "Bid Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createNewAuction = async (auctionData: any): Promise<void> => {
    try {
      const newAuction = await createAuction(auctionData);
      // Add the new auction to the auctions list
      setAuctions(prevAuctions => [newAuction, ...prevAuctions]);
      
      // Also update userAuctions
      setUserAuctions(prevAuctions => [newAuction, ...prevAuctions]);
      
      toast({
        title: "Auction Created",
        description: "Your auction has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to Create Auction",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const loadUserAuctions = async (): Promise<void> => {
    if (!user) return;
    
    try {
      const data = await getUserAuctions();
      setUserAuctions(data);
    } catch (error) {
      toast({
        title: "Failed to load your auctions",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const loadUserBids = async (): Promise<void> => {
    if (!user) return;
    
    try {
      const data = await getUserBids();
      setUserBids(data);
    } catch (error) {
      toast({
        title: "Failed to load your bids",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <AuctionContext.Provider 
      value={{ 
        auctions, 
        isLoading, 
        refresh, 
        getAuction, 
        submitBid, 
        createNewAuction,
        userAuctions,
        userBids,
        loadUserAuctions,
        loadUserBids
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuctions = () => useContext(AuctionContext);
