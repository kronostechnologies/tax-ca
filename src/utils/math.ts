export function roundToPrecision(value: number, precision: number = 0): number {
    return !isNaN(value)
        ? Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)
        : 0;
}
