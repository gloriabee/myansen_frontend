import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { sentimentColumns } from "@/components/ui/sentimentColumns";
import { type SentimentColumn } from "@/types/sentimentColums";
import { icons } from "@/components/icons";
import WordCloudSVG from "@/components/WordCloudSVG";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  processUploadingDataSetToS3,
  noCase,
} from "@/utils/dashboardPageUtils";
import { ProgressGame } from "@/components/ui/progress";
import { handleExportCSV, handleExportExcel } from "@/utils/exportFile";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { User } from "@/types/User";
import { v4 as uuid } from "uuid";

export default function DashboardPage() {
  const location = useLocation();
  const [collectedFeedback, setCollectedFeedback] = useState(0);
  const [submitedRowId, setSubmitedRowId] = useState<string | null>(null);
  const targetFeedback = 100;

  const progress = Math.min(
    100,
    Math.round((collectedFeedback / targetFeedback) * 100)
  );

  // ✅ Use only the data passed via navigation state
  const apiResponse: any[] = useMemo(
    () => location.state?.apiResponse?.results || [],
    [location.state]
  );

  const [sentimentColumnsData, setSentimentColumnsData] = useState<
    SentimentColumn[]
  >([]);

  // ✅ Only local data shown (no history, no DB)
  const loadData = async () => {
    try {
      // 🧹 Always start clean
      localStorage.removeItem("guest_result");
      setSentimentColumnsData([]);

      let rawData: any[] = [];

      // ✅ Only use the latest results passed from previous page
      if (apiResponse && apiResponse.length > 0) {
        rawData = apiResponse;
      }

      const columnsData: SentimentColumn[] = rawData.map((item: any) => ({
        id: item.id?.toString() ?? uuid(),
        text: item.text,
        sentiment:
          item.predicted_label?.toLowerCase?.() ??
          item.sentiment?.toLowerCase?.() ??
          "neutral",
        confidence: item.confidence,
        feedback: {
          type:
            item.predicted_label?.toLowerCase?.() ??
            item.sentiment?.toLowerCase?.() ??
            "neutral",
        },
      }));

      setSentimentColumnsData(columnsData);
    } catch (err: any) {
      console.error("Failed to load sentiment data:", err);
      setSentimentColumnsData([]);
    }
  };

  // ✅ For user export permissions
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // clear previous session data every time dashboard opens
    localStorage.removeItem("guest_result");
    setSentimentColumnsData([]);

    loadData();

    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      setUser(null);
    }
  }, [apiResponse]);

  const positiveText = sentimentColumnsData
    .filter((item) => item.sentiment?.toLowerCase?.() === "positive")
    .map((item) => item.text)
    .join(" ");

  const negativeText = sentimentColumnsData
    .filter((item) => item.sentiment?.toLowerCase?.() === "negative")
    .map((item) => item.text)
    .join(" ");

  const neutralText = sentimentColumnsData
    .filter((item) => item.sentiment?.toLowerCase?.() === "neutral")
    .map((item) => item.text)
    .join(" ");

  const [selectedType, setSelectedType] = useState<
    "positive" | "negative" | "neutral"
  >("positive");

  const getWordFrequencies = (text: string) => {
    const words = text
      .toLowerCase()
      .replace(/[^\u1000-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 1);

    const freqMap: Record<string, number> = {};
    for (const word of words) {
      freqMap[word] = (freqMap[word] || 0) + 1;
    }

    return Object.entries(freqMap).map(([text, value]) => ({ text, value }));
  };

  const wordFreq =
    selectedType === "positive"
      ? getWordFrequencies(positiveText)
      : selectedType === "negative"
      ? getWordFrequencies(negativeText)
      : getWordFrequencies(neutralText);

  const handleSubmitFeedback = useCallback((id: string, value: string) => {
    setSubmitedRowId(id);
    setCollectedFeedback((prev) => prev + 1);
    setSentimentColumnsData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              feedback: { type: value as "positive" | "neutral" | "negative" },
            }
          : item
      )
    );
  }, []);

  const columns = useMemo(
    () => sentimentColumns(handleSubmitFeedback),
    [handleSubmitFeedback]
  );

  return (
    <>
      <div className="mx-3 py-5 flex justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">
          Sentiment Dashboard
        </h2>
        <div>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-teal-700 text-white hover:bg-teal-600">
                  <icons.export className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={5}
                className="w-48 rounded-xl shadow-lg border border-gray-200 bg-white"
              >
                <DropdownMenuItem
                  className="cursor-pointer flex items-center px-3 py-1 rounded-md hover:bg-teal-50 focus:bg-teal-100"
                  onClick={() => handleExportCSV(sentimentColumnsData)}
                >
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer flex items-center px-3 py-1 rounded-md hover:bg-teal-50 focus:bg-teal-100"
                  onClick={() => handleExportExcel(sentimentColumnsData)}
                >
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="outline"
            className="outline relative text-teal-600 hover:bg-teal-600 hover:text-white ml-4"
            onClick={() => processUploadingDataSetToS3(sentimentColumnsData)}
            disabled={collectedFeedback < targetFeedback}
          >
            <icons.loop className="mr-2" />
            Retrain Model
            {collectedFeedback >= targetFeedback && (
              <Badge className="h-3 min-w-3 rounded-full px-1 font-mono tabular-nums bg-red-600 border-red-600  animate-pulse pointer-events-none absolute right-0 top-0 -translate-x-1/2 -translate-y-1/2 "></Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Progress for feedback collection */}
      <div className="mx-3 mb-4 bg-[#e5fffc] items-center p-2 px-5 pt-3 rounded-xl">
        <div className="flex justify-between">
          <h4 className="mb-1">Feedback collected: {collectedFeedback}</h4>
          <small>Goal: {targetFeedback}</small>
        </div>
        <ProgressGame
          value={progress}
          className="mb-5 w-[100%]"
          showPercent={false}
          targetGoal={targetFeedback}
          customMaker={"🥳"}
        />
      </div>
      <DataTable
        columns={columns}
        data={sentimentColumnsData}
        noCase={noCase}
        itemsPerPage={3}
      />
      <div className="mx-3 py-5">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-teal-700 text-white hover:bg-teal-600">
              View Wordclouds
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-2xl">
            <DialogHeader>
              <DialogTitle>Wordcloud Viewer</DialogTitle>
              <div className="pt-4">
                <div className="mb-4 flex items-center gap-2">
                  <label className="font-medium" htmlFor="type">
                    Select Sentiment:
                  </label>
                  <select
                    id="type"
                    value={selectedType}
                    onChange={(e) =>
                      setSelectedType(
                        e.target.value as "positive" | "negative" | "neutral"
                      )
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>

      <DataTable
        columns={columns}
        data={sentimentColumnsData}
        noCase={noCase}
        itemsPerPage={3}
      />

      <div className="mx-3 py-5">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-teal-700 text-white hover:bg-teal-600">
              View Wordclouds
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-2xl">
            <DialogHeader>
              <DialogTitle>Wordcloud Viewer</DialogTitle>
              <div className="pt-4">
                <div className="mb-4 flex items-center gap-2">
                  <label className="font-medium" htmlFor="type">
                    Select Sentiment:
                  </label>
                  <select
                    id="type"
                    value={selectedType}
                    onChange={(e) =>
                      setSelectedType(
                        e.target.value as "positive" | "negative" | "neutral"
                      )
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>

                {wordFreq.length > 0 ? (
                  <div className="w-full h-[60vh] flex items-center justify-center bg-gray-50 rounded-lg shadow-inner">
                    <WordCloudSVG words={wordFreq} />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No data to display for this sentiment.
                  </p>
                )}
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
