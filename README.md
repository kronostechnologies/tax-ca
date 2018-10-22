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

The `major` portion of the library version is named according to the year of the dataset it contains.

For example, the version `2018.0.4` would contain 2018 tax data.  We suggest you lock the library dependency to the major version and exectue exhaustive testing before migrating to the next year dataset to avoid unintentional regression.

```javascript
  "dependencies": {
    "@equisoft/tax-ca": "^2018.0.4",
  },
```


## Usage

To use the library, we recommend you start by going through the **Modules** list (see below) to locate the data set or function you are looking for.

Once you know where your target data or function is located, simply import the module then access it directly in the code.

```javascript
import { pension } from '@equisoft/tax-ca';

const { oas, cpp } = pension;

console.log("OAS maximum age: ", oas.max_age); // 70
console.log("CPP AAF for age 67: ", cpp.getAAF(67)); // 1.168
```


## Modules

### `investements`

Data relating to registered investments accounts.

```
investments
  |--lif
  |--rrif
  |--tfsa
  |--rrsp
```

### `pension`

Data relating to federal and provincial pension plans.

```
pension
  |--cpp
  |--oas
  |--qpp
  |--spp
```

### `taxes`

Data relating to federal and provincial income taxes and social charges.

```
taxes
  |--ei
  |--income_tax
  |--qpip
```

### `misc`

Complementary data useful in a tax calculation context.

```
misc
  |--cpi
  |--iqpf
  |--life_expectancy
```


## Development

This library is maintained by the _Kronos FNA_ team in Quebec City.

We strongly value [inner source](https://en.wikipedia.org/wiki/Inner_source) practices within Equisoft and encourage contributors external to the FNA team to submit issues (including feature requests) and pull request to the repository. 