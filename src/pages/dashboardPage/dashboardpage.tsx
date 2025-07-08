import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { sentimentColumns } from "@/components/ui/sentimentColumns";
import { type SentimentColumn } from "@/types/sentimentColums";
import { icons } from "@/components/icons";
import WordCloudSVG from "@/components/WordCloudSVG";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DashboardPage() {
  const location = useLocation();

  const apiResponse: any[] = useMemo(
    () => location.state?.apiResponse?.results || [],
    [location.state]
  );

  const [sentimentColumnsData, setSentimentColumnsData] = useState<
    SentimentColumn[]
  >([]);
  const [selectedType, setSelectedType] = useState<"positive" | "negative">(
    "positive"
  );

  async function fetchSentimentResultsForUser() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.log("No token: guest mode, skip DB fetch.");
      return null;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/userinput", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        console.warn("Token expired. User will be logged out.");
        return null;
      }

      return res.json();
    } catch (err) {
      console.error("Error fetching user data:", err);
      return null;
    }
  }

  const loadData = async () => {
    try {
      let rawData: any[] = [];

      if (apiResponse && apiResponse.length > 0) {
        console.log("Using passed API response (guest or user session)");
        rawData = apiResponse;
      } else {
        const responseData = await fetchSentimentResultsForUser();
        if (responseData?.results?.length > 0) {
          rawData = responseData.results;
        } else {
          const guestResult = localStorage.getItem("guest_result");
          if (guestResult) {
            const parsed = JSON.parse(guestResult);
            rawData = parsed.results || [];
          } else {
            console.log("No data found.");
          }
        }
      }

      const columnsData: SentimentColumn[] = rawData.map((item: any) => ({
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

  useEffect(() => {
    loadData();
  }, [apiResponse]);

  useEffect(() => {
    console.log("Sentiment data loaded:", sentimentColumnsData);
  }, [sentimentColumnsData]);

  const positiveText = sentimentColumnsData
    .filter((item) => item.sentiment?.toLowerCase?.() === "positive")
    .map((item) => item.text)
    .join(" ");

  const negativeText = sentimentColumnsData
    .filter((item) => item.sentiment?.toLowerCase?.() === "negative")
    .map((item) => item.text)
    .join(" ");

  const getWordFrequencies = (text: string) => {
    const words = text
      .toLowerCase()
      .replace(/[^\u1000-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF\s]/g, "") // ✅ keep Myanmar chars only
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
      : getWordFrequencies(negativeText);

  console.log("Word Frequencies for", selectedType, wordFreq);
  const noCase =
    "<b>No results yet!</b><br> Upload a file or paste text in the 'File Upload' tab to see sentiment analysis results here</br > ";

  return (
    <>
      <div className="mx-3 py-5 flex justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">
          Sentiment Dashboard
        </h2>
        <div>
          <Button className="bg-teal-700 text-white hover:bg-teal-600">
            <icons.export className="mr-2" />
            Export Data
          </Button>
          <Button
            variant="outline"
            className="ml-4 text-teal-600 hover:bg-teal-600 hover:text-white"
          >
            <icons.loop className="mr-2" />
            Retrain Model
          </Button>
        </div>
      </div>

      <DataTable
        columns={sentimentColumns}
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
          <DialogContent className="max-w-4xl">
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
                      setSelectedType(e.target.value as "positive" | "negative")
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>

                {wordFreq.length > 0 ? (
                  <div className="h-[400px]">
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
