"use client";

import { useState, useMemo } from "react";
import { RequestCardClient } from "./request-card-client";
import { Button } from "@/components/ui/button";

interface FilteredRequestsProps {
  items: any[];
}

export function FilteredRequests({ items }: FilteredRequestsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filterMode, setFilterMode] = useState<"from" | "to">("from");
  const [hostelType, setHostelType] = useState<"BH" | "GH" | null>(null);
  const [hostelNumber, setHostelNumber] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState("All Floors");
  const [selectedRoomType, setSelectedRoomType] = useState<string>("All");
  const [selectedSeater, setSelectedSeater] = useState<string>("All");

  const selectedHostel = useMemo(() => {
    if (!hostelType || !hostelNumber) return "All Hostels";
    return `${hostelType}-${hostelNumber}`;
  }, [hostelType, hostelNumber]);

  const filteredItems = useMemo(() => {
    return items.filter((item: any) => {
      // Determine which hostel and floor to check based on filter mode
      const hostelToCheck =
        filterMode === "from" ? item.currentHostel : item.desiredHostel;
      const floorToCheck =
        filterMode === "from" ? item.currentFloor : item.desiredFloor;

      // Filter by hostel - case-insensitive and trim whitespace
      if (selectedHostel !== "All Hostels") {
        const normalizedSelectedHostel = selectedHostel.toLowerCase().trim();
        const normalizedItemHostel = (hostelToCheck || "").toLowerCase().trim();

        if (normalizedItemHostel !== normalizedSelectedHostel) {
          return false;
        }
      }

      // Filter by floor - convert to string and compare
      if (selectedFloor !== "All Floors") {
        const normalizedItemFloor = String(floorToCheck || "").trim();
        const normalizedSelectedFloor = selectedFloor.trim();

        if (normalizedItemFloor !== normalizedSelectedFloor) {
          return false;
        }
      }

      // Filter by room type (AC/Non-AC)
      if (selectedRoomType !== "All" && item.roomType !== selectedRoomType) {
        return false;
      }

      // Filter by seater
      if (
        selectedSeater !== "All" &&
        item.seater !== parseInt(selectedSeater)
      ) {
        return false;
      }

      return true;
    });
  }, [
    items,
    selectedHostel,
    selectedFloor,
    selectedRoomType,
    selectedSeater,
    filterMode,
  ]);

  const handleReset = () => {
    setHostelType(null);
    setHostelNumber(null);
    setSelectedFloor("All Floors");
    setSelectedRoomType("All");
    setSelectedSeater("All");
  };

  const handleHostelTypeClick = (type: "BH" | "GH") => {
    if (hostelType === type) {
      setHostelType(null);
      setHostelNumber(null);
    } else {
      setHostelType(type);
      setHostelNumber(null);
    }
  };

  const handleHostelNumberClick = (num: string) => {
    if (hostelNumber === num) {
      setHostelNumber(null);
    } else {
      setHostelNumber(num);
    }
  };

  if (!items.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No requests from other students yet</p>
        <p className="text-sm mt-2">Check back later for swap opportunities</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="h-9 gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Filters</span>
          {(hostelType || selectedFloor !== "All Floors") && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {(hostelType ? 1 : 0) + (selectedFloor !== "All Floors" ? 1 : 0)}
            </span>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Button>

        {(hostelType || selectedFloor !== "All Floors") && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="h-9 px-3 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Controls - Collapsible */}
      {showFilters && (
        <div className="flex flex-col gap-3 p-3 bg-secondary/50 rounded-lg border border-border animate-in slide-in-from-top-2 duration-200">
          {/* From/To Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Filter by
            </label>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant={filterMode === "from" ? "default" : "outline"}
                onClick={() => setFilterMode("from")}
                className="flex-1 h-8 text-xs"
              >
                From (Current)
              </Button>
              <Button
                size="sm"
                variant={filterMode === "to" ? "default" : "outline"}
                onClick={() => setFilterMode("to")}
                className="flex-1 h-8 text-xs"
              >
                To (Desired)
              </Button>
            </div>
          </div>

          {/* Hostel Selection - All in one row */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Hostel
            </label>
            <div className="flex flex-wrap gap-1.5">
              <Button
                size="sm"
                variant={hostelType === "BH" ? "default" : "outline"}
                onClick={() => handleHostelTypeClick("BH")}
                className="h-8 px-3 text-xs"
              >
                BH
              </Button>
              <Button
                size="sm"
                variant={hostelType === "GH" ? "default" : "outline"}
                onClick={() => handleHostelTypeClick("GH")}
                className="h-8 px-3 text-xs"
              >
                GH
              </Button>
              {hostelType && (
                <>
                  <div className="w-px bg-border self-stretch mx-1" />
                  {[...Array(10)].map((_, i) => {
                    const num = (i + 1).toString();
                    return (
                      <Button
                        key={num}
                        size="sm"
                        variant={hostelNumber === num ? "default" : "outline"}
                        onClick={() => handleHostelNumberClick(num)}
                        className="h-8 w-8 p-0 text-xs"
                      >
                        {num}
                      </Button>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Floor Selection - Compact row */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Floor
            </label>
            <div className="flex flex-wrap gap-1.5">
              <Button
                size="sm"
                variant={selectedFloor === "All Floors" ? "default" : "outline"}
                onClick={() => setSelectedFloor("All Floors")}
                className="h-8 px-3 text-xs"
              >
                All
              </Button>
              {[...Array(10)].map((_, i) => {
                const floor = (i + 1).toString();
                return (
                  <Button
                    key={floor}
                    size="sm"
                    variant={selectedFloor === floor ? "default" : "outline"}
                    onClick={() => setSelectedFloor(floor)}
                    className="h-8 w-8 p-0 text-xs"
                  >
                    {floor}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Room Type Selection (AC/Non-AC) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Room Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              <Button
                size="sm"
                variant={selectedRoomType === "All" ? "default" : "outline"}
                onClick={() => setSelectedRoomType("All")}
                className="h-8 px-3 text-xs"
              >
                All
              </Button>
              <Button
                size="sm"
                variant={selectedRoomType === "AC" ? "default" : "outline"}
                onClick={() => setSelectedRoomType("AC")}
                className="h-8 px-3 text-xs"
              >
                AC
              </Button>
              <Button
                size="sm"
                variant={selectedRoomType === "Non-AC" ? "default" : "outline"}
                onClick={() => setSelectedRoomType("Non-AC")}
                className="h-8 px-3 text-xs"
              >
                Non-AC
              </Button>
            </div>
          </div>

          {/* Seater Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Seater
            </label>
            <div className="flex flex-wrap gap-1.5">
              <Button
                size="sm"
                variant={selectedSeater === "All" ? "default" : "outline"}
                onClick={() => setSelectedSeater("All")}
                className="h-8 px-3 text-xs"
              >
                All
              </Button>
              {[1, 2, 3, 4, 5].map((num) => (
                <Button
                  key={num}
                  size="sm"
                  variant={
                    selectedSeater === num.toString() ? "default" : "outline"
                  }
                  onClick={() => setSelectedSeater(num.toString())}
                  className="h-8 w-8 p-0 text-xs"
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {(hostelType ||
            selectedFloor !== "All Floors" ||
            selectedRoomType !== "All" ||
            selectedSeater !== "All") && (
            <div className="flex flex-wrap gap-1.5 items-center pt-1 border-t border-border">
              <span className="text-xs text-muted-foreground">Active:</span>
              {selectedHostel !== "All Hostels" && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {selectedHostel}
                </span>
              )}
              {selectedFloor !== "All Floors" && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  Floor {selectedFloor}
                </span>
              )}
              {selectedRoomType !== "All" && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {selectedRoomType}
                </span>
              )}
              {selectedSeater !== "All" && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {selectedSeater} Seater
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredItems.length} of {items.length} requests
      </div>

      {/* Filtered Results */}
      {filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map((item: any) => (
            <RequestCardClient key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          <p>No requests match your filters</p>
          <p className="text-sm mt-2">Try adjusting your filter criteria</p>
        </div>
      )}
    </div>
  );
}
