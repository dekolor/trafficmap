"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

interface Image {
  key: string;
  url: string;
  createdAt: string;
}

export default function TrafficMap() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Daily Traffic Maps
      </h1>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Dialog key={image.key}>
              <DialogTrigger asChild>
                <Card className="overflow-hidden cursor-pointer transition-transform hover:scale-105">
                  <CardContent className="p-0">
                    <Image
                      src={image.url}
                      alt={`Traffic Map ${image.key}`}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                    <div className="p-2 bg-background/80 backdrop-blur-sm">
                      <p className="text-sm text-foreground/80">
                        {format(new Date(image.createdAt), "PPpp")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] w-full sm:max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
                <div
                  className="relative w-full"
                  style={{ paddingTop: "56.25%" }}
                >
                  <Image
                    src={image.url}
                    alt={`Traffic Map ${image.key}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                    className="object-contain absolute top-0 left-0"
                    priority
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">
                    Date: {format(new Date(image.createdAt), "PPpp")}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
