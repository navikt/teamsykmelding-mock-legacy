import { parseISO } from 'date-fns';

export function toDate(date: string | Date): Date {
    return typeof date === 'string' ? parseISO(date) : date;
}
