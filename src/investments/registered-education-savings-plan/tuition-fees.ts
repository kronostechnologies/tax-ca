import { ByProvince, ProvinceCode } from '../../misc';

const TuitionFees: ByProvince<number> = {
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

export const getTuitionFeesByProvinceCode = (provinceCode: ProvinceCode): number => {
    return TuitionFees[provinceCode];
};
