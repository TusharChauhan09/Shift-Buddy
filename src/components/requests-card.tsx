"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RequestModal } from "@/components/request-modal";

interface RequestsCardProps {
  needsProfileCompletion: boolean;
}

export function RequestsCard({ needsProfileCompletion }: RequestsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Hostel Requests</CardTitle>
          <CardDescription>
            Post or view requests in the section below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            disabled={needsProfileCompletion}
            onClick={() => {
              if (!needsProfileCompletion) {
                setIsModalOpen(true);
              }
            }}
          >
            {needsProfileCompletion
              ? "Add Registration Number to Post"
              : "Post New Request"}
          </Button>
        </CardContent>
      </Card>

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        needsProfileCompletion={needsProfileCompletion}
      />
    </>
  );
}
