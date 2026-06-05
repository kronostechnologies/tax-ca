import { FederalCode, ProvinceCode } from '../../misc';
import {
    federalMaxWithdrawalPct,
    getMaxWithdrawalPct,
    getYMPEUnlockingSmallBalancePct,
    othersMaxWithdrawalPct,
    province1MaxWithdrawalPct,
    province2MaxWithdrawalPct,
} from '../life-income-fund';

describe('getMaxWithdrawalPct', () => {
    // @formatter:off
    describe.each`
        title | min | max | jurisdictions | maxWithdrawalPct
        ${'given AB, BC, ON, NB, NL or SK jurisdiction'} | ${51} | ${90} | ${['AB', 'BC', 'ON', 'NB', 'NL', 'SK']} | ${province1MaxWithdrawalPct}
        ${'given QC, MB or NS jurisdiction'} | ${51} | ${89} | ${['QC', 'MB', 'NS']} | ${province2MaxWithdrawalPct}
        ${'given federal jurisdiction'} | ${20} | ${89} | ${['CA']} | ${federalMaxWithdrawalPct}
        ${'given other jurisdiction'} | ${20} | ${89} | ${['other']} | ${othersMaxWithdrawalPct}
    `('$title', ({ // @formatter:on
        min, max, jurisdictions, maxWithdrawalPct,
    }) => {
        it(`should return percentage at ${min} years old when age is lower than ${min}`, () => {
            const age = min - 2;
            const expectedResult = maxWithdrawalPct[min];

            jurisdictions.forEach((jurisdiction: FederalCode | ProvinceCode) => {
                const result = getMaxWithdrawalPct(jurisdiction, age);
                expect(result).toBe(expectedResult);
                expect(result).not.toBeUndefined();
            });
        });

        it(`should return percentage at ${max} years old when age is higher than ${max}`, () => {
            const age = max + 2;
            const expectedResult = maxWithdrawalPct[max];

            jurisdictions.forEach((jurisdiction: FederalCode | ProvinceCode) => {
                const result = getMaxWithdrawalPct(jurisdiction, age);
                expect(result).toBe(expectedResult);
                expect(result).not.toBeUndefined();
            });
        });

        it(`should return percentage at given age when age is between ${min} and ${max}`, () => {
            const age = 65;
            const expectedResult = maxWithdrawalPct[age];

            jurisdictions.forEach((jurisdiction: FederalCode | ProvinceCode) => {
                const result = getMaxWithdrawalPct(jurisdiction, age);
                expect(result).toBe(expectedResult);
                expect(result).not.toBeUndefined();
            });
        });
    });
});

describe('getYMPEUnlockingSmallBalancePct', () => {
    // @formatter:off
    describe.each`
        jurisdiction | age   | expected
        ${'AB'}      | ${64} | ${0.20}
        ${'AB'}      | ${65} | ${0.40}
        ${'AB'}      | ${40} | ${0.20}
        ${'BC'}      | ${64} | ${0.20}
        ${'BC'}      | ${65} | ${0.40}
        ${'SK'}      | ${40} | ${0.20}
        ${'SK'}      | ${65} | ${0.20}
        ${'ON'}      | ${55} | ${0.40}
        ${'ON'}      | ${65} | ${0.40}
        ${'QC'}      | ${65} | ${0.40}
        ${'MB'}      | ${65} | ${0.40}
        ${'NB'}      | ${65} | ${0.40}
        ${'NL'}      | ${65} | ${0.40}
        ${'NS'}      | ${65} | ${0.50}
        ${'NT'}      | ${55} | ${0.50}
        ${'NU'}      | ${55} | ${0.50}
        ${'YT'}      | ${55} | ${0.50}
    `('$jurisdiction at $age', ({ // @formatter:on
        jurisdiction, age, expected,
    }) => {
        it(`should return ${expected}`, () => {
            expect(getYMPEUnlockingSmallBalancePct(jurisdiction, age)).toBe(expected);
        });
    });

    describe('when the minimum age is not met', () => {
        // @formatter:off
        describe.each`
            jurisdiction | age
            ${'ON'}      | ${54}
            ${'QC'}      | ${64}
            ${'MB'}      | ${64}
            ${'NB'}      | ${64}
            ${'NL'}      | ${64}
            ${'NS'}      | ${64}
            ${'NT'}      | ${54}
            ${'NU'}      | ${54}
            ${'YT'}      | ${54}
        `('$jurisdiction at $age', ({ // @formatter:on
            jurisdiction, age,
        }) => {
            it('should return null', () => {
                expect(getYMPEUnlockingSmallBalancePct(jurisdiction, age)).toBeNull();
            });
        });
    });

    describe('when the jurisdiction has no small-balance unlocking mechanism', () => {
        it.each([20, 55, 65, 90])('should return null for PE at age %s', (age) => {
            expect(getYMPEUnlockingSmallBalancePct('PE', age)).toBeNull();
        });
    });

    describe('when there is no minimum age', () => {
        it.each(['AB', 'BC', 'SK'] as ProvinceCode[])(
            'should return a threshold even below 55 for %s',
            (jurisdiction) => {
                expect(getYMPEUnlockingSmallBalancePct(jurisdiction, 50)).not.toBeNull();
            },
        );
    });
});
