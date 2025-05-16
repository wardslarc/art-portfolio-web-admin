import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./admin/LoginForm";
import ArtworkGrid from "./admin/ArtworkGrid";
import ImageUploadModal from "./admin/ImageUploadModal"; // ✅ Import added
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Mock data for development purposes
const mockArtworks = [
  {
    id: "1",
    title: "Abstract Composition",
    description: "A vibrant exploration of color and form",
    medium: "Oil on canvas",
    dimensions: '24" x 36"',
    created_at: "2023-05-15",
    image_url:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
  },
  {
    id: "2",
    title: "Urban Landscape",
    description: "Cityscape at dusk with dramatic lighting",
    medium: "Acrylic on panel",
    dimensions: '18" x 24"',
    created_at: "2023-07-22",
    image_url:
      "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=800&q=80",
  },
  {
    id: "3",
    title: "Portrait Study",
    description: "Exploration of light and shadow on the human face",
    medium: "Charcoal on paper",
    dimensions: '11" x 14"',
    created_at: "2023-09-10",
    image_url:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
  },
  {
    id: "4",
    title: "Seascape",
    description: "Ocean waves at sunset",
    medium: "Watercolor",
    dimensions: '12" x 16"',
    created_at: "2023-11-05",
    image_url:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80",
  },
];

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [artworks, setArtworks] = useState(mockArtworks);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("gallery");

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // ✅ Modal state

  // Placeholder for image selection handling
  const handleImageSelected = (imageUrl: string) => {
    console.log("Selected image URL:", imageUrl);
    setIsUploadModalOpen(false);

    // Optional: Add new artwork to gallery here
    const newArtwork = {
      id: Date.now().toString(),
      title: "New Artwork",
      description: "Uploaded via modal",
      medium: "Unknown",
      dimensions: "N/A",
      created_at: new Date().toISOString(),
      image_url: imageUrl,
    };

    setArtworks([newArtwork, ...artworks]);
  };

  // Simulating authentication check
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      setTimeout(() => {
        setArtworks(mockArtworks);
        setIsLoading(false);
      }, 500);
    }
  }, [isAuthenticated]);

  const handleLogin = (email: string, password: string) => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("authToken", "mock-token");
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  const handleDeleteArtwork = (id: string) => {
    setArtworks(artworks.filter((artwork) => artwork.id !== id));
  };

  const handleUpdateArtwork = (updatedArtwork: any) => {
    setArtworks(
      artworks.map((artwork) =>
        artwork.id === updatedArtwork.id ? updatedArtwork : artwork,
      ),
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Artist Portfolio Admin</h1>
            <p className="text-muted-foreground">
              Manage your artwork collection
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main>
        <Tabs
          defaultValue="gallery"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery">
            <Card>
              <CardContent className="pt-6">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="mb-4 px-4 py-2 bg-primary text-white rounded-md"
                >
                  Upload New Image
                </button>

                <ArtworkGrid
                  artworks={artworks}
                  isLoading={isLoading}
                  onDelete={handleDeleteArtwork}
                  onUpdate={handleUpdateArtwork}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardContent className="pt-6">
                <div className="p-4 text-center">
                  <h3 className="text-xl font-medium mb-2">
                    Collection Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-card border rounded-lg p-4">
                      <p className="text-muted-foreground">Total Artworks</p>
                      <p className="text-3xl font-bold">{artworks.length}</p>
                    </div>
                    <div className="bg-card border rounded-lg p-4">
                      <p className="text-muted-foreground">Latest Addition</p>
                      <p className="text-xl font-medium">
                        {artworks.length > 0 ? artworks[0].title : "None"}
                      </p>
                    </div>
                    <div className="bg-card border rounded-lg p-4">
                      <p className="text-muted-foreground">
                        Most Common Medium
                      </p>
                      <p className="text-xl font-medium">Oil on canvas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <ImageUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onImageSelected={handleImageSelected}
        currentImageUrl=""
      />
    </div>
  );
};

export default Home;
