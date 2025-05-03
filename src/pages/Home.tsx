
import React, { useEffect, useState } from "react";
import { useAuctions } from "../contexts/AuctionContext";
import AuctionCard from "../components/AuctionCard";
import { Auction } from "../types/auction";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  const { auctions, isLoading, refresh } = useAuctions();
  const [featuredAuctions, setFeaturedAuctions] = useState<Auction[]>([]);
  const [endingSoonAuctions, setEndingSoonAuctions] = useState<Auction[]>([]);
  
  useEffect(() => {
    if (auctions.length > 0) {
      // Get active auctions
      const activeAuctions = auctions.filter(a => a.status === "active");
      
      // Featured auctions - those with most bids
      const featured = [...activeAuctions]
        .sort((a, b) => b.bids.length - a.bids.length)
        .slice(0, 3);
      setFeaturedAuctions(featured);
      
      // Ending soon - sort by end date
      const ending = [...activeAuctions]
        .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
        .slice(0, 3);
      setEndingSoonAuctions(ending);
    }
  }, [auctions]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-auction text-white rounded-lg shadow-md mb-10">
        <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bid, Win, Celebrate</h1>
            <p className="text-lg md:text-xl mb-6">
              Join our real-time auction platform and bid on exclusive items. 
              Experience the thrill of live bidding with instant updates.
            </p>
            <div className="space-x-4">
              <Link to="/auctions">
                <Button className="bg-white text-auction hover:bg-auction-light">
                  Explore Auctions
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="text-white border-white hover:bg-auction-accent">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-12">
            <img 
              src="https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=500" 
              alt="Auction action" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-auction">Featured Auctions</h2>
          <Link to="/auctions" className="text-auction-accent hover:text-auction font-medium">
            View all
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-auction"></div>
          </div>
        ) : featuredAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500">No featured auctions available at the moment.</p>
        )}
      </section>

      {/* Ending Soon */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-auction">Ending Soon</h2>
          <Link to="/auctions" className="text-auction-accent hover:text-auction font-medium">
            View all
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-auction"></div>
          </div>
        ) : endingSoonAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {endingSoonAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500">No auctions ending soon.</p>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-white rounded-lg shadow-sm p-6 mb-10">
        <h2 className="text-2xl font-bold text-auction mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-auction-light w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
              <span className="text-auction text-2xl font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Browse Items</h3>
            <p className="text-gray-600">
              Explore our diverse collection of auctions and find items that catch your interest.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-auction-light w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
              <span className="text-auction text-2xl font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Place Your Bid</h3>
            <p className="text-gray-600">
              Enter a bid that's higher than the current price and wait for the auction to end.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-auction-light w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
              <span className="text-auction text-2xl font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Win & Collect</h3>
            <p className="text-gray-600">
              If you're the highest bidder when the auction ends, you win the item!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
