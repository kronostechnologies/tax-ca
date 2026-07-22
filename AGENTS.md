# AGENTS.md

This is the **tax-ca** repository for the Equisoft AWT organization. It is a **Kotlin Multiplatform**
library that contains up-to-date provincial and federal Canadian tax data and calculation functions,
published as both an npm package (`@equisoft/tax-ca`) and a Maven artifact (`com.equisoft:tax-ca`) from a
single code base.

The project is built with **Kotlin 2.3.21** (JVM + JS/Node targets), **Gradle**, **kotlinx-datetime**,
**Yarn 4** (for the npm package payload), and ships a hand-maintained **TypeScript declaration overlay**
plus a golden-corpus compatibility gate so the JS API stays byte-for-byte compatible with the historical
TypeScript library.

---

## Organization-Wide Standards

You **must** read and follow the organization-wide standards defined at: https://raw.githubusercontent.com/kronostechnologies/standards/master/docs/instructions/asr.instructions.md

---

## Repository-Specific Instructions

### Architecture at a glance

One code base, two artifacts:

| Source set    | Role |
|---------------|------|
| `commonMain`  | **The single source of truth** — all tax data and calculation logic. Idiomatic Kotlin. Compiles to JVM + JS. |
| `commonTest`  | Test suite ported 1:1 from the legacy jest specs. Runs on **both** JVM and Node — platform math drift fails the build. |
| `jsMain`      | The npm compatibility facade (`@equisoft/tax-ca`). Preserves legacy TS package names, shapes, and runtime semantics. |
| `jvmMain`     | The JVM boundary layer (`BigDecimal` views, `java.time` overloads) for services like `financial-api`. |
| `jvmTest`     | JVM-only tests (BigDecimal views, `java.time` overloads, BigDecimal-exact variants). |

Before adding or modifying code, read the focused READMEs — they take precedence over any assumption:

- [`src/README.md`](src/README.md) — source-set layout, commonMain conventions, **yearly data revision workflow**
- [`src/jsMain/README.md`](src/jsMain/README.md) — npm facade: plain-object rules, mutation/`spyOn` semantics, adding an export
- [`src/jvmMain/README.md`](src/jvmMain/README.md) — **numeric policy (Double vs BigDecimal)**, `toDecimal()`, BigDecimal-exact variants, `java.time` overloads
- [`ts-compat/README.md`](ts-compat/README.md) — the **golden corpus**: trust chain, when and how to re-record
- [`dts/README.md`](dts/README.md) — TypeScript declaration overlay and patch mechanism
- [`docs/kmp-migration/README.md`](docs/kmp-migration/README.md) — migration history, decisions D1–D6, open items

### Non-negotiable conventions in `commonMain`

- **Numbers are `Double`** (`Int` only for years/ages/counts). This is a deliberate decision required for
  bit-for-bit parity with the historical JavaScript package. Do **not** introduce `BigDecimal` in
  `commonMain` — put BigDecimal views in `jvmMain` instead.
- **Dates are `kotlinx.datetime.LocalDate`.** There is **no wall-clock access in common code**: any function
  that needs "today" must take it as a parameter (the JS facade supplies `now()`).
- **Never use `kotlin.math.round`.** JS `Math.round` rounds ties toward `+Infinity`; use
  `utils.roundToPrecision` (implemented as `floor(x + 0.5)`, JS-faithful).
- Every data file **must keep** its `Sources` / `Revised` header comment — that is the audit trail for
  where values come from and when they were last checked. Update it whenever you touch data.
- **Do not "fix" legacy quirks** without a ruling. Numeric output is contractual. Examples that are
  preserved deliberately and commented in place:
  - CPP rounds its average indexation rate to 3 digits, QPP to 2.
  - JS `setUTCFullYear` overflows Feb 29 to Mar 1 — mirrored on purpose.

### Adding or changing a JS-facing export

The npm facade exports data as **plain JS objects** (consumers spread and mutate them), so the generated
`.d.ts` types many consts as `any`. The Gradle build's `dtsConstTypes` / `dtsLinePatches` / `dtsDeletedLines`
maps in `build.gradle.kts` retype them.

- Adding a new `any`-typed export: also add its mapping in `dtsConstTypes` — an unmapped `any` const
  **fails the build on purpose**.
- Removing an export or changing a signature: also remove or update its `dtsLinePatches` entry — a patch
  line the generator no longer emits **also fails the build** (drift detection both ways).
- Type-only additions belong in [`dts/overlay.d.ts`](dts/overlay.d.ts).

### Yearly data revisions

Follow the exact workflow in [`src/README.md`](src/README.md):

1. Update values in the relevant `commonMain` data file(s); refresh the `Sources` / `Revised` header.
2. Update the affected expectations in `commonTest`.
3. `./gradlew build` — all targets compile, tests pass on JVM and Node.
4. `yarn build && yarn compat` — the golden-corpus gate **fails on purpose** (values changed).
   Regenerate with `node ts-compat/deep-parity.cjs --record` and commit the `ts-compat/golden.json` diff:
   it shows reviewers exactly which values and computed results changed.
5. One release ships the new data to npm and Maven simultaneously (same version).

Never edit `ts-compat/golden.json` by hand and never regenerate it without an intentional data change —
the golden corpus is the compatibility contract with historical consumers.

### Build, test, and verify

The canonical commands (also see `Makefile`, `package.json`, and `.github/workflows/build-and-deploy.yml`):

```bash
./gradlew build            # compile all targets, run the full test suite (JVM + Node)
./gradlew allTests         # `yarn test` — tests only
yarn build                 # assemble the npm package into dist/ (delegates to Gradle)
yarn compat                # TypeScript compatibility gates + golden-corpus parity check
./gradlew publishToMavenLocal -Papplication.version=<version>   # local Maven publish
```

Toolchains: JVM 17 (see `jvmToolchain(17)` in `build.gradle.kts`) and Node 24.18.0
(see `.tool-versions`). Yarn is pinned via `packageManager` in `package.json` — always use
`yarn` (not `npm`) for JS commands.

Before opening a PR, at minimum run `./gradlew build && yarn build && yarn compat` and make sure the
golden corpus is either unchanged (pure refactor) or intentionally regenerated with the data change.

### Versioning

- **`major`** = dataset year. Breaking changes to the data structure may ship in both `major` and `minor`.
- **`patch`** = bug fixes and non-breaking improvements only.
- The npm and Maven artifacts of a given version are **built from the same commit** and always carry the
  same data — never desync them.

### Publishing

Releases are cut via GitHub Actions from a tag/release created in the GitHub UI. The workflow publishes
both the npm package and (once `MAVEN_REPOSITORY_URL` and credentials are configured in CI) the Maven
artifact from the same build. See `.github/workflows/build-and-deploy.yml`.
