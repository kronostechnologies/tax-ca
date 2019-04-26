/*
Sources:
  http://www.taxtips.ca/marginaltaxrates.htm
  
Revised 2018-12-21
*/
import { maxBy } from 'lodash';

export default {
  FEDERAL_CODE: 'CA',
  calculateEffectiveTaxRate(income, province) {
    if (income <= 0) {
      return 0;
    }

    const prov_tax = this.getProvincialTaxAmount(province, income, 0, 0);
    const prov_base_credit = this.getProvincialBaseCredit(province, 0, 0);

    const fed_tax = this.getFederalTaxAmount(income, 0, 0);
    const fed_base_credit = this.getFederalBaseCredit(0, 0);
    const fed_prov_abatement = this.getProvincialAbatement(province, fed_tax - fed_base_credit);

    const taxes_to_pay = Math.max(fed_tax - fed_base_credit - fed_prov_abatement, 0) + Math.max(prov_tax - prov_base_credit, 0);

    return taxes_to_pay / income;
  },
  getFederalMarginalRate(provincial_code, gross_income, inflation_rate = 0, years_to_inflate = 0) {
    const fed_tax = this.getFederalTaxAmount(gross_income, inflation_rate, years_to_inflate);
    const fed_base_credit = this.getFederalBaseCredit(inflation_rate, years_to_inflate);
    const fed_prov_abatement = this.getProvincialAbatement(provincial_code, fed_tax - fed_base_credit);

    return gross_income <= 0 ? 0 : Math.max(fed_tax - fed_base_credit - fed_prov_abatement, 0) / gross_income;
  },
  getFederalTaxAmount(gross_income, inflation_rate = 0, years_to_inflate = 0) {
    let fed_tax = 0;
    this.TAX_BRACKETS.CA.RATES.forEach(bracket => {
      const bracket_from = bracket.FROM * ((1 + inflation_rate) ** years_to_inflate);
      if (bracket_from < gross_income) {
        const bracket_to = bracket.TO * ((1 + inflation_rate) ** years_to_inflate);
        fed_tax += (Math.min(gross_income, bracket_to) - bracket_from) * bracket.RATE;
      }
    });
    return fed_tax;
  },
  getFederalBaseCredit(inflation_rate, years_to_inflate) {
    return this.TAX_BRACKETS.CA.BASE_TAX_CREDIT * this.TAX_BRACKETS.CA.TAX_CREDIT_RATE * ((1 + inflation_rate) ** years_to_inflate);
  },
  getProvincialAbatement(province, federal_tax_amount) {
    return this.TAX_BRACKETS[province].ABATEMENT * federal_tax_amount;
  },
  getProvincialTaxAmount(provincial_code, gross_income, inflation_rate = 0, years_to_inflate = 0) {
    let prov_tax = 0;
    this.TAX_BRACKETS[provincial_code].RATES.forEach(bracket => {
      const bracket_from = bracket.FROM * ((1 + inflation_rate) ** years_to_inflate);
      if (bracket_from < gross_income) {
        const bracket_to = bracket.TO * ((1 + inflation_rate) ** years_to_inflate);
        prov_tax += (Math.min(gross_income, bracket_to) - bracket_from) * bracket.RATE;
      }
    });
    return prov_tax;
  },
  getProvincialSurtaxAmount(province, base_tax_amount, inflation_rate = 0, years_to_inflate = 0) {
    let surtax_amount = 0;
    this.TAX_BRACKETS[province].SURTAX_RATES.forEach(bracket => {
      const bracket_from = bracket.FROM * ((1 + inflation_rate) ** years_to_inflate);
      if (bracket_from < base_tax_amount) {
        const bracket_to = bracket.TO * ((1 + inflation_rate) ** years_to_inflate);
        surtax_amount += (Math.min(base_tax_amount, bracket_to) - bracket_from) * (bracket.RATE);
      }
    });
    return surtax_amount;
  },
  getProvincialMarginalRate(provincial_code, gross_income, inflation_rate = 0, years_to_inflate = 0) {
    let marginal_rate = 0;
    const base_tax_amount = this.getProvincialTaxAmount(provincial_code, gross_income, inflation_rate, years_to_inflate);

    this.TAX_BRACKETS[provincial_code].RATES.forEach(bracket => {
      const bracket_from = bracket.FROM * ((1 + inflation_rate) ** years_to_inflate);
      if (bracket_from < gross_income) {
        marginal_rate = bracket.RATE;
      }
    });

    let surtax_rate = 0;
    this.TAX_BRACKETS[provincial_code].SURTAX_RATES.forEach(bracket => {
      const bracket_from = bracket.FROM * ((1 + inflation_rate) ** years_to_inflate);
      if (bracket_from < base_tax_amount) {
        surtax_rate = bracket.RATE;
      }
    });

    return marginal_rate * (1 + surtax_rate);
  },
  getProvincialBaseCredit(province, inflation_rate, years_to_inflate) {
    return this.TAX_BRACKETS[province].BASE_TAX_CREDIT * this.TAX_BRACKETS[province].RATES[0].RATE * ((1 + inflation_rate) ** years_to_inflate);
  },
  getTotalMarginalRate(provincial_code, gross_income, inflation_rate = 0, years_to_inflate = 0) {
    const prov_rate = this.getProvincialMarginalRate(provincial_code, gross_income, inflation_rate, years_to_inflate);
    const fed_rate = this.getFederalMarginalRate(provincial_code, gross_income, inflation_rate, years_to_inflate);

    return prov_rate + fed_rate;
  },
  getMaxProvincialMarginalRate(provincial_code) {
      return maxBy(this.TAX_BRACKETS[provincial_code].RATES, bracket => bracket.TO).RATE;
  },
  getMaxFederalMarginalRate(provincial_code) {
      const maxRate = maxBy(this.TAX_BRACKETS[this.FEDERAL_CODE].RATES, bracket => bracket.TO).RATE;
      return maxRate * (1 - this.TAX_BRACKETS[provincial_code].ABATEMENT);
  },
  getTotalMaxMarginalRate(provincial_code) {
      const prov_rate = this.getMaxProvincialMarginalRate(provincial_code);
      const fed_rate = this.getMaxFederalMarginalRate(provincial_code);

      return (prov_rate + fed_rate).toPrecision(4);
  },
  getTotalTaxAmount(provincial_code, gross_income, inflation_rate = 0, years_to_inflate = 0) {
    const prov_tax = this.getProvincialTaxAmount(provincial_code, gross_income, inflation_rate, years_to_inflate);
    const prov_surtax = this.getProvincialSurtaxAmount(provincial_code, prov_tax, inflation_rate, years_to_inflate);
    const fed_tax = this.getFederalTaxAmount(gross_income, inflation_rate, years_to_inflate);

    return prov_tax + prov_surtax + fed_tax;
  },
  PROVINCIAL_CODES: {
    ALBERTA: 'AB',
    BRITISH_COLUMBA: 'BC',
    MANITOBA: 'MB',
    NEW_BRUNSWICK: 'NB',
    NEWFOUNDLAND: 'NL',
    NOVA_SCOTIA: 'NS',
    PRINCE_EDWARD_ISLAND: 'PE',
    ONTARIO: 'ON',
    QUEBEC: 'QC',
    SASKATCHEWAN: 'SK',
    NORTHWEST_TERRITORIES: 'NT',
    NUNAVUT: 'NU',
    YUKON: 'YT',
  },
  TAX_BRACKETS: {
    CA: {
      ABATEMENT: 0,
      TAX_CREDIT_RATE: 0.15,
      BASE_TAX_CREDIT: 12069,
      RATES: [{
        FROM: 0,
        TO: 47630,
        RATE: 0.15,
      }, {
        FROM: 47630,
        TO: 95259,
        RATE: 0.205,
      }, {
        FROM: 95259,
        TO: 147667,
        RATE: 0.26,
      }, {
        FROM: 147667,
        TO: 210371,
        RATE: 0.29,
      }, {
        FROM: 210371,
        TO: 999999999,
        RATE: 0.33,
      }],
      SURTAX_RATES: [{
        FROM: 0,
        TO: 999999999,
        RATE: 0,
      }],
    },
    AB: {
      ABATEMENT: 0,
      TAX_CREDIT_RATE: 0.10,
      BASE_TAX_CREDIT: 19369,
      RATES: [{
        FROM: 0,
        TO: 131220,
        RATE: 0.10,
      }, {
        FROM: 131220,
        TO: 157464,
        RATE: 0.12,
      }, {
        FROM: 157464,
        TO: 209952,
        RATE: 0.13,
      }, {
        FROM: 209952,
        TO: 314928,
        RATE: 0.14,
      }, {
        FROM: 314928,
        TO: 999999999,
        RATE: 0.15,
      }],
      SURTAX_RATES: [{
        FROM: 0,
        TO: 999999999,
        RATE: 0,
      }],
    },
    BC: {
      ABATEMENT: 0,
      TAX_CREDIT_RATE: 0.0506,
      BASE_TAX_CREDIT: 10682,
      RATES: [{
        FROM: 0,
        TO: 40707,
        RATE: 0.0506,
      }, {
        FROM: 40707,
        TO: 81416,
        RATE: 0.077,
      }, {
        FROM: 81416,
        TO: 93476,
        RATE: 0.105,
      }, {
        FROM: 93476,
        TO: 113506,
        RATE: 0.1229,
      }, {
        FROM: 113506,
        TO: 153900,
        RATE: 0.147,
      }, {
        FROM: 153900,
        TO: 999999999,
        RATE: 0.168,
      }],
      SURTAX_RATES: [{
        FROM: 0,
        TO: 999999999,
        RATE: 0,
      }],
    },
    MB: {
      ABATEMENT: 0,
      TAX_CREDIT_RATE: 0.108,
      BASE_TAX_CREDIT: 9626,
      RATES: [{
        FROM: 0,
        TO: 32670,
        RATE: 0.108,
      }, {
        FROM: 32670,
        TO: 70610,
        RATE: 0.1275,
      }, {
        FROM: 70610,
        TO: 999999999,
        RATE: 0.174,
      }],
      SURTAX_RATES: [{
        FROM: 0,
        TO: 999999999,
        RATE: 0,
      }],
    },
    NB: {
      ABATEMENT: 0,
      TAX_CREDIT_RATE: 0.0968,
      BASE_TAX_CREDIT: 10264,
      RATES: [{
        FROM: 0,
        TO: 42592,
        RATE: 0.0968,
      }, {
        FROM: 42592,
        TO: 85184,
        RATE: 0.1482,
      }, {
        FROM: 85184,
        TO: 138491,
        RATE: 0.1652,
      }, {
        FROM: 138491,
        TO: 157778,
        RATE: 0.1784,
      }, {
        FROM: 157778,
        TO: 999999999,
        RATE: 0.2030,
      }],
      SURTAX_RATES: [{
        FROM: 0,
        TO: 999999999,
        RATE: 0,
      }],
    },
    NL: {
      ABATEMENT: 0,
      TAX_CREDIT_RATE: 0.087,
      BASE_TAX_CREDIT: 9414,
      RATES: [{
        FROM: 0,
        TO: 37591,
        RATE: 0.087,
      }, {
        FROM: 37591,
        TO: 75181,
        RATE: 0.145,
      }, {
        FROM: 75181,
        TO: 134224,
        RATE: 0.158,
      }, {
        FROM: 134224,
        TO: 187913,
        RATE: 0.173,
      }, {
        FROM: 187913,
        TO: 999999999,
        RATE: 0.183,
      }],
      SURTAX_RATES: [{
        FROM: 0,
        TO: 999999999,
        RATE: 0,
      }],
    },
    NS: {
      ABATEMENT: 0,
      TAX_CREDIT_RATE: 0.0879,
      BASE_TAX_CREDIT: 8481,
      RATES: [{
        FROM: 0,
        TO: 29590,
        RATE: 0.0879,
      }, {
        FROM: 29590,
        TO: 59180,
        RATE: 0.1495,
      }, {
        FROM: 59180,
        TO: 93000,
        RATE: 0.1667,
      }, {
        FROM: 93000,
        TO: 150000,
        RATE: 0.175,
      }, {
        FROM: 150000,
        TO: 999999999,
        RATE: 0.21,
      }],
      SURTAX_RATES: [{
        FROM: 0,
        TO: 999999999,
        RATE: 0,
      }],
    },
    PE: {
      ABATEMENT: 0,
      TAX_CREDIT_RATE: 0.098,
      BASE_TAX_CREDIT: 9160,
      RATES: [{
        FROM: 0,
        TO: 31984,
        RATE: 0.098,
      }, {
        FROM: 31984,
        TO: 63969,
        RATE: 0.138,
      }, {
        FROM: 63969,
        TO: 999999999,
        RATE: 0.167,
      }],
      SURTAX_RATES: [{
        FROM: 0,
        TO: 12500,
        RATE: 0,
      }, {
        FROM: 12500,
        TO: 999999999,
        RATE: 0.10,
      }],
    },
    ON: {
      ABATEMENT: 0,
      TAX_CREDIT_RATE: 0.0505,
      BASE_TAX_CREDIT: 10582,
      RATES: [{
        FROM: 0,
        TO: 43906,
        RATE: 0.0505,
      }, {
        FROM: 43906,
        TO: 87813,
        RATE: 0.0915,
      }, {
        FROM: 87813,
        TO: 150000,
        RATE: 0.1116,
      }, {
        FROM: 150000,
        TO: 220000,
        RATE: 0.1216,
      }, {
        FROM: 220000,
        TO: 999999999,
        RATE: 0.1316,
      }],
      SURTAX_RATES: [{
        FROM: 0,
        TO: 4740,
        RATE: 0,
      }, {
        FROM: 4740,
        TO: 6067,
        RATE: 0.20,
      }, {
        FROM: 6067,
        TO: 999999999,
        RATE: 0.56, // 0.20 + 0.36
      }],
    },
    QC: {
      ABATEMENT: 0.165, // http://www.cra-arc.gc.ca/tx/ndvdls/tpcs/ncm-tx/rtrn/cmpltng/ddctns/lns409-485/440-fra.html
      TAX_CREDIT_RATE: 0.15,
      BASE_TAX_CREDIT: 15269,
      RATES: [{
        FROM: 0,
        TO: 43790,
        RATE: 0.15,
      }, {
        FROM: 43790,
        TO: 87575,
        RATE: 0.20,
      }, {
        FROM: 87575,
        TO: 106555,
        RATE: 0.24,
      }, {
        FROM: 106555,
        TO: 999999999,
        RATE: 0.2575,
      }],
      SURTAX_RATES: [{
        FROM: 0,
        TO: 999999999,
        RATE: 0,
      }],
    },
    SK: {
      ABATEMENT: 0,
      TAX_CREDIT_RATE: 0.105,
      BASE_TAX_CREDIT: 16065,
      RATES: [{
        FROM: 0,
        TO: 45225,
        RATE: 0.105,
      }, {
        FROM: 45225,
        TO: 129214,
        RATE: 0.125,
      }, {
        FROM: 129214,
        TO: 999999999,
        RATE: 0.145,
      }],
      SURTAX_RATES: [{
        FROM: 0,
        TO: 999999999,
        RATE: 0,
      }],
    },
    NT: {
      ABATEMENT: 0,
      TAX_CREDIT_RATE: 0.059,
      BASE_TAX_CREDIT: 14811,
      RATES: [{
        FROM: 0,
        TO: 43137,
        RATE: 0.059,
      }, {
        FROM: 43137,
        TO: 86277,
        RATE: 0.086,
      }, {
        FROM: 86277,
        TO: 140267,
        RATE: 0.122,
      }, {
        FROM: 140267,
        TO: 999999999,
        RATE: 0.1405,
      }],
      SURTAX_RATES: [{
        FROM: 0,
        TO: 999999999,
        RATE: 0,
      }],
    },
    NU: {
      ABATEMENT: 0,
      TAX_CREDIT_RATE: 0.04,
      BASE_TAX_CREDIT: 13618,
      RATES: [{
        FROM: 0,
        TO: 45414,
        RATE: 0.04,
      }, {
        FROM: 45414,
        TO: 90829,
        RATE: 0.07,
      }, {
        FROM: 90829,
        TO: 147667,
        RATE: 0.09,
      }, {
        FROM: 147667,
        TO: 999999999,
        RATE: 0.115,
      }],
      SURTAX_RATES: [{
        FROM: 0,
        TO: 999999999,
        RATE: 0,
      }],
    },
    YT: {
      ABATEMENT: 0,
      TAX_CREDIT_RATE: 0.064,
      BASE_TAX_CREDIT: 12069,
      RATES: [{
        FROM: 0,
        TO: 47630,
        RATE: 0.064,
      }, {
        FROM: 47630,
        TO: 95259,
        RATE: 0.09,
      }, {
        FROM: 95259,
        TO: 147667,
        RATE: 0.109,
      }, {
        FROM: 147667,
        TO: 500000,
        RATE: 0.128,
      }, {
        FROM: 500000,
        TO: 999999999,
        RATE: 0.15,
      }],
      SURTAX_RATES: [{
        FROM: 0,
        TO: 999999999,
        RATE: 0,
      }],
    },
  },
};
