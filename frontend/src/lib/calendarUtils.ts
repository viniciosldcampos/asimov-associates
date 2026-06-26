import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export const DAY_LABELS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
export const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i); // 08h às 18h

export function getWeekDays(referenceDate: Date) {
  const start = startOfWeek(referenceDate, { weekStartsOn: 1 }); // semana começa na segunda
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function formatWeekRange(referenceDate: Date) {
  const days = getWeekDays(referenceDate);
  const first = days[0];
  const last = days[6];
  return `${format(first, "d")} – ${format(last, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}`;
}

export { isSameDay, format };
