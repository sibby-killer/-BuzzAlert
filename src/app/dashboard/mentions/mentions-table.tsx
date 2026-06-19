"use client";

import { useTransition } from "react";
import { markAsRead } from "@/app/actions/mentions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink } from "lucide-react";

interface Mention {
  id: string;
  title: string;
  subreddit: string;
  url: string;
  is_read: boolean;
  created_at: string;
}

function MentionRow({ mention }: { mention: Mention }) {
  const [pending, startTransition] = useTransition();

  function handleOpen() {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("mentionId", mention.id);
      await markAsRead(formData);
    });
    window.open(mention.url, "_blank", "noopener,noreferrer");
  }

  return (
    <TableRow className={!mention.is_read ? "font-medium" : ""}>
      <TableCell className="max-w-md truncate">
        {!mention.is_read && (
          <Badge variant="secondary" className="mr-2 text-xs">
            New
          </Badge>
        )}
        {mention.title}
      </TableCell>
      <TableCell>r/{mention.subreddit}</TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(mention.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleOpen}
          disabled={pending}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function MentionsTable({ mentions }: { mentions: Mention[] }) {
  if (mentions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No mentions yet. Add keywords to start monitoring.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Subreddit</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-[100px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mentions.map((mention) => (
          <MentionRow key={mention.id} mention={mention} />
        ))}
      </TableBody>
    </Table>
  );
}
