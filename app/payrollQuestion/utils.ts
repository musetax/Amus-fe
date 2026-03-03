import { SeasonalVariationOption } from "./types";

// Helper function to format time
export const formatTime = (date: Date | string | number): string => {
  const d = new Date(date);
  return d
    .toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\bam\b/i, "AM")
    .replace(/\bpm\b/i, "PM");
};


// Helper function to format currency
export const formatCurrency = (amount: any): string => {
  if (amount == null || amount === "") return "";

  const num = Number(amount);
  if (isNaN(num)) return "";

  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(1)}B`;
  } else if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1)}M`;
  }

  return `$${num.toLocaleString()}`;
};

// Seasonal variation options
export const seasonalVariationOptions: SeasonalVariationOption[] = [
  { id: 1, value: "none", label: "Consistent year-round", multiplier: 1.0 },
  { id: 2, value: "low", label: "Low seasonal variation (±10%)", multiplier: 0.9 },
  { id: 3, value: "moderate", label: "Moderate seasonal variation (±25%)", multiplier: 0.75 },
  { id: 4, value: "high", label: "High seasonal variation (±40%)", multiplier: 0.6 },
];

// Calculate annual income from hourly rate
export const calculateAnnualIncomeFromHourly = (
  hourlyRate: number,
  hoursPerWeek: number,
  variation: string
): number => {
  const variationFactor =
    seasonalVariationOptions.find((v) => v.value === variation)?.multiplier || 1.0;
  return hourlyRate * hoursPerWeek * 52 * variationFactor;
};
