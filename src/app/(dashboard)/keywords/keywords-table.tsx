"use client";

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

export function KeywordsTable({
  keywords,
  plan,
  count,
  limit,
}: {
  keywords: Keyword[];
  plan: string;
  count: number;
  limit: number;
}) {
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
          {keywords.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No keywords yet. Add your first keyword to start monitoring.
              </TableCell>
            </TableRow>
          ) : (
            keywords.map((kw) => (
              <TableRow key={kw.id}>
                <TableCell className="font-medium">{kw.keyword}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(kw.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <form
                    action={async () => {
                      try {
                        await deleteKeyword(kw.id);
                        toast.success("Keyword deleted");
                      } catch (e: any) {
                        toast.error(e.message);
                      }
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      type="submit"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
