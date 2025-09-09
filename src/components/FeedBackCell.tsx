import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FeedbackCellProps {
  id: string;
  defaultValue: string;
  onSubmit: (id: string, value: string) => void;
  isLowConfidence?: boolean;
}

export function FeedbackCell({
  id,
  defaultValue,
  onSubmit,
  isLowConfidence,
}: FeedbackCellProps) {
  const normalizedDefault = defaultValue.toLowerCase();
  const [selectedValue, setSelectedValue] = useState(normalizedDefault);


  useEffect(() => {
    setSelectedValue(normalizedDefault);
  }, [normalizedDefault]);

  return (
    <div className="inline-block">
      <RadioGroup
        value={selectedValue}
        onValueChange={setSelectedValue}
        className="flex flex-row mb-3"
      >
        {["positive", "neutral", "negative"].map((val) => (
          <div key={val} className="flex items-center gap-3">
            <RadioGroupItem value={val} id={`${val}-${id}`} />
            <Label htmlFor={`${val}-${id}`}>
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Button
        variant="default"
        disabled={!isLowConfidence}
        onClick={() => onSubmit(id, selectedValue)}
        className="bg-teal-600 mt-3 px-3 text-sm font-medium shadow-sm text-white hover:bg-teal-700 cursor-pointer hover:shadow-lg transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Feedback
      </Button>
    </div>
  );
}
