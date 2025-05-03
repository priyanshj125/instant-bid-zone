
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const { user, logout } = useAuth();
  
  if (!user) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Login Required</h3>
        <p className="text-gray-500 mb-4">You must be logged in to view your profile.</p>
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
      <h1 className="text-3xl font-bold text-auction mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center pb-6">
                <div className="w-32 h-32 mb-4">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mb-4"
              >
                Edit Profile
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full text-red-500 hover:bg-red-50"
                onClick={() => logout()}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="auctions">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="auctions" className="flex-1">My Auctions</TabsTrigger>
                  <TabsTrigger value="bids" className="flex-1">My Bids</TabsTrigger>
                  <TabsTrigger value="watchlist" className="flex-1">Watchlist</TabsTrigger>
                </TabsList>
                <TabsContent value="auctions">
                  <div className="text-center py-8">
                    <Link to="/my-auctions">
                      <Button className="bg-auction hover:bg-auction-accent">
                        View My Auctions
                      </Button>
                    </Link>
                  </div>
                </TabsContent>
                <TabsContent value="bids">
                  <div className="text-center py-8">
                    <Link to="/my-bids">
                      <Button className="bg-auction hover:bg-auction-accent">
                        View My Bids
                      </Button>
                    </Link>
                  </div>
                </TabsContent>
                <TabsContent value="watchlist">
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">Your watchlist is empty.</p>
                    <Link to="/auctions">
                      <Button variant="outline">
                        Browse Auctions
                      </Button>
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm mt-6">
            <CardHeader>
              <CardTitle>Account Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-auction-light rounded-lg p-4 text-center">
                  <p className="text-lg font-bold text-auction">0</p>
                  <p className="text-sm text-gray-600">Active Auctions</p>
                </div>
                <div className="bg-auction-light rounded-lg p-4 text-center">
                  <p className="text-lg font-bold text-auction">0</p>
                  <p className="text-sm text-gray-600">Active Bids</p>
                </div>
                <div className="bg-auction-light rounded-lg p-4 text-center">
                  <p className="text-lg font-bold text-auction">0</p>
                  <p className="text-sm text-gray-600">Won Auctions</p>
                </div>
                <div className="bg-auction-light rounded-lg p-4 text-center">
                  <p className="text-lg font-bold text-auction">0</p>
                  <p className="text-sm text-gray-600">Total Sales</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
