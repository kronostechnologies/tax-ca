/*
Sources
    https://www.bankofcanada.ca/rates/price-indexes/cpi/
    Use column v41690973

NOT USED BY FNA-ENGINE

Revised
    2024-12-23
*/

interface MonthlyConsumerPriceIndex {
    JAN: number;
    FEB: number;
    MAR: number;
    APR: number;
    MAY: number;
    JUN: number;
    JUL: number;
    AUG: number;
    SEP: number;
    OCT: number;
    NOV: number;
    DEC: number;
}

export interface ConsumerPriceIndex {
    2009: MonthlyConsumerPriceIndex;
    2010: MonthlyConsumerPriceIndex;
    2011: MonthlyConsumerPriceIndex;
    2012: MonthlyConsumerPriceIndex;
    2013: MonthlyConsumerPriceIndex;
    2014: MonthlyConsumerPriceIndex;
    2015: MonthlyConsumerPriceIndex;
    2016: MonthlyConsumerPriceIndex;
    2017: MonthlyConsumerPriceIndex;
    2018: MonthlyConsumerPriceIndex;
    2019: MonthlyConsumerPriceIndex;
    2020: MonthlyConsumerPriceIndex;
    2021: MonthlyConsumerPriceIndex;
    2022: MonthlyConsumerPriceIndex;
    2023: MonthlyConsumerPriceIndex;
    2024: MonthlyConsumerPriceIndex;
}

export const CONSUMER_PRICE_INDEX: ConsumerPriceIndex = {
    2009: {
        JAN: 113.0,
        FEB: 113.8,
        MAR: 114.0,
        APR: 113.9,
        MAY: 114.7,
        JUN: 115.1,
        JUL: 114.7,
        AUG: 114.7,
        SEP: 114.7,
        OCT: 114.6,
        NOV: 115.2,
        DEC: 114.8,
    },
    2010: {
        JAN: 115.1,
        FEB: 115.6,
        MAR: 115.6,
        APR: 116.0,
        MAY: 116.3,
        JUN: 116.2,
        JUL: 116.8,
        AUG: 116.7,
        SEP: 116.9,
        OCT: 117.4,
        NOV: 117.5,
        DEC: 117.5,
    },
    2011: {
        JAN: 117.8,
        FEB: 118.1,
        MAR: 119.4,
        APR: 119.8,
        MAY: 120.6,
        JUN: 119.8,
        JUL: 120.0,
        AUG: 120.3,
        SEP: 120.6,
        OCT: 120.8,
        NOV: 120.9,
        DEC: 120.2,
    },
    2012: {
        JAN: 120.7,
        FEB: 121.2,
        MAR: 121.7,
        APR: 122.2,
        MAY: 122.1,
        JUN: 121.6,
        JUL: 121.5,
        AUG: 121.8,
        SEP: 122.0,
        OCT: 122.2,
        NOV: 121.9,
        DEC: 121.2,
    },
    2013: {
        JAN: 121.3,
        FEB: 122.7,
        MAR: 122.9,
        APR: 122.7,
        MAY: 123.0,
        JUN: 123.0,
        JUL: 123.1,
        AUG: 123.1,
        SEP: 123.3,
        OCT: 123.0,
        NOV: 123.0,
        DEC: 122.7,
    },
    2014: {
        JAN: 123.1,
        FEB: 124.1,
        MAR: 124.8,
        APR: 125.2,
        MAY: 125.8,
        JUN: 125.9,
        JUL: 125.7,
        AUG: 125.7,
        SEP: 125.8,
        OCT: 125.9,
        NOV: 125.4,
        DEC: 124.5,
    },
    2015: {
        JAN: 124.3,
        FEB: 125.4,
        MAR: 126.3,
        APR: 126.2,
        MAY: 126.9,
        JUN: 127.2,
        JUL: 127.3,
        AUG: 127.3,
        SEP: 127.1,
        OCT: 127.2,
        NOV: 127.1,
        DEC: 126.5,
    },
    2016: {
        JAN: 126.8,
        FEB: 127.1,
        MAR: 127.9,
        APR: 128.3,
        MAY: 128.8,
        JUN: 129.1,
        JUL: 128.9,
        AUG: 128.7,
        SEP: 128.8,
        OCT: 129.1,
        NOV: 128.6,
        DEC: 128.4,
    },
    2017: {
        JAN: 129.5,
        FEB: 129.7,
        MAR: 129.9,
        APR: 130.4,
        MAY: 130.5,
        JUN: 130.4,
        JUL: 130.4,
        AUG: 130.5,
        SEP: 130.8,
        OCT: 130.9,
        NOV: 131.3,
        DEC: 130.8,
    },
    2018: {
        JAN: 131.7,
        FEB: 132.5,
        MAR: 132.9,
        APR: 133.3,
        MAY: 133.4,
        JUN: 133.6,
        JUL: 134.3,
        AUG: 134.2,
        SEP: 134.3,
        OCT: 134.1,
        NOV: 133.5,
        DEC: 133.4,
    },
    2019: {
        JAN: 133.6,
        FEB: 134.5,
        MAR: 135.4,
        APR: 136.0,
        MAY: 136.6,
        JUN: 136.3,
        JUL: 137.0,
        AUG: 136.8,
        SEP: 136.2,
        OCT: 136.6,
        NOV: 136.4,
        DEC: 136.4,
    },
    2020: {
        JAN: 136.8,
        FEB: 137.4,
        MAR: 136.6,
        APR: 135.7,
        MAY: 136.1,
        JUN: 137.2,
        JUL: 137.2,
        AUG: 137.0,
        SEP: 136.9,
        OCT: 137.5,
        NOV: 137.7,
        DEC: 137.4,
    },
    2021: {
        JAN: 138.2,
        FEB: 138.9,
        MAR: 139.6,
        APR: 140.3,
        MAY: 141.0,
        JUN: 141.4,
        JUL: 142.3,
        AUG: 142.6,
        SEP: 142.9,
        OCT: 143.9,
        NOV: 144.2,
        DEC: 144.0,
    },
    2022: {
        JAN: 145.3,
        FEB: 146.8,
        MAR: 148.9,
        APR: 149.8,
        MAY: 151.9,
        JUN: 152.9,
        JUL: 153.1,
        AUG: 152.6,
        SEP: 152.7,
        OCT: 153.8,
        NOV: 154.0,
        DEC: 153.1,
    },
    2023: {
        JAN: 153.9,
        FEB: 154.5,
        MAR: 155.3,
        APR: 156.4,
        MAY: 157.0,
        JUN: 157.2,
        JUL: 158.1,
        AUG: 158.7,
        SEP: 158.5,
        OCT: 158.6,
        NOV: 158.8,
        DEC: 158.3,
    },
    2024: {
        JAN: 158.3,
        FEB: 158.8,
        MAR: 159.8,
        APR: 160.6,
        MAY: 161.5,
        JUN: 161.4,
        JUL: 162.1,
        AUG: 161.8,
        SEP: 161.1,
        OCT: 161.8,
        NOV: 161.8,
        // DEC is estimated using NOV
        DEC: 161.8,
    },
};
