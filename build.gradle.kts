plugins {
    kotlin("multiplatform") version "2.3.21"
    `maven-publish`
}

group = "com.equisoft"
version = project.findProperty("application.version")?.toString() ?: "0.0.1-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(17)

    jvm()

    js {
        nodejs()
        useCommonJs()
        binaries.library()
        generateTypeScriptDefinitions()
    }

    sourceSets {
        all {
            languageSettings.optIn("kotlin.js.ExperimentalJsExport")
        }
        commonMain {
            dependencies {
                api("org.jetbrains.kotlinx:kotlinx-datetime:0.7.1")
            }
        }
        commonTest {
            dependencies {
                implementation(kotlin("test"))
            }
        }
    }
}

// Hand-maintained TypeScript declaration overlay (dts/overlay.d.ts, appended) plus
// declaration patches. The facade exports data as PLAIN JS objects (consumers spread and
// mutate them), so the generated d.ts types them `any`; every such const must be mapped
// to its legacy type below — an unmapped `any` const fails the build on purpose, as does
// a patch line the generator no longer emits (drift detection both ways).
val dtsConstTypes = mapOf(
    "province1MaxWithdrawalPct" to "MaxWithdrawalPctByAge",
    "province2MaxWithdrawalPct" to "MaxWithdrawalPctByAge",
    "othersMaxWithdrawalPct" to "MaxWithdrawalPctByAge",
    "federalMaxWithdrawalPct" to "MaxWithdrawalPctByAge",
    "CAPITAL_GAINS_BRACKETS" to "Rate[]",
    "RRIF" to "RegisteredRetirementIncomeFund",
    "RRSP" to "RegisteredRetirementSavingsPlan",
    "TFSA" to "TaxFreeSavingsAccount",
    "PROVINCIAL_CODES" to "{ [key in ProvinceName]: ProvinceCode }",
    "CONSUMER_PRICE_INDEX" to "ConsumerPriceIndex",
    "IPF" to "IPFStatistics",
    "LIFE_EXPECTANCY" to "CombinedLifeExpectancy",
    "PPP_INCREASE_FACTOR" to "PPPIncreaseFactor",
    "OAS" to "OldAgeSecurity",
    "CPP" to "PublicPensionPlan",
    "QPP" to "PublicPensionPlan",
    "MONEY_PURCHASE" to "MoneyPurchasePensionPlan",
    "SPP" to "SupplementalPensionPlan",
    "RESP" to "{ MAX_CONTRIBUTION: number }",
    "Beneficiary" to "Beneficiary",
    "IncomeLevel" to "IncomeLevel",
    "CanadaEducationSavingsGrant" to "SavingsGrant",
    "QuebecEducationSavingsIncentive" to "SavingsGrant",
    "CanadaLearningBond" to "CanadaLearningBond",
    "BritishColumbiaTrainingAndEducationSavingsGrant" to "BritishColumbiaTrainingAndEducationSavingsGrant",
    "TuitionFees" to "TuitionFees",
    "DEFINED_BENEFIT" to "DefinedBenefitPensionPlan",
    "TAX_BRACKETS" to "TaxBrackets",
    "EI" to "EmploymentInsurance",
    "QPIP" to "QuebecParentalInsurancePlan",
    "NON_ELIGIBLE_DIVIDEND" to "DividendTaxCreditRate",
    "ELIGIBLE_DIVIDEND" to "DividendTaxCreditRate",
)

// Exact-line signature patches (legacy signatures; overlay declares the types).
val dtsLinePatches = mapOf(
    "export declare const FEDERAL_CODE: string;"
        to "export declare const FEDERAL_CODE: FederalCode;",
    "export declare function getConversionRules(jurisdiction: string): any;"
        to "export declare function getConversionRules(jurisdiction: string): ConversionRule | null;",
    "export declare function getPublicPensionRequestDateFactor(plan: any, birthDate: Date, requestDate: Date, customReferenceDate?: Nullable<Date>): number;"
        to "export declare function getPublicPensionRequestDateFactor(plan: PublicPensionPlan, birthDate: Date, requestDate: Date, customReferenceDate?: Nullable<Date>): number;",
    "export declare function initializeSavingsGrant(SavingsGrantConfig: SavingsGrantConfigInput): any;"
        to "export declare function initializeSavingsGrant(SavingsGrantConfig: SavingsGrantConfig): SavingsGrant;",
    "export declare function getTaxAmount(rates: Array<RateInput>, income: number, inflationRate: number, yearsToInflate: number): number;"
        to "export declare function getTaxAmount(rates: Rate[], income: number, inflationRate: number, yearsToInflate: number): number;",
    "export declare function getRate(brackets: Array<RateInput>, grossIncome: number, inflationRate: number, yearsToInflate: number): number;"
        to "export declare function getRate(brackets: Rate[], grossIncome: number, inflationRate: number, yearsToInflate: number): number;",
    "export declare function getTaxRates(code: string): any;"
        to "export declare function getTaxRates(code: string): Rate[];",
    "export declare function getFederalTaxRates(): any;"
        to "export declare function getFederalTaxRates(): Rate[];",
)

// The overlay declares `export declare enum IncomeLevelType` (value + type), so the
// generated any-const must be removed rather than retyped.
val dtsDeletedLines = listOf(
    "export declare const IncomeLevelType: any;",
)

tasks.named("jsNodeProductionLibraryDistribution") {
    inputs.file("dts/overlay.d.ts")
    doLast {
        val dts = layout.buildDirectory.file("dist/js/productionLibrary/tax-ca.d.ts").get().asFile
        var content = dts.readText()
        for ((from, into) in dtsLinePatches) {
            require(content.contains(from)) { "d.ts patch target not found (generator drifted?): $from" }
            content = content.replace(from, into)
        }
        for (line in dtsDeletedLines) {
            require(content.contains(line)) { "d.ts deletion target not found (generator drifted?): $line" }
            content = content.replace(line + "\n", "")
        }
        val anyConst = Regex("^export declare const (\\w+): any;$", RegexOption.MULTILINE)
        content = anyConst.replace(content) { m ->
            val name = m.groupValues[1]
            val type = dtsConstTypes[name]
                ?: error("any-typed export '$name' has no entry in dtsConstTypes — type it deliberately")
            "export declare const $name: $type;"
        }
        require(!content.contains(": any;")) {
            "untyped declarations remain in tax-ca.d.ts:\n" +
                content.lines().filter { it.contains(": any;") }.joinToString("\n")
        }
        dts.writeText(content + "\n" + file("dts/overlay.d.ts").readText())
    }
}

// Assemble the npm payload into dist/: the shipped @equisoft/tax-ca package keeps its
// root package.json identity (name, license, README) and the existing CI publish flow;
// only dist/ contents switch from tsc output to the Kotlin/JS build.
val assembleNpmDist by tasks.registering(Copy::class) {
    dependsOn("jsNodeProductionLibraryDistribution")
    from(layout.buildDirectory.dir("dist/js/productionLibrary")) {
        exclude("package.json") // root package.json is the package identity
    }
    into(layout.projectDirectory.dir("dist"))
    doLast {
        val dist = layout.projectDirectory.dir("dist").asFile
        dist.resolve("index.js").writeText("module.exports = require('./tax-ca.js');\n")
        dist.resolve("index.d.ts").writeText("export * from './tax-ca';\n")
        // Deep-import shim: fna-engine imports @equisoft/tax-ca/dist/misc/code-types
        // (18 call sites) — keep that path alive (decision D5).
        val misc = dist.resolve("misc").apply { mkdirs() }
        misc.resolve("code-types.js").writeText("module.exports = require('../index.js');\n")
        misc.resolve("code-types.d.ts").writeText(
            "export { PROVINCIAL_CODES, FEDERAL_CODE } from '../index';\n" +
                "export type { ProvinceCode, FederalCode, FederalName, ProvinceName, ByProvince, ByJurisdiction } from '../index';\n",
        )
    }
}

publishing {
    publications.withType<MavenPublication>().configureEach {
        pom {
            name.set("tax-ca")
            description.set("Canadian tax data and calculation functions.")
            url.set("https://github.com/kronostechnologies/tax-ca")
            licenses {
                license {
                    name.set("LGPL-3.0-only")
                    url.set("https://www.gnu.org/licenses/lgpl-3.0.html")
                }
            }
        }
    }
    repositories {
        // Registry coordinates are decision D4 (docs/kmp-migration/phase-0-decisions.md);
        // CI provides the environment. Absent env vars = local-only publishing
        // (publishToMavenLocal still works).
        val repositoryUrl = System.getenv("MAVEN_REPOSITORY_URL")
        if (repositoryUrl != null) {
            maven {
                name = "internal"
                url = uri(repositoryUrl)
                credentials {
                    username = System.getenv("MAVEN_REPOSITORY_USERNAME")
                    password = System.getenv("MAVEN_REPOSITORY_PASSWORD")
                }
            }
        }
    }
}
