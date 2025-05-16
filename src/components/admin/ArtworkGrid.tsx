import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
}

const artworks: Artwork[] = [
  {
    id: "1",
    title: "Laywa",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/artist-portfolio-5c31e.firebasestorage.app/o/images%2F1747383003471-laywa.PNG?alt=media&token=20710f0d-50bb-45be-9224-9d833eb2ea6a",
  },
  {
    id: "2",
    title: "Test 1",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/artist-portfolio-5c31e.firebasestorage.app/o/images%2F1747384291135-test1.PNG?alt=media&token=2cbaf622-55c1-4d43-81a4-8546794ca046",
  },
];

const ArtworkGrid: React.FC = () => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [deletingArtworkId, setDeletingArtworkId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
                    e.stopPropagation(); // Prevent zoom
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
                    e.stopPropagation(); // Prevent zoom
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
