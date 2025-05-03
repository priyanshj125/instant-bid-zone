
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAuctions } from "../contexts/AuctionContext";
import { Button } from "@/components/ui/button";
import AuctionCard from "../components/AuctionCard";

const MyAuctions = () => {
  const { user } = useAuth();
  const { userAuctions, loadUserAuctions, isLoading } = useAuctions();
  
  useEffect(() => {
    if (user) {
      loadUserAuctions();
    }
  }, [user, loadUserAuctions]);
  
  if (!user) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Login Required</h3>
        <p className="text-gray-500 mb-4">You must be logged in to view your auctions.</p>
        <Link to="/login">
          <Button className="bg-auction hover:bg-auction-accent">
            Login
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-auction">My Auctions</h1>
        <Link to="/create">
          <Button className="bg-auction hover:bg-auction-accent">
            Create New Auction
          </Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-auction"></div>
        </div>
      ) : userAuctions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Auctions Found</h3>
          <p className="text-gray-500 mb-4">You haven't created any auctions yet.</p>
          <Link to="/create">
            <Button className="bg-auction hover:bg-auction-accent">
              Create Your First Auction
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyAuctions;
