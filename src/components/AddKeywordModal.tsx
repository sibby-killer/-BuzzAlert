"use client";

import { useState, useRef } from "react";
import { addKeyword } from "@/app/actions/keywords";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function AddKeywordModal({ plan }: { plan: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const limits: Record<string, number> = { free: 3, starter: 25, pro: 100 };
  const limit = limits[plan] || 3;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Keyword
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          ref={formRef}
          action={async (formData) => {
            setError(null);
            try {
              await addKeyword(formData);
              setOpen(false);
              formRef.current?.reset();
              toast.success("Keyword added successfully");
            } catch (e: any) {
              setError(e.message);
              toast.error(e.message);
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Add Keyword</DialogTitle>
            <DialogDescription>
              You can add up to {limit} keywords on your {plan} plan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              name="keyword"
              placeholder="e.g., AI startup, SaaS growth"
              required
            />
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Keyword</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
