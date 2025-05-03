
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Auction } from "../types/auction";
import { Link } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";

interface AuctionCardProps {
  auction: Auction;
  highlight?: boolean;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, highlight = false }) => {
  const isEnded = auction.status === "ended";
  const isUpcoming = auction.status === "upcoming";
  
  const borderClass = highlight 
    ? "border-auction-accent border-2" 
    : isEnded 
      ? "border-gray-300" 
      : "";
      
  const totalBids = auction.bids.length;
  
  return (
    <Card className={`auction-card overflow-hidden ${borderClass} ${isEnded ? 'opacity-75' : ''}`}>
      {highlight && (
        <div className="absolute top-0 right-0 bg-auction-accent text-white px-2 py-1 text-xs font-medium z-10">
          Your Bid
        </div>
      )}
      {isEnded && (
        <div className="absolute top-0 left-0 right-0 bg-gray-800 bg-opacity-70 text-white px-2 py-1 text-sm font-medium text-center z-10">
          Auction Ended
        </div>
      )}
      {isUpcoming && (
        <div className="absolute top-0 left-0 right-0 bg-auction-accent bg-opacity-70 text-white px-2 py-1 text-sm font-medium text-center z-10">
          Coming Soon
        </div>
      )}
      <Link to={`/auction/${auction.id}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={auction.imageUrl} 
            alt={auction.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-auction">{auction.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{auction.description}</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Current Bid:</p>
              <p className="text-lg font-bold text-auction-dark">${auction.currentPrice.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Bids:</p>
              <p className="text-lg font-medium">{totalBids}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 border-t">
          <div className="w-full">
            {!isEnded && !isUpcoming ? (
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">Ends in:</div>
                <CountdownTimer endDate={auction.endDate} />
              </div>
            ) : isEnded ? (
              <div className="text-sm text-gray-500 text-center w-full">
                Winning bid: ${auction.currentPrice.toFixed(2)}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center w-full">
                Starts in: <CountdownTimer endDate={auction.startDate} />
              </div>
            )}
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AuctionCard;
