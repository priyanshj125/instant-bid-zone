import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAuctions } from "../contexts/AuctionContext";
import { Button } from "@/components/ui/button";
import AuctionCard from "../components/AuctionCard";

const MyBids = () => {
  const { user } = useAuth();
  const { userBids, loadUserBids, isLoading } = useAuctions();
  
  useEffect(() => {
    if (user) {
      loadUserBids();
    }
  }, [user, loadUserBids]);
  
  if (!user) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Login Required</h3>
        <p className="text-gray-500 mb-4">You must be logged in to view your bids.</p>
        <Link to="/login">
          <Button className="bg-auction hover:bg-auction-accent">
            Login
          </Button>
        </Link>
      </div>
    );
  }
  
  const activeAuctions = userBids.filter(auction => auction.status === "active");
  const endedAuctions = userBids.filter(auction => auction.status === "ended");
  
  // Show auctions where user is highest bidder
  const wonAuctions = endedAuctions.filter(auction => {
    return auction.bids.length > 0 && 
           auction.bids[auction.bids.length - 1].userId === user.id;
  });
  
  // Get highest bid amount for each auction
  const getHighestBid = (auctionId: string) => {
    const auction = userBids.find(a => a.id === auctionId);
    if (!auction || auction.bids.length === 0) return 0;
    
    const userBids = auction.bids.filter(bid => bid.userId === user.id);
    if (userBids.length === 0) return 0;
    
    return Math.max(...userBids.map(bid => bid.amount));
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-auction mb-6">My Bids</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-auction"></div>
        </div>
      ) : userBids.length > 0 ? (
        <div className="space-y-10">
          {/* Active Bids */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Bids ({activeAuctions.length})</h2>
            {activeAuctions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeAuctions.map((auction) => {
                  const isHighestBidder = auction.bids.length > 0 && 
                                          auction.bids[auction.bids.length - 1].userId === user.id;
                  return (
                    <AuctionCard 
                      key={auction.id} 
                      auction={auction} 
                      highlight={isHighestBidder} 
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-6 bg-white rounded-lg shadow text-gray-500">
                You have no active bids at the moment.
              </p>
            )}
          </div>
          
          {/* Won Auctions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Won Auctions ({wonAuctions.length})</h2>
            {wonAuctions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wonAuctions.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} highlight />
                ))}
              </div>
            ) : (
              <p className="text-center py-6 bg-white rounded-lg shadow text-gray-500">
                You haven't won any auctions yet.
              </p>
            )}
          </div>
          
          {/* Other Ended Auctions */}
          {endedAuctions.length > wonAuctions.length && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Other Ended Auctions ({endedAuctions.length - wonAuctions.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {endedAuctions
                  .filter(auction => {
                    return auction.bids.length === 0 ||
                           auction.bids[auction.bids.length - 1].userId !== user.id;
                  })
                  .map((auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bids Found</h3>
          <p className="text-gray-500 mb-4">You haven't placed any bids yet.</p>
          <Link to="/auctions">
            <Button className="bg-auction hover:bg-auction-accent">
              Browse Auctions
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBids;
