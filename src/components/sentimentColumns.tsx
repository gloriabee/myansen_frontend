import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { type SentimentColumn } from "@/types/sentimentColums";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "./ui/badge";
import { useState } from "react";


export const sentimentColumns: ColumnDef<SentimentColumn>[] = [
 {
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
  }
},
  {
    accessorKey: "sentiment",
    header: "Sentiment",
      cell: ({ row }) => {
          const sentiment: string = row.getValue("sentiment") as string;

          let positive = "text-green-500";
          let negative = "text-red-500";
          let neutral = "text-yellow-500";
          let sentimentClass = "";
            if (sentiment === "positive") {
                sentimentClass = positive;
            } else if (sentiment === "negative") {
                sentimentClass = negative;
            } else if (sentiment === "neutral") {
                sentimentClass = neutral;
            }

      return <span className={sentimentClass}>{sentiment}</span>;
    },
  },
  {
    accessorKey: "confidence",
    header: "Confidence",
    cell: ({ row }) => {
        const confidence: number = row.getValue("confidence") as number;
        return <Badge variant={"secondary"} className="hover:cursor-default">{confidence * 100}%</Badge>;
    },
  },
  {
    id: "feedback",
    header: "Feedback",
    cell: ({ row }) => {
        const defaultValue = row.getValue("sentiment") as string;
        const [selectedValue, setSelectedValue] = useState(defaultValue);

        return (
          <div className="inline-block ">
            <RadioGroup
              defaultValue={defaultValue}
              className="flex flex-row mb-3 "
              onValueChange={setSelectedValue}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="positive" id="r1" />
                <Label htmlFor="r1">Positive</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="neutral" id="r2" />
                <Label htmlFor="r2">Neutral</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="negative" id="r3" />
                <Label htmlFor="r3">Negative</Label>
              </div>
            </RadioGroup>

            <Button
              variant="default"
              disabled={selectedValue === defaultValue}
              onClick={() => alert("Feedback submitted!")}
              className=" bg-teal-600 mt-3 px-3 text-sm font-medium shadow-sm text-white hover:bg-teal-700 cursor-pointer  hover:shadow-lg transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Feedback
            </Button>
          </div>
        );
    },
  },
];
