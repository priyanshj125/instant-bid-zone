
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuctions } from "../contexts/AuctionContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { AuctionFormData } from "../types/auction";

const CreateAuction = () => {
  const { createNewAuction } = useAuctions();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<AuctionFormData>({
    title: "",
    description: "",
    imageUrl: "",
    category: "Other",
    startingPrice: 1,
    duration: 24, // Default 24 hours
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "startingPrice" ? parseFloat(value) : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === "duration" ? parseInt(value) : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!user) {
      setError("You must be logged in to create an auction");
      return;
    }
    
    // Validate form data
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }
    
    if (formData.startingPrice <= 0) {
      setError("Starting price must be greater than 0");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createNewAuction(formData);
      navigate("/my-auctions");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create auction");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const categories = [
    "Electronics",
    "Jewelry",
    "Art",
    "Furniture",
    "Fashion",
    "Collectibles",
    "Sports",
    "Books",
    "Vehicles",
    "Other",
  ];
  
  const durations = [
    { value: 1, label: "1 hour" },
    { value: 6, label: "6 hours" },
    { value: 12, label: "12 hours" },
    { value: 24, label: "1 day" },
    { value: 48, label: "2 days" },
    { value: 72, label: "3 days" },
    { value: 168, label: "1 week" },
  ];
  
  if (!user) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Login Required</h3>
        <p className="text-gray-500 mb-4">You must be logged in to create an auction.</p>
        <Button 
          className="bg-auction hover:bg-auction-accent"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-auction mb-6">Create New Auction</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Item Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter a descriptive title for your item"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide a detailed description of the item"
              rows={5}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (Optional)
              </label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                If left empty, a placeholder image will be used
              </p>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Starting Price (USD)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <Input
                  id="startingPrice"
                  name="startingPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.startingPrice}
                  onChange={handleInputChange}
                  className="pl-8"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Auction Duration
              </label>
              <Select
                value={formData.duration.toString()}
                onValueChange={(value) => handleSelectChange("duration", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value.toString()}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-auction hover:bg-auction-accent"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Auction"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateAuction;
