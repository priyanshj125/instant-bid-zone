
import React from "react";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-auction"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-auction-light">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-auction text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-lg mb-2">InstantBid</h3>
              <p className="text-sm text-gray-300">The premier real-time auction platform</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-2">Learn More</h4>
                <ul className="text-sm space-y-1">
                  <li><a href="#" className="hover:text-auction-accent">About Us</a></li>
                  <li><a href="#" className="hover:text-auction-accent">How It Works</a></li>
                  <li><a href="#" className="hover:text-auction-accent">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <ul className="text-sm space-y-1">
                  <li><a href="#" className="hover:text-auction-accent">Support</a></li>
                  <li><a href="#" className="hover:text-auction-accent">Feedback</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-auction-dark text-center text-xs text-gray-300">
            &copy; {new Date().getFullYear()} InstantBid. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
