import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { storage } from "../../firebase";
import {
  getDownloadURL,
  listAll,
  ref
} from "firebase/storage";

interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
}

const ArtworkGrid: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [deletingArtworkId, setDeletingArtworkId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesRef = ref(storage, "images/");
        const result = await listAll(imagesRef);
        const urls = await Promise.all(
          result.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return {
              id: itemRef.name,
              title: itemRef.name.split("-")[1]?.split(".")[0] || itemRef.name,
              imageUrl: url,
            };
          })
        );
        setArtworks(urls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleEdit = (artwork: Artwork) => {
    alert(`Edit ${artwork.title} clicked`);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingArtworkId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingArtworkId) {
      alert(`Delete confirmed for ID: ${deletingArtworkId}`);
      setIsDeleteModalOpen(false);
      setDeletingArtworkId(null);
    }
  };

  return (
    <div className="bg-background p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Artwork Gallery</h1>

      {artworks.length === 0 ? (
        <p className="text-muted-foreground text-center mt-8">No artworks found in the database.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map(({ id, title, imageUrl }) => (
            <Card
              key={id}
              className="overflow-hidden h-full flex flex-col cursor-pointer"
              onClick={() => setZoomedImage(imageUrl)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={imageUrl}
                  alt={title}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
              </div>

              <CardContent className="flex-1 flex flex-col p-4">
                <h2 className="text-lg font-semibold mb-1">{title}</h2>

                <div className="mt-auto flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit({ id, title, imageUrl });
                    }}
                    className="flex items-center gap-1"
                  >
                    <Pencil size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(id);
                    }}
                    className="flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
          role="button"
          tabIndex={0}
        >
          <img
            src={zoomedImage}
            alt="Zoomed artwork"
            className="max-w-full max-h-full rounded"
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        artworkTitle={
          artworks.find((a) => a.id === deletingArtworkId)?.title || ""
        }
      />
    </div>
  );
};

export default ArtworkGrid;
