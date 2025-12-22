/*
 Sources
 https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3710004501&cubeTimeFrame.startYear=2024+%2F+2025&cubeTimeFrame.endYear=2024+%2F+2025&referencePeriods=20240101%2C20240101

 Last updated
 2025-12-21
 */

import { ByProvince, ProvinceCode } from '../../misc';

export interface TuitionFees {
    TuitionFeesData: ByProvince<number>;
    getTuitionFeesByProvinceCode(provinceCode: ProvinceCode): number;
}

const TuitionFeesData: ByProvince<number> = {
    AB: 8067,
    BC: 6862,
    MB: 5993,
    NB: 9938,
    NL: 3746,
    NS: 9988,
    PE: 8191,
    ON: 8958,
    QC: 3963,
    SK: 9863,
    NT: 7734, // using geography = Canada
    NU: 7734, // using geography = Canada
    YT: 4470,
};

const getTuitionFeesByProvinceCode = (provinceCode: ProvinceCode): number => TuitionFeesData[provinceCode];

export const TuitionFees: TuitionFees = {
    getTuitionFeesByProvinceCode,
    TuitionFeesData,
};
