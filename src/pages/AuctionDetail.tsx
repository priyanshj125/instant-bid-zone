
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuctions } from "../contexts/AuctionContext";
import { useAuth } from "../contexts/AuthContext";
import CountdownTimer from "../components/CountdownTimer";
import BidHistory from "../components/BidHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Auction } from "../types/auction";
import { Separator } from "@/components/ui/separator";

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getAuction, submitBid } = useAuctions();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [auction, setAuction] = useState<Auction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load auction details
  useEffect(() => {
    const loadAuction = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const auctionData = await getAuction(id);
        setAuction(auctionData);
        
        // Set initial bid amount to current price + minimum increment
        const minIncrement = Math.max(1, Math.round(auctionData.currentPrice * 0.05)); // 5% or at least $1
        setBidAmount((auctionData.currentPrice + minIncrement).toString());
      } catch (error) {
        console.error("Failed to load auction:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAuction();
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      if (id) {
        getAuction(id).then(updatedAuction => {
          setAuction(updatedAuction);
        });
      }
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [id, getAuction]);
  
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auction || !user) return;
    
    // Validate bid amount
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= auction.currentPrice) {
      setError(`Bid must be higher than the current bid of $${auction.currentPrice.toFixed(2)}`);
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await submitBid(auction.id, amount);
      // Update auction data after successful bid
      const updatedAuction = await getAuction(auction.id);
      setAuction(updatedAuction);
      
      // Update bid input to be higher than the new current price
      const minIncrement = Math.max(1, Math.round(updatedAuction.currentPrice * 0.05));
      setBidAmount((updatedAuction.currentPrice + minIncrement).toString());
    } catch (error) {
      console.error("Bid submission error:", error);
      setError(error instanceof Error ? error.message : "Failed to place bid");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-auction"></div>
      </div>
    );
  }
  
  if (!auction) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Auction not found</h3>
        <p className="text-gray-500 mb-4">The auction you're looking for does not exist or has been removed.</p>
        <Link to="/auctions">
          <Button className="bg-auction hover:bg-auction-accent">
            Browse Auctions
          </Button>
        </Link>
      </div>
    );
  }
  
  const isActive = auction.status === "active";
  const isEnded = auction.status === "ended";
  const isUpcoming = auction.status === "upcoming";
  const isUserSeller = user && auction.sellerId === user.id;
  const hasUserBid = user && auction.bids.some(bid => bid.userId === user.id);
  const isUserHighestBidder = user && auction.bids.length > 0 && auction.bids[auction.bids.length - 1].userId === user.id;
  
  return (
    <div>
      <div className="mb-6">
        <Link to="/auctions" className="text-auction hover:text-auction-accent">
          &larr; Back to Auctions
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side - Image */}
          <div className="p-6">
            <div className="rounded-lg overflow-hidden shadow-md">
              <img 
                src={auction.imageUrl} 
                alt={auction.title} 
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-600">Category:</div>
                <div>{auction.category}</div>
                
                <div className="text-gray-600">Seller:</div>
                <div>{auction.sellerName}</div>
                
                <div className="text-gray-600">Starting Price:</div>
                <div>${auction.startingPrice.toFixed(2)}</div>
                
                <div className="text-gray-600">Current Price:</div>
                <div className="font-semibold text-auction">${auction.currentPrice.toFixed(2)}</div>
                
                <div className="text-gray-600">Total Bids:</div>
                <div>{auction.bids.length}</div>
                
                <div className="text-gray-600">Start Date:</div>
                <div>{new Date(auction.startDate).toLocaleDateString()}</div>
                
                <div className="text-gray-600">End Date:</div>
                <div>{new Date(auction.endDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Auction info and bidding */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-auction">{auction.title}</h1>
              
              {isActive && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </div>
              )}
              
              {isEnded && (
                <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  Ended
                </div>
              )}
              
              {isUpcoming && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Coming Soon
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">{auction.description}</p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <div>
                  {isActive && (
                    <div className="text-sm text-gray-600 mb-1">Auction ends in:</div>
                  )}
                  {isUpcoming && (
                    <div className="text-sm text-gray-600 mb-1">Auction starts in:</div>
                  )}
                  {isActive && (
                    <CountdownTimer endDate={auction.endDate} />
                  )}
                  {isUpcoming && (
                    <CountdownTimer endDate={auction.startDate} />
                  )}
                  {isEnded && (
                    <div className="text-sm text-gray-600">
                      This auction ended on {new Date(auction.endDate).toLocaleString()}
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Current Bid:</div>
                  <div className="text-2xl font-bold text-auction">
                    ${auction.currentPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            
            {isActive && !isUserSeller && (
              <div className="mb-6">
                {user ? (
                  <form onSubmit={handleBidSubmit}>
                    <div className="flex items-end gap-4">
                      <div className="flex-grow">
                        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Bid (USD)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                          <Input
                            id="bidAmount"
                            type="number"
                            step="0.01"
                            min={auction.currentPrice + 0.01}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="pl-8"
                          />
                        </div>
                        {error && (
                          <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        className="bg-auction-accent hover:bg-auction text-white" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Placing Bid..." : "Place Bid"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-4 border border-gray-200 rounded-lg">
                    <p className="text-gray-700 mb-3">Please log in to place a bid</p>
                    <Link to="/login">
                      <Button className="bg-auction hover:bg-auction-accent">
                        Log In to Bid
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {isUserSeller && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mb-6">
                <p className="font-medium">This is your auction</p>
                <p className="text-sm">You cannot bid on your own auction.</p>
              </div>
            )}
            
            {isEnded && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-lg mb-2">Auction Results</h3>
                {auction.bids.length > 0 ? (
                  <div>
                    <p className="text-gray-700">
                      Winning bid: <span className="font-semibold">${auction.currentPrice.toFixed(2)}</span> by{" "}
                      <span className="font-semibold">
                        {auction.bids[auction.bids.length - 1].userName}
                        {isUserHighestBidder && " (You)"}
                      </span>
                    </p>
                    {isUserHighestBidder && (
                      <div className="mt-4">
                        <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center">
                          <p className="font-semibold mb-1">Congratulations! You won this auction!</p>
                          <p className="text-sm">The seller will contact you with payment instructions.</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-700">This auction ended with no bids.</p>
                )}
              </div>
            )}
            
            {/* Bid History */}
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4">Bid History</h3>
              <BidHistory bids={auction.bids} currentUserId={user?.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
