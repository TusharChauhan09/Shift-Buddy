"use client";
import { useState } from "react";
import { EditRequestModal } from "@/components/edit-request-modal";

interface MyRequestCardProps {
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
    message?: string | null;
    status: string;
    createdAt: string;
  };
}

export function MyRequestCard({ item }: MyRequestCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="font-medium">
              {item.currentHostel} ➜ {item.desiredHostel}
            </div>
            <div className="text-sm text-muted-foreground">
              {item.currentBlock && `${item.currentBlock}`}
              {item.currentFloor && `, ${item.currentFloor}`}
              {item.currentRoom && `, Room ${item.currentRoom}`}
              {(item.currentBlock || item.currentFloor || item.currentRoom) &&
              (item.desiredBlock || item.desiredFloor || item.desiredRoom)
                ? " ➜ "
                : ""}
              {item.desiredBlock && `${item.desiredBlock}`}
              {item.desiredFloor && `, ${item.desiredFloor}`}
              {item.desiredRoom && `, Room ${item.desiredRoom}`}
            </div>
            {item.message && (
              <p className="mt-2 text-sm line-clamp-2">{item.message}</p>
            )}
            <div className="mt-2 text-xs text-muted-foreground">
              Posted on {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs uppercase bg-secondary px-2 py-1 rounded">
              {item.status}
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>

      <EditRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={item}
      />
    </>
  );
}
