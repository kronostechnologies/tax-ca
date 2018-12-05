/*
Sources:
  http://www.taxtips.ca/marginaltaxrates.htm
  https://home.kpmg.com/content/dam/kpmg/pdf/2016/07/Federal-and-Provincial-Non-Refundable-Tax-Credit-Rates-and-Amounts-for-2016.pdf
*/

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
      BASE_TAX_CREDIT: 11809,
      RATES: [{
        FROM: 0,
        TO: 46605,
        RATE: 0.15,
      }, {
        FROM: 46605,
        TO: 93208,
        RATE: 0.205,
      }, {
        FROM: 93208,
        TO: 144489,
        RATE: 0.26,
      }, {
        FROM: 144489,
        TO: 205842,
        RATE: 0.29,
      }, {
        FROM: 205842,
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
      BASE_TAX_CREDIT: 18915,
      RATES: [{
        FROM: 0,
        TO: 128145,
        RATE: 0.10,
      }, {
        FROM: 128145,
        TO: 153773,
        RATE: 0.12,
      }, {
        FROM: 153773,
        TO: 205031,
        RATE: 0.13,
      }, {
        FROM: 205031,
        TO: 307547,
        RATE: 0.14,
      }, {
        FROM: 307547,
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
      BASE_TAX_CREDIT: 10412,
      RATES: [{
        FROM: 0,
        TO: 39676,
        RATE: 0.0506,
      }, {
        FROM: 39676,
        TO: 79353,
        RATE: 0.077,
      }, {
        FROM: 79353,
        TO: 91107,
        RATE: 0.0105,
      }, {
        FROM: 91107,
        TO: 110630,
        RATE: 0.1229,
      }, {
        FROM: 110630,
        TO: 150000,
        RATE: 0.147,
      }, {
        FROM: 150000,
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
      BASE_TAX_CREDIT: 9382,
      RATES: [{
        FROM: 0,
        TO: 31843,
        RATE: 0.108,
      }, {
        FROM: 31843,
        TO: 68821,
        RATE: 0.1275,
      }, {
        FROM: 68821,
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
      BASE_TAX_CREDIT: 10043,
      RATES: [{
        FROM: 0,
        TO: 41675,
        RATE: 0.0968,
      }, {
        FROM: 41675,
        TO: 83351,
        RATE: 0.1482,
      }, {
        FROM: 83351,
        TO: 135510,
        RATE: 0.1652,
      }, {
        FROM: 133510,
        TO: 154382,
        RATE: 0.1784,
      }, {
        FROM: 154382,
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
      BASE_TAX_CREDIT: 9247,
      RATES: [{
        FROM: 0,
        TO: 36926,
        RATE: 0.087,
      }, {
        FROM: 36926,
        TO: 73852,
        RATE: 0.145,
      }, {
        FROM: 73852,
        TO: 131850,
        RATE: 0.158,
      }, {
        FROM: 131850,
        TO: 184590,
        RATE: 0.173,
      }, {
        FROM: 184590,
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
      BASE_TAX_CREDIT: 8160,
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
      BASE_TAX_CREDIT: 10354,
      RATES: [{
        FROM: 0,
        TO: 42960,
        RATE: 0.0505,
      }, {
        FROM: 42960,
        TO: 85923,
        RATE: 0.0915,
      }, {
        FROM: 85923,
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
        TO: 4638,
        RATE: 0,
      }, {
        FROM: 4638,
        TO: 5936,
        RATE: 0.20,
      }, {
        FROM: 5936,
        TO: 999999999,
        RATE: 0.56, // 0.20 + 0.36
      }],
    },
    QC: {
      ABATEMENT: 0.165, // http://www.cra-arc.gc.ca/tx/ndvdls/tpcs/ncm-tx/rtrn/cmpltng/ddctns/lns409-485/440-fra.html
      TAX_CREDIT_RATE: 0.20,
      BASE_TAX_CREDIT: 15012,
      RATES: [{
        FROM: 0,
        TO: 43055,
        RATE: 0.15,
      }, {
        FROM: 43055,
        TO: 86105,
        RATE: 0.20,
      }, {
        FROM: 86105,
        TO: 104765,
        RATE: 0.24,
      }, {
        FROM: 104765,
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
      TAX_CREDIT_RATE: 0.11,
      BASE_TAX_CREDIT: 16065,
      RATES: [{
        FROM: 0,
        TO: 45225,
        RATE: 0.11,
      }, {
        FROM: 45225,
        TO: 129214,
        RATE: 0.13,
      }, {
        FROM: 129214,
        TO: 999999999,
        RATE: 0.15,
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
      BASE_TAX_CREDIT: 14492,
      RATES: [{
        FROM: 0,
        TO: 42209,
        RATE: 0.059,
      }, {
        FROM: 42209,
        TO: 84420,
        RATE: 0.086,
      }, {
        FROM: 84420,
        TO: 137248,
        RATE: 0.122,
      }, {
        FROM: 137248,
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
      BASE_TAX_CREDIT: 13325,
      RATES: [{
        FROM: 0,
        TO: 44437,
        RATE: 0.04,
      }, {
        FROM: 44437,
        TO: 88874,
        RATE: 0.07,
      }, {
        FROM: 88874,
        TO: 144488,
        RATE: 0.09,
      }, {
        FROM: 144488,
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
      BASE_TAX_CREDIT: 11809,
      RATES: [{
        FROM: 0,
        TO: 46605,
        RATE: 0.0640,
      }, {
        FROM: 46605,
        TO: 93208,
        RATE: 0.09,
      }, {
        FROM: 93208,
        TO: 144489,
        RATE: 0.109,
      }, {
        FROM: 144489,
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
