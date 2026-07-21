# Testing the KMP branch inside real consumers

How to validate the `kmp-migration` branch against kronos-fna, fna-engine, and
financial-api on your own machine. All of these were run successfully on 2026-07-17
(kronos-fna 231/231 baseline-identical; financial-api 4/4; see the branch commit
messages) — these instructions let anyone reproduce that.

## Getting the npm package

**Option A — download from CI (no JDK needed):** every CI run of the branch/PR uploads
an `npm-package` artifact containing `tax-ca-kmp.tgz`.

GitHub Actions always wraps artifacts in a `.zip` for download — the tarball is INSIDE
it. Don't point yarn at the `.zip`; unwrap first:

```bash
# easiest: gh CLI downloads AND extracts in one step
gh run download <run-id> -n npm-package        # yields tax-ca-kmp.tgz in cwd

# or from the web UI (Actions -> the run -> Artifacts -> npm-package):
unzip npm-package.zip                          # yields tax-ca-kmp.tgz
```

**Option B — build locally (needs JDK 17+; Gradle comes via the wrapper):**

```bash
git clone -b kmp-migration git@github.com:kronostechnologies/tax-ca.git
cd tax-ca
yarn install && yarn build
yarn pack -o tax-ca-kmp.tgz
```

## kronos-fna

```bash
cd kronos-fna
cp /path/to/tax-ca-kmp.tgz .
yarn add @equisoft/tax-ca@file:./tax-ca-kmp.tgz
NODE_ENV=test yarn jest \
    application/web/app/state/reflux/reducers/util/tests/retirement-utility.test.js \
    application/web/app/state/reflux/reducers/tests/LifeReducer.test.js \
    application/web/app/state/redux/data/plan/retirementAnalyses \
    application/web/app/utility/tests/RetirementAnalysisHelper.test.ts
# or the full suite: yarn test
```

Expected: identical results to the same run on the original `2026.9.1` (run the baseline
first if in doubt). Revert with:

```bash
git checkout -- package.json yarn.lock && rm tax-ca-kmp.tgz && yarn install
```

## fna-engine

Same tarball procedure:

```bash
cd fna-engine
cp /path/to/tax-ca-kmp.tgz .
yarn add @equisoft/tax-ca@file:./tax-ca-kmp.tgz
yarn test        # or the tax-ca-heavy suites if you want a quicker signal
```

Note: fna-engine deep-imports `@equisoft/tax-ca/dist/misc/code-types` in 18 files — the
KMP package ships a shim at that exact path, so no source changes are needed. Revert the
same way as kronos-fna.

## financial-api (Maven / JVM)

1. Publish the branch to your local Maven repository:

   ```bash
   cd tax-ca   # the kmp-migration clone
   ./gradlew publishToMavenLocal -Papplication.version=2026.99.0-test
   ```

2. In financial-api, add to `api/build.gradle.kts` (temporary, don't commit):

   ```kotlin
   repositories { mavenLocal() }
   dependencies { testImplementation("com.equisoft:tax-ca:2026.99.0-test") }
   ```

3. Copy the ready-made parity test into the repo — it compares the artifact
   field-by-field against financial-api's duplicated constants and logic (BigDecimal
   `compareTo`, exact CCF equality, factor grids):

   ```bash
   cp tax-ca/docs/kmp-migration/financial-api-parity-test.kt.txt \
      financial-api/api/src/test/kotlin/com/equisoft/financialapi/infrastructure/taxca/TaxCaKmpParityTest.kt
   ```

4. Run it (jacoco/e2e excluded — they fail on single-test runs for unrelated reasons):

   ```bash
   cd financial-api
   ./gradlew :api:test --tests "*.TaxCaKmpParityTest" -x e2e-tests -x jacocoTestCoverageVerification
   ```

Expected: 4/4. Revert with `git checkout -- api/build.gradle.kts` and delete the test file.

## Known caveats

- The OAS age-75 increase behavior intentionally differs between financial-api and
  tax-ca (migration decision D1, pending domain ruling); the parity test compares only
  below that boundary.
- The npm package freezes `now()` to 2020-01-01 under `NODE_ENV=test`, same as legacy.
- Once the Maven registry is configured (decision D4), branch snapshots can be published
  centrally and step 1 of the financial-api flow disappears.
