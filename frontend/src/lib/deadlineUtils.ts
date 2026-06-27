import { differenceInCalendarDays, isSameDay } from "date-fns";

export type DeadlineFilter =
  | "TODOS"
  | "VENCIDOS"
  | "VENCE_HOJE"
  | "PROXIMOS_7"
  | "PROXIMOS_30";

export function getDaysRemaining(dateStr: string) {
  return differenceInCalendarDays(new Date(dateStr), new Date());
}

export function getDeadlineUrgencyLabel(dateStr: string) {
  const days = getDaysRemaining(dateStr);

  if (days < 0)
    return { text: `${Math.abs(days)} dias atrás`, color: "text-red-400" };
  if (days === 0) return { text: "Hoje", color: "text-red-400" };
  if (days === 1) return { text: "Amanhã", color: "text-amber-400" };
  return { text: `${days} dias`, color: "text-slate-300" };
}

export function matchesFilter(dateStr: string, filter: DeadlineFilter) {
  const days = getDaysRemaining(dateStr);

  switch (filter) {
    case "VENCIDOS":
      return days < 0;
    case "VENCE_HOJE":
      return days === 0;
    case "PROXIMOS_7":
      return days >= 0 && days <= 7;
    case "PROXIMOS_30":
      return days >= 0 && days <= 30;
    default:
      return true;
  }
}

export { isSameDay };
