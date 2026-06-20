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
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const limits: Record<string, number> = { free: 3, starter: 25, pro: 100 };
  const limit = limits[plan] || 3;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size="sm" type="button">
          <Plus className="h-4 w-4 mr-1" />
          Add Keyword
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          ref={formRef}
          action={async (formData) => {
            setSaving(true);
            const result = await addKeyword(formData);
            setSaving(false);

            if (result?.error) {
              toast.error(result.error);
              return;
            }

            setOpen(false);
            formRef.current?.reset();
            toast.success("Keyword added successfully");
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
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Adding..." : "Add Keyword"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
