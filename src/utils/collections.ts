export function maxBy<T>(
    values: T[],
    mapFn: ((item: T) => number),
): T | undefined {
    const max = Math.max(...values.map(mapFn));

    return values.find(item => mapFn(item) === max);
}
