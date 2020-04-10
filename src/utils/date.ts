export function getMonthsDiff(firstDate: Date, secondDate: Date): number {
    const monthsDiff = secondDate.getUTCMonth() - firstDate.getUTCMonth();
    const yearsDiff = secondDate.getUTCFullYear() - firstDate.getUTCFullYear();

    return monthsDiff + (12 * yearsDiff) - (secondDate.getUTCDate() < firstDate.getUTCDate() ? 1 : 0);
}

export function addYearsToDate(date: Date, years: number): Date {
    const newDate = new Date(date);
    newDate.setFullYear(date.getFullYear() + years);
    return newDate;
}

export function now(): Date {
    return process.env.NODE_ENV === 'test' ? new Date('2020-01-01T12:00:00Z') : new Date();
}
