"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  MapPin,
  Calendar,
  Grid3X3,
  List,
  X,
  ContrastIcon as Compare,
  Search,
  Menu,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ImageGrid } from "@/components/image-grid";
import { ImageList } from "@/components/image-list";
import { ImageGallery } from "@/components/image-gallery";
import { ComparisonView } from "@/components/comparison-view";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

interface Image {
  key: string;
  url: string;
  createdAt: string;
}

export default function TrafficMapApp() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [viewMode, setViewMode] = useState<string>("grid");
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const isMobile = useMobile();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        // Simulate loading delay for demonstration
        await new Promise((resolve) => setTimeout(resolve, 1000));

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

  // Filter images by date and search query
  const filteredImages = images.filter((image) => {
    // Date filter
    if (selectedDate) {
      const imageDate = format(new Date(image.createdAt), "yyyy-MM-dd");
      const filterDate = format(selectedDate, "yyyy-MM-dd");
      if (imageDate !== filterDate) return false;
    }

    // Search filter (if implemented)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const dateStr = format(new Date(image.createdAt), "PPpp").toLowerCase();
      return (
        dateStr.includes(searchLower) ||
        image.key.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const toggleImageSelection = (index: number) => {
    if (!comparisonMode) return;

    setSelectedImages((prev) => {
      // If already selected, remove it
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }

      // If not selected and we have less than 6 images, add it
      if (prev.length < 6) {
        return [...prev, index];
      }

      // If we already have 6 images, show a toast and don't add more
      toast({
        title: "Maximum selection reached",
        description: "You can compare up to 6 images at once",
        variant: "destructive",
      });
      return prev;
    });
  };

  const handleImageClick = (index: number) => {
    if (comparisonMode) {
      toggleImageSelection(index);
    } else {
      setGalleryIndex(index);
    }
  };

  const toggleComparisonMode = () => {
    if (comparisonMode) {
      // Exiting comparison mode
      setComparisonMode(false);
      setSelectedImages([]);
    } else {
      // Entering comparison mode
      setComparisonMode(true);
      toast({
        title: "Comparison Mode Activated",
        description: "Select up to 6 images to compare side by side",
      });
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    escape: () => {
      if (galleryIndex !== null) {
        setGalleryIndex(null);
      } else if (showComparison) {
        setShowComparison(false);
      } else if (comparisonMode) {
        toggleComparisonMode();
      }
    },
    c: () => {
      toggleComparisonMode();
    },
    r: () => {
      window.location.reload();
    },
    "?": () => {
      setShowShortcuts(true);
    },
    arrowleft: () => {
      if (galleryIndex !== null && galleryIndex > 0) {
        setGalleryIndex(galleryIndex - 1);
      }
    },
    arrowright: () => {
      if (galleryIndex !== null && galleryIndex < filteredImages.length - 1) {
        setGalleryIndex(galleryIndex + 1);
      }
    },
  });

  const startComparison = () => {
    if (selectedImages.length < 2) {
      toast({
        title: "Select at least 2 images",
        description: "You need to select at least 2 images to compare",
        variant: "destructive",
      });
      return;
    }
    setShowComparison(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-primary animate-pulse" />
          </div>
        </div>
        <h2 className="mt-6 text-xl font-medium animate-pulse">
          Loading traffic maps...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/30 max-w-md text-center">
          <X className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold text-red-500 mb-2">
            Something went wrong
          </h2>
          <p className="text-slate-300">{error}</p>
          <Button
            className="mt-4 bg-red-500 hover:bg-red-600 text-white"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-md bg-slate-900/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-300 hover:text-white"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="bg-slate-900 text-white border-slate-700"
                >
                  <div className="flex flex-col gap-4 mt-8">
                    <h2 className="text-xl font-bold flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-primary" />
                      Traffic Maps
                    </h2>
                    <div className="space-y-4">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setSelectedDate(undefined);
                          setSearchQuery("");
                        }}
                      >
                        <Grid3X3 className="mr-2 h-4 w-4" />
                        All Maps
                      </Button>
                      <Button
                        variant={comparisonMode ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={toggleComparisonMode}
                      >
                        <Compare className="mr-2 h-4 w-4" />
                        Compare Maps
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <h1
              className={cn(
                "font-bold flex items-center transition-all",
                isMobile ? "text-xl" : "text-2xl"
              )}
            >
              <MapPin
                className={cn(
                  "text-primary transition-all",
                  isMobile ? "mr-1.5 h-5 w-5" : "mr-2 h-6 w-6"
                )}
              />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                Traffic Maps
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {!isMobile && (
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search maps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-primary"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-7 w-7 text-slate-400 hover:text-white"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            )}

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white",
                    isMobile ? "w-[140px]" : "w-[200px]"
                  )}
                >
                  {selectedDate ? (
                    format(
                      selectedDate,
                      isMobile ? "MMM d, yyyy" : "MMMM d, yyyy"
                    )
                  ) : (
                    <span className="text-slate-400">Select date</span>
                  )}
                  <Calendar className="ml-auto h-4 w-4 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-slate-800 border-slate-700"
                align="end"
              >
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="bg-slate-800 text-white"
                />
              </PopoverContent>
            </Popover>

            {selectedDate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDate(undefined)}
                aria-label="Clear date filter"
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {!isMobile && (
              <Button
                variant={comparisonMode ? "default" : "outline"}
                onClick={toggleComparisonMode}
                className={cn(
                  comparisonMode
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
                )}
              >
                <Compare className="h-4 w-4 mr-2" />
                {comparisonMode ? "Exit Comparison" : "Compare Maps"}
              </Button>
            )}

            {/* Keyboard Shortcuts Help */}
            <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white"
                  title="Keyboard shortcuts (?)"
                >
                  <Keyboard className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Keyboard className="h-5 w-5" />
                    Keyboard Shortcuts
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Close / Exit</span>
                    <kbd className="px-2 py-1 bg-slate-700 rounded text-sm font-mono">Esc</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Toggle Comparison Mode</span>
                    <kbd className="px-2 py-1 bg-slate-700 rounded text-sm font-mono">C</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Previous Image</span>
                    <kbd className="px-2 py-1 bg-slate-700 rounded text-sm font-mono">←</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Next Image</span>
                    <kbd className="px-2 py-1 bg-slate-700 rounded text-sm font-mono">→</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Reload Page</span>
                    <kbd className="px-2 py-1 bg-slate-700 rounded text-sm font-mono">R</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Show This Help</span>
                    <kbd className="px-2 py-1 bg-slate-700 rounded text-sm font-mono">?</kbd>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      {isMobile && (
        <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-700/50">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search maps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-primary"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7 text-slate-400 hover:text-white"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-6">
          {/* Comparison Mode Controls */}
          {comparisonMode && (
            <div className="mb-6 rounded-xl overflow-hidden">
              <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <span className="font-medium text-slate-300 mr-2">
                      Selected:
                    </span>
                    <div className="flex gap-1">
                      {selectedImages.length === 0 ? (
                        <span className="text-slate-400">
                          No images selected
                        </span>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-primary/20 text-primary-foreground border border-primary/30"
                        >
                          {selectedImages.length} images
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedImages([])}
                      disabled={selectedImages.length === 0}
                      className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 text-white"
                    >
                      Clear Selection
                    </Button>
                    <Button
                      size="sm"
                      onClick={startComparison}
                      disabled={selectedImages.length < 2}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Compare Selected
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Info */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-slate-300">
              {filteredImages.length === 0 ? (
                <p>No traffic maps found</p>
              ) : (
                <p>Showing {filteredImages.length} traffic maps</p>
              )}
            </div>

            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value)}
              className="w-full sm:w-auto"
            >
              <TabsList className="bg-slate-800/50 border border-slate-700/50 w-full sm:w-auto">
                <TabsTrigger
                  value="grid"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300"
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300"
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Empty State */}
          {filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-full p-6 mb-4">
                <Search className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                No traffic maps found
              </h3>
              <p className="text-slate-400 max-w-md mb-6">
                {searchQuery
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : selectedDate
                  ? "No traffic maps available for the selected date."
                  : "There are no traffic maps available in the system."}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDate(undefined);
                  setSearchQuery("");
                }}
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <Tabs
                value={viewMode}
                onValueChange={(value) => setViewMode(value)}
              >
                <TabsContent value="grid" className="mt-0">
                  <ImageGrid
                    images={filteredImages}
                    onImageClick={handleImageClick}
                    selectedImages={selectedImages}
                    comparisonMode={comparisonMode}
                  />
                </TabsContent>
                <TabsContent value="list" className="mt-0">
                  <ImageList
                    images={filteredImages}
                    onImageClick={handleImageClick}
                    selectedImages={selectedImages}
                    comparisonMode={comparisonMode}
                  />
                </TabsContent>
              </Tabs>
            </ScrollArea>
          )}
        </div>
      </main>

      {/* Gallery and Comparison Modals */}
      <ImageGallery
        images={filteredImages}
        initialIndex={galleryIndex ?? 0}
        isOpen={galleryIndex !== null && !comparisonMode}
        onClose={() => setGalleryIndex(null)}
      />
      <ComparisonView
        images={filteredImages}
        selectedImages={selectedImages}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />
      <Toaster />
    </div>
  );
}
