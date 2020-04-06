export function monthsDelta(firstDate: Date, secondDate: Date): number {
    const monthsDiff = secondDate.getMonth() - firstDate.getMonth();
    const yearsDiff = secondDate.getFullYear() - firstDate.getFullYear();

    return monthsDiff + (12 * yearsDiff) - (secondDate.getDate() < firstDate.getDate() ? 1 : 0);
}
