import { FederalCode, ProvinceCode } from '../../misc/code-types';
import { federalMaxWithdrawalPct, getMaxWithdrawalPct, othersMaxWithdrawalPct, province1MaxWithdrawalPct, province2MaxWithdrawalPct } from '../life-income-fund';

describe('getMaxWithdrawalPct', () => {
    describe.each`
        title | min | max | jurisdictions | maxWithdrawalPct
        ${'given AB, BC, ON, NB, NL or SK jurisdiction'} | ${54} | ${90} | ${['AB', 'BC', 'ON', 'NB', 'NL', 'SK']} | ${province1MaxWithdrawalPct}
        ${'given QC, MB or NS jurisdiction'} | ${54} | ${89} | ${['QC', 'MB', 'NS']} | ${province2MaxWithdrawalPct}
        ${'given federal jurisdiction'} | ${54} | ${90} | ${['CA']} | ${federalMaxWithdrawalPct}
        ${'given other jurisdiction'} | ${54} | ${96} | ${['other']} | ${othersMaxWithdrawalPct}
    `('$title', ({ min, max, jurisdictions, maxWithdrawalPct }) => {
        it(`should return percentage at ${min} years old when age is lower than ${min}`, () => {
            const age = min - 2;
            const expectedResult = maxWithdrawalPct[min];

            jurisdictions.forEach((jurisdiction: FederalCode | ProvinceCode) => {
                const result = getMaxWithdrawalPct(jurisdiction, age);
                expect(result).toBe(expectedResult);
            });
        });

        it(`should return percentage at ${max} years old when age is higher than ${max}`, () => {
            const age = max + 2;
            const expectedResult = maxWithdrawalPct[max];

            jurisdictions.forEach((jurisdiction: FederalCode | ProvinceCode) => {
                const result = getMaxWithdrawalPct(jurisdiction, age);
                expect(result).toBe(expectedResult);
            });
        });

        it(`should return percentage at given age when age is between ${min} and ${max}`, () => {
            const age = 65;
            const expectedResult = maxWithdrawalPct[age];

            jurisdictions.forEach((jurisdiction: FederalCode | ProvinceCode) => {
                const result = getMaxWithdrawalPct(jurisdiction, age);
                expect(result).toBe(expectedResult);
            });
        });
    });
});
