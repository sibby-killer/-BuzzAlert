"use client";

import { useTransition } from "react";
import { AddKeywordModal } from "@/components/AddKeywordModal";
import { deleteKeyword } from "@/app/actions/keywords";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Keyword {
  id: string;
  keyword: string;
  created_at: string;
}

function KeywordRow({ keyword }: { keyword: Keyword }) {
  const [pending, startTransition] = useTransition();

  return (
    <TableRow>
      <TableCell className="font-medium">{keyword.keyword}</TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(keyword.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await deleteKeyword(keyword.id);
              if (result?.error) {
                toast.error(result.error);
              } else {
                toast.success("Keyword deleted");
              }
            });
          }}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function KeywordsTable({
  keywords,
  plan,
}: {
  keywords: Keyword[];
  plan: string;
  count: number;
  limit: number;
}) {
  if (keywords.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <AddKeywordModal plan={plan} />
        </div>
        <div className="text-center py-12 text-muted-foreground">
          No keywords yet. Add your first keyword to start monitoring.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddKeywordModal plan={plan} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Keyword</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywords.map((kw) => (
            <KeywordRow key={kw.id} keyword={kw} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
