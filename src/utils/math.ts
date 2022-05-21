export function clamp(num: number, min: number, max: number): number {
    if (num <= min) {
        return min;
    }
    return num >= max ? max : num;
}

export function roundToPrecision(value: number, precision = 0): number {
    if (!Number.isNaN(Number(value))) {
        return Math.round(value * (10 ** precision)) / (10 ** precision);
    }
    return 0;
}
