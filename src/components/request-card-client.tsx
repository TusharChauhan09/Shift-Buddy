"use client";
import { useState } from "react";
import { RequestDetailsModal } from "@/components/request-details-modal";

interface RequestCardClientProps {
  item: {
    id: string;
    currentHostel: string;
    desiredHostel: string;
    currentBlock?: string | null;
    desiredBlock?: string | null;
    currentFloor?: string | null;
    desiredFloor?: string | null;
    currentRoom?: string | null;
    desiredRoom?: string | null;
    roomType?: string;
    seater?: number;
    message?: string | null;
    status: string;
    createdAt: string;
    userId: string;
    user: {
      id: string;
      name?: string | null;
      registrationNumber?: string | null;
    };
  };
}

export function RequestCardClient({ item }: RequestCardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="border border-border rounded-lg p-4 bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="font-medium">
              {item.currentHostel} ➜ {item.desiredHostel}
            </div>
            <div className="text-sm text-muted-foreground">
              {item.currentBlock && `${item.currentBlock}`}
              {item.currentFloor && ` ${item.currentFloor}`}
              {item.currentRoom && ` Room ${item.currentRoom}`}
              {(item.currentBlock || item.currentFloor || item.currentRoom) &&
              (item.desiredBlock || item.desiredFloor || item.desiredRoom)
                ? " ➜ "
                : ""}
              {item.desiredBlock && `${item.desiredBlock}`}
              {item.desiredFloor && ` ${item.desiredFloor}`}
              {item.desiredRoom && ` Room ${item.desiredRoom}`}
            </div>
            {(item.roomType || item.seater) && (
              <div className="mt-1 flex gap-2">
                {item.roomType && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {item.roomType}
                  </span>
                )}
                {item.seater && (
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                    {item.seater} Seater
                  </span>
                )}
              </div>
            )}
            {item.message && (
              <p className="mt-2 text-sm line-clamp-2">{item.message}</p>
            )}
            <div className="mt-2 text-xs text-muted-foreground">
              Posted by{" "}
              {item.user?.name || item.user?.registrationNumber || "Student"}
            </div>
          </div>
          <div>
            <span className="text-xs uppercase bg-secondary px-2 py-1 rounded">
              {item.status}
            </span>
          </div>
        </div>
        <div className="mt-3 text-xs text-primary flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Click to view details
        </div>
      </div>

      <RequestDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={item}
      />
    </>
  );
}
