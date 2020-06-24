# tax-ca

## Description

The `tax-ca` library contains up-to-date provincial and federal tax data and calculation functions.

We built it so that we would have a single source of truth for taxes data across all of our applications.  The initial version is derived from code from the `fna-engine`, `kronos-fna` and `kronos-express` repositories.

As we develop and update `tax-ca`, we will try to make it as application-agnostic as possible.

## Installation

Using `npm` : 
```
npm install @equisoft/tax-ca --save
```

Using `yarn` :
```
yarn add @equisoft/tax-ca
```

## Versions

The `major` portion of the library version is named according to the year of the dataset it contains. There could be breaking changes (such as modifications to the data structure) in both `major` and `minor` updates.

Updates at the `patch` level are reserved for bug fixes, non-breaking changes and minor improvements.

We suggest you lock the library dependency to the `minor` version and execute exhaustive testing before migrating to a new version to avoid unintentional regression.

```javascript
  "dependencies": {
    "@equisoft/tax-ca": "^2018.0.4",
  },
```


## Usage

To use the library, we recommend you start by going through the **Modules** list (see below) to locate the data set or function you are looking for.

Once you know where your target data or function is located, simply import the module then access it directly in the code.

```javascript
import { PENSION } from '@equisoft/tax-ca';

const { OAS, CPP } = PENSION;

console.log("OAS maximum age: ", OAS.MAX_AGE); // 70
```


## Modules

### `INVESTMENTS`

Data relating to registered investments accounts.

```
INVESTMENTS
  |--LifeIncomeFund
  |--RegisteredRetirementIncomeFund
  |--RegisteredRetirementSavingsPlan
  |--TaxFreeSavingsAccount
```

### `PENSION`

Data relating to federal and provincial pension plans.

```
PENSION
  |--CPP
  |--OAS
  |--QPP
  |--SPP
```

### `TAXES`

Data relating to federal and provincial income taxes and social charges.

```
TAXES
  |--EmploymentInsurance
  |--IncomeTax
  |--QuebecParentalInsurancePlan
```

### `MISC`

Complementary data useful in a tax calculation context.

```
MISC
  |--CPI
  |--QIFP
  |--LIFE_EXPECTANCY
```


## Development

This library is maintained by the _Equisoft Plan_ team in Quebec City.

We strongly value [inner source](https://en.wikipedia.org/wiki/Inner_source) practices within Equisoft and encourage contributors external to the FNA team to submit issues (including feature requests) and pull requests to the repository. 

### Release

To release please use :

```
yarn publish 
          --new-version XXXX.X.X  OR    
          --major                             auto-increment major version number OR
          --minor                             auto-increment minor version number OR
          --patch                             auto-increment patch version number
git push
git push --tags
``` 
