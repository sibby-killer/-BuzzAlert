"use client";

import { useRef, useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export function SettingsForm({
  email,
  fullName,
  phone,
  redditUsername,
  location,
}: {
  email: string;
  fullName: string;
  phone: string;
  redditUsername: string;
  location: string;
}) {
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        setSaving(true);
        try {
          await updateProfile(formData);
          toast.success("Profile updated");
        } catch (e: any) {
          toast.error(e.message);
        } finally {
          setSaving(false);
        }
      }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" name="full_name" defaultValue={fullName} placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={phone} placeholder="+254..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={location} placeholder="Nairobi, Kenya" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reddit_username">Reddit Username (optional)</Label>
            <Input id="reddit_username" name="reddit_username" defaultValue={redditUsername} placeholder="u/yourusername" />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
