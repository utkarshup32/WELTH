"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Upload,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  uploadDocument,
  getUserDocuments,
  deleteDocument,
  searchDocumentsAction,
} from "@/actions/documents";

const CATEGORIES = [
  { value: "BANK_STATEMENT", label: "Bank Statement" },
  { value: "TAX_DOCUMENT", label: "Tax Document" },
  { value: "RECEIPT_INVOICE", label: "Receipt / Invoice" },
  { value: "INVESTMENT_POLICY", label: "Investment / Policy" },
  { value: "GENERAL", label: "General Document" },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("BANK_STATEMENT");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const fileInputRef = useRef(null);

  const fetchDocs = async () => {
    setLoadingDocs(true);
    const res = await getUserDocuments();
    if (res.success) {
      setDocuments(res.data);
    }
    setLoadingDocs(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", selectedCategory);

    toast.info(`Indexing "${file.name}" with Gemini vector embeddings...`);

    const res = await uploadDocument(formData);
    setUploading(false);

    if (res.success) {
      toast.success(
        `Successfully vectorized "${file.name}" (${res.data.chunkCount} chunks indexed)`,
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchDocs();
    } else {
      toast.error(res.error || "Failed to process document");
    }
  };

  const handleDelete = async (docId, filename) => {
    if (!confirm(`Delete "${filename}" and its vector embeddings?`)) return;

    const res = await deleteDocument(docId);
    if (res.success) {
      toast.success(`Deleted ${filename}`);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      if (searchResults) setSearchResults(null);
    } else {
      toast.error(res.error || "Failed to delete document");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    const res = await searchDocumentsAction(searchQuery);
    setSearching(false);

    if (res.success) {
      setSearchResults(res.data);
      if (res.data.length === 0) {
        toast.info("No matching document passages found");
      }
    } else {
      toast.error("Search failed");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Document Vault & AI Insights
            </h1>
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-600 border-none"
            >
              AI Powered
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Upload bank statements, tax forms, and receipts to connect them to
            WELTH AI for instant answers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Card */}
        <Card className="lg:col-span-1 shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5 text-blue-600" />
              Upload & Vectorize
            </CardTitle>
            <CardDescription>
              Supported: PDF, Text, CSV, Images (Max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 block">
                Document Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.txt,.csv,image/*"
              onChange={handleFileUpload}
            />

            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                uploading
                  ? "bg-muted/50 border-muted cursor-not-allowed"
                  : "border-blue-400/40 hover:bg-blue-50/50 dark:hover:bg-slate-800/40"
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-4">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  <p className="text-sm font-medium text-foreground">
                    Vectorizing document...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Extracting text & generating embeddings
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 py-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    Click to upload document
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDFs will be parsed with Gemini OCR
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Semantic Search Card */}
        <Card className="lg:col-span-2 shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Document Search & AI Insights
            </CardTitle>
            <CardDescription>
              Search across all your indexed documents for instant answers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., 'What was my annual interest charge?' or 'Shell gasoline charges'"
                  className="w-full bg-background border border-input rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <Button
                type="submit"
                disabled={searching || !searchQuery.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </form>

            {/* Results Display */}
            {searchResults && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Found {searchResults.length} matching passages</span>
                  <button
                    onClick={() => setSearchResults(null)}
                    className="hover:underline text-purple-600"
                  >
                    Clear results
                  </button>
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {searchResults.map((result, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground flex items-center gap-1.5">
                          <FileCheck className="h-3.5 w-3.5 text-blue-500" />
                          {result.filename}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-purple-500/10 text-purple-600"
                        >
                          {Math.round(result.similarity * 100)}% match
                        </Badge>
                      </div>
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {result.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Uploaded Documents List */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-emerald-600" />
              Indexed Documents ({documents.length})
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDocs}
              disabled={loadingDocs}
            >
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>
            Documents stored in your vault and indexed into Supabase
            `document_chunks`
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingDocs ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading document vault...
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12 border rounded-xl border-dashed">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="font-medium text-sm text-foreground">
                No documents uploaded yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload your first bank statement or receipt above to activate AI
                document insights!
              </p>
            </div>
          ) : (
            <div className="divide-y border rounded-lg">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-foreground">
                        {doc.filename}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-[10px] py-0">
                          {doc.category.replace(/_/g, " ")}
                        </Badge>
                        <span>•</span>
                        <span>{doc.chunkCount} vector chunks</span>
                        <span>•</span>
                        <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span>
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Badge
                      className={`text-xs ${
                        doc.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600"
                      } border-none`}
                    >
                      {doc.status === "COMPLETED" ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Indexed & Ready
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 animate-spin" /> Indexing
                        </span>
                      )}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc.id, doc.filename)}
                      className="text-muted-foreground hover:text-red-600 h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
