import { differenceInDays, subDays } from "date-fns";
import type { ProcessListItem } from "../services/processService";

export function getPreviousPeriod(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const periodLength = differenceInDays(end, start) + 1;

  const previousEnd = subDays(start, 1);
  const previousStart = subDays(previousEnd, periodLength - 1);

  return { previousStart, previousEnd };
}

function isWithinPeriod(dateStr: string, start: Date, end: Date) {
  const date = new Date(dateStr);
  return date >= start && date <= end;
}

export function calculateTrend(
  processes: ProcessListItem[],
  startDate: string,
  endDate: string,
  filterFn: (p: ProcessListItem) => boolean,
) {
  const currentStart = new Date(startDate);
  const currentEnd = new Date(endDate);
  const { previousStart, previousEnd } = getPreviousPeriod(startDate, endDate);

  const currentCount = processes.filter(
    (p) => filterFn(p) && isWithinPeriod(p.startDate, currentStart, currentEnd),
  ).length;

  const previousCount = processes.filter(
    (p) =>
      filterFn(p) && isWithinPeriod(p.startDate, previousStart, previousEnd),
  ).length;

  if (previousCount === 0) {
    return {
      value: currentCount > 0 ? "+100%" : "0%",
      isPositive: currentCount >= 0,
    };
  }

  const percentChange = Math.round(
    ((currentCount - previousCount) / previousCount) * 100,
  );
  const sign = percentChange >= 0 ? "+" : "";

  return { value: `${sign}${percentChange}%`, isPositive: percentChange >= 0 };
}
