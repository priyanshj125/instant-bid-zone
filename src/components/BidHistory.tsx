
import React from "react";
import { Bid } from "../types/auction";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BidHistoryProps {
  bids: Bid[];
  currentUserId?: string;
}

const BidHistory: React.FC<BidHistoryProps> = ({ bids, currentUserId }) => {
  // Sort bids by time (newest first)
  const sortedBids = [...bids].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  if (bids.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No bids yet. Be the first to bid!
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[300px] rounded-md border">
      <div className="p-4">
        <h3 className="font-semibold mb-4">Bid History ({bids.length})</h3>
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="pb-2">Bidder</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedBids.map((bid) => (
              <tr 
                key={bid.id} 
                className={`border-b border-gray-100 last:border-0 ${currentUserId === bid.userId ? "bg-auction-light" : ""}`}
              >
                <td className="py-2 pr-4">
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-auction-accent text-white flex items-center justify-center text-xs mr-2">
                      {bid.userName.charAt(0)}
                    </div>
                    <span className={currentUserId === bid.userId ? "font-medium" : ""}>
                      {bid.userName === "You" ? "You" : bid.userName}
                      {currentUserId === bid.userId && bid.userName !== "You" && " (You)"}
                    </span>
                  </div>
                </td>
                <td className="py-2 pr-4 font-medium">${bid.amount.toFixed(2)}</td>
                <td className="py-2 text-sm text-gray-500">{formatDate(bid.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
};

export default BidHistory;
