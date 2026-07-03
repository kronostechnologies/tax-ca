# Upgrade Steps

- [ACTION REQUIRED]
- You must now use `import { } from @equisoft/tax-ca` instead of `import * from @equisopft/tax-ca` 

# Breaking Changes

- Function `IncomeTax.calculateTaxes` has been renamed to `IncomeTax.getTaxes`, method signature has changed
- `CPP.getRequestDateFactor` and `QPP.getRequestDateFactor` are now pure functions of `(birthDate, requestDate, customReferenceDate?)` and no longer depend on the current date. A request date in the past that used to collapse to a factor of `1` ("already receiving") now returns the deferral/penalty factor computed from the reference age (65 by default). Consumers that relied on the previous last-birthday/"already requested" semantics must adjust. (ABF-13000)

# New Features

- `getPublicPensionRequestDateFactor(plan, birthDate, requestDate, customReferenceDate?)` exported from `@equisoft/tax-ca` — the shared, pure implementation behind `CPP`/`QPP` `getRequestDateFactor`.

# Bug Fixes

- Fix the error in file A #1 (@toby-daigle)
- Fix `CPP.getRequestDateFactor` / `QPP.getRequestDateFactor` anchoring the deferral bonus at the client's last birthday instead of at the reference age (65). Clients already past 65 were under-bonified — a request on a birthday that had already passed returned a factor of `1` (no bonus). (ABF-13000)

# Improvements

- `CPP.getRequestDateFactor` and `QPP.getRequestDateFactor` now share a single implementation (`getPublicPensionRequestDateFactor`), removing duplicated logic that had to be kept in sync between the two plans.
-

# Other Changes

-
-
