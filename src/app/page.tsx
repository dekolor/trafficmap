"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  MapPin,
  X,
} from "lucide-react";

interface Image {
  key: string;
  url: string;
  createdAt: string;
}

export default function TrafficMap() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridView, setIsGridView] = useState(true);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const imagesPerPage = isGridView ? 9 : 10;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/images");
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to load images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (galleryIndex === null) return;
      if (event.key === "ArrowLeft") {
        navigateGallery("prev");
      } else if (event.key === "ArrowRight") {
        navigateGallery("next");
      } else if (event.key === "Escape") {
        closeGallery();
      }
    },
    [galleryIndex]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p className="text-xl font-semibold">{error}</p>
      </div>
    );
  }

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const openGallery = (index: number) => {
    setGalleryIndex(index);
  };

  const closeGallery = () => {
    setGalleryIndex(null);
  };

  const navigateGallery = (direction: "prev" | "next") => {
    if (galleryIndex === null) return;
    const newIndex = direction === "prev" ? galleryIndex - 1 : galleryIndex + 1;
    if (newIndex >= 0 && newIndex < images.length) {
      setGalleryIndex(newIndex);
    }
  };

  const ImageCard = ({ image, index }: { image: Image; index: number }) => (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
      onClick={() => openGallery(index)}
    >
      <CardContent className="p-0 relative">
        <Image
          src={image.url}
          alt={`Traffic Map ${image.key}`}
          width={600}
          height={400}
          className="w-full h-auto object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-background/80 backdrop-blur-sm">
          <p className="text-sm font-medium text-foreground flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(image.createdAt), "PPpp")}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center flex items-center justify-center">
        <MapPin className="mr-2" />
        Daily Traffic Maps
      </h1>
      <div className="flex justify-end mb-4">
        <Toggle
          aria-label="Toggle view"
          pressed={isGridView}
          onPressedChange={setIsGridView}
        >
          {isGridView ? (
            <Grid className="h-4 w-4" />
          ) : (
            <List className="h-4 w-4" />
          )}
        </Toggle>
      </div>
      <ScrollArea className="h-[calc(100vh-20rem)]">
        {isGridView ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentImages.map((image, index) => (
              <ImageCard
                key={image.key}
                image={image}
                index={indexOfFirstImage + index}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {currentImages.map((image, index) => (
              <Card key={image.key} className="overflow-hidden">
                <CardContent className="p-2 flex items-center">
                  <div className="w-20 h-20 mr-4 flex-shrink-0">
                    <Image
                      src={image.url}
                      alt={`Traffic Map ${image.key}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium mb-1 flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(new Date(image.createdAt), "PPpp")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Traffic map snapshot
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => openGallery(indexOfFirstImage + index)}
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
      <div className="mt-8 flex justify-center items-center space-x-4">
        <Button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <span className="text-sm font-medium">
          Page {currentPage} of {Math.ceil(images.length / imagesPerPage)}
        </span>
        <Button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(images.length / imagesPerPage)}
          variant="outline"
        >
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {galleryIndex !== null && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative w-full max-w-7xl mx-auto p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={closeGallery}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close gallery</span>
            </Button>
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <Image
                src={images[galleryIndex].url}
                alt={`Traffic Map ${images[galleryIndex].key}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg font-medium flex items-center justify-center">
                <Calendar className="mr-2" />
                {format(new Date(images[galleryIndex].createdAt), "PPpp")}
              </p>
            </div>
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateGallery("prev")}
                disabled={galleryIndex === 0}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            </div>
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateGallery("next")}
                disabled={galleryIndex === images.length - 1}
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
