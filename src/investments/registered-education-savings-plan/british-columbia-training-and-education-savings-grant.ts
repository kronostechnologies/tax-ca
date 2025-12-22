/*
 Sources
 https://www.canada.ca/en/employment-social-development/services/student-financial-aid/education-savings/resp/resp-promoters/infocapsules/bc.html

 Last updated
 2025-12-21
 */

export interface BritishColumbiaTrainingAndEducationSavingsGrant {
    BENEFICIARY_AGE_ALLOCATION: number,
    MAX_GRANT: number,
    getTotalForAYear: (beneficiaryAge: number) => number,
}

export interface BritishColumbiaTrainingAndEducationSavingsGrantData {
    BENEFICIARY_AGE_ALLOCATION: number;
    MAX_GRANT: number;
}

const BritishColumbiaTrainingAndEducationSavingsGrantData: BritishColumbiaTrainingAndEducationSavingsGrantData = {
    BENEFICIARY_AGE_ALLOCATION: 6,
    MAX_GRANT: 1200,
};

// Pour simplifier, on assume que si l'enfant a > 6ans, la subvention a déjà été allouée
// Comme on peut l'allouer une seule fois, on la donne à 6ans
const getTotalForAYear = (beneficiaryAge: number): number => {
    const { BENEFICIARY_AGE_ALLOCATION, MAX_GRANT } = BritishColumbiaTrainingAndEducationSavingsGrantData;
    return beneficiaryAge === BENEFICIARY_AGE_ALLOCATION ? MAX_GRANT : 0;
};

export const BritishColumbiaTrainingAndEducationSavingsGrant: BritishColumbiaTrainingAndEducationSavingsGrant = {
    ...BritishColumbiaTrainingAndEducationSavingsGrantData,
    getTotalForAYear,
};
