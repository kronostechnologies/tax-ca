/*
 Sources
 https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3710004501&cubeTimeFrame.startYear=2024+%2F+2025&cubeTimeFrame.endYear=2024+%2F+2025&referencePeriods=20240101%2C20240101

 Revised data
 2024-09-04

 Last updated
 2025-02-07
 */

import { ByProvince, ProvinceCode } from '../../misc';

export interface TuitionFees {
    TuitionFeesData: ByProvince<number>;
    getTuitionFeesByProvinceCode(provinceCode: ProvinceCode): number;
}

const TuitionFeesData: ByProvince<number> = {
    AB: 7734,
    BC: 6607,
    MB: 5534,
    NB: 9470,
    NL: 3727,
    NS: 9762,
    PE: 7728,
    ON: 8514,
    QC: 3594,
    SK: 9609,
    NT: 6000, // valeur hypothétique
    NU: 6500, // valeur hypothétique
    YT: 4350,
};

const getTuitionFeesByProvinceCode = (provinceCode: ProvinceCode): number => {
    return TuitionFees[provinceCode];
};

export const TuitionFees: TuitionFees = {
    getTuitionFeesByProvinceCode,
    TuitionFeesData,
}
