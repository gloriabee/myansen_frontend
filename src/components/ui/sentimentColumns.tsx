import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { type SentimentColumn } from "@/types/sentimentColums";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "./badge";
import { useState } from "react";
import { FeedbackCell } from "@/components/FeedBackCell";

export const sentimentColumns: ColumnDef<SentimentColumn>[] = [
  {
    id: "text",
    accessorKey: "text",
    header: "Text",
    cell: ({ row }) => {
      const sentimentScore = row.getValue("confidence") as number;

      const isLowConfidence = sentimentScore <= 0.6;

      if (isLowConfidence) {
        return (
          <div className="flex flex-col items-start">
            <span className="text-black text-left text-wrap">
              {row.getValue("text")}
            </span>
            <Badge className="w-52 ml-2 px-2.5 py-1 mt-3 text-xs text-yellow-700 bg-yellow-100 border border-yellow-400 rounded-xl hover:bg-yellow-200 ">
              Low confidence - Please review
            </Badge>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-start">
            <span className="text-black text-left text-wrap">
              {row.getValue("text")}
            </span>
          </div>
        );
      }
    },
  },
  {
    id: "sentiment",
    accessorKey: "sentiment",
    header: "Sentiment",
    cell: ({ row }) => {
      const sentiment: string = (
        row.getValue("sentiment") as string
      ).toUpperCase();

      let positive = "text-green-500";
      let negative = "text-red-500";
      let neutral = "text-yellow-500";
      let sentimentClass = "";
      if (sentiment === "POSITIVE") {
        sentimentClass = positive;
      } else if (sentiment === "NEGATIVE") {
        sentimentClass = negative;
      } else if (sentiment === "NEUTRAL") {
        sentimentClass = neutral;
      }

      return <span className={sentimentClass}>{sentiment}</span>;
    },
  },
  {
    id: "confidence",
    accessorKey: "confidence",
    header: "Confidence",
    cell: ({ row }) => {
      const confidence: number = row.getValue("confidence") as number;
      const fixedscore = (confidence * 100).toFixed(2);
      return (
        <Badge variant={"secondary"} className="hover:cursor-default">
          {fixedscore}%
        </Badge>
      );
    },
  },
  {
    id: "feedback",
    header: "Feedback",
    cell: ({ row }) => {
      const defaultValue = row.getValue("sentiment") as string;
      const id = "1"; // assumes SentimentColumn has an `id` field
     
      
      return (
        <FeedbackCell
          id={id}
          defaultValue={defaultValue}
          onSubmit={(id, value) => {
            alert(`Feedback for row ${id}: ${value}`);
            // optional: call API here
          }}
        />
      );
    },
  },
];
