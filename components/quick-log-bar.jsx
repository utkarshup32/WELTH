"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Check,
  X,
  Loader2,
  Calendar,
  Tag,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { parseQuickLog, confirmQuickLog } from "@/actions/quick-log";
import { useRouter } from "next/navigation";

export function QuickLogBar() {
  const [input, setInput] = useState("");
  const [parsing, setParsing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleParse = async (e) => {
    e.preventDefault();
    if (!input.trim() || parsing) return;

    setParsing(true);
    const res = await parseQuickLog(input.trim());
    setParsing(false);

    if (res.success) {
      setPreview(res.data);
      toast.success("Transaction extracted! Confirm details below.");
    } else {
      toast.error(
        res.error ||
          "Could not parse transaction details. Try mentioning amount and item.",
      );
    }
  };

  const handleConfirm = async () => {
    if (!preview || saving) return;

    setSaving(true);
    const res = await confirmQuickLog(preview);
    setSaving(false);

    if (res.success) {
      toast.success(
        `Logged ${preview.type === "EXPENSE" ? "-" : "+"}$${preview.amount} for "${preview.description}"`,
      );
      setPreview(null);
      setInput("");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to create transaction");
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Quick Input Form */}
      <form onSubmit={handleParse} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-blue-600 dark:text-blue-400">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={parsing || saving}
            placeholder="AI Quick-Log: 'Spent $35 on groceries with Personal card' or 'Earned $400 freelancing'..."
            className="w-full h-12 pl-11 pr-28 rounded-xl border border-blue-300/50 dark:border-blue-900/50 bg-gradient-to-r from-blue-50/40 via-purple-50/20 to-transparent dark:from-blue-950/20 dark:via-purple-950/10 dark:to-transparent text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || parsing || saving}
            className="absolute right-1.5 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 text-xs font-medium flex items-center gap-1.5"
          >
            {parsing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Parsing...</span>
              </>
            ) : (
              <>
                <span>Quick Log</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Confirmation Card Preview */}
      {preview && (
        <Card className="border-blue-200 dark:border-blue-900 bg-card shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
          <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    preview.type === "EXPENSE"
                      ? "bg-red-500/10 text-red-600 border-none font-bold"
                      : "bg-emerald-500/10 text-emerald-600 border-none font-bold"
                  }
                >
                  {preview.type === "EXPENSE"
                    ? `-$${preview.amount.toFixed(2)}`
                    : `+$${preview.amount.toFixed(2)}`}
                </Badge>
                <span className="font-semibold text-foreground text-sm">
                  {preview.description}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-blue-500" />
                  {preview.accountName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5 text-purple-500" />
                  {preview.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                  {new Date(preview.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreview(null)}
                disabled={saving}
                className="h-8 text-xs gap-1"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={saving}
                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                Confirm & Log
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
