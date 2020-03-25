export function clamp(num: number, min: number, max: number): number {
    return num <= min ? min : num >= max ? max : num;
}

export function roundToPrecision(value: number, precision: number = 0): number {
    return !isNaN(value)
        ? Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)
        : 0;
}
