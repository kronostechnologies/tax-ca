plugins {
    kotlin("multiplatform") version "2.3.21"
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

// Hand-maintained TypeScript declaration overlay:
// 1. dts/overlay.d.ts is APPENDED to the generated definitions (external-interface input
//    types, literal unions, mapped types the Kotlin compiler cannot express).
// 2. dtsPatches retypes specific generated declarations (dynamic -> any, String vs
//    literal unions) with exact-match replacements. A missing match fails the build so
//    Kotlin-compiler output drift is caught instead of silently shipping `any`.
val dtsPatches = mapOf(
    "export declare const FEDERAL_CODE: string;"
        to "export declare const FEDERAL_CODE: FederalCode;",
    "export declare const PROVINCIAL_CODES: any;"
        to "export declare const PROVINCIAL_CODES: { [key in ProvinceName]: ProvinceCode };",
    "export declare const CONSUMER_PRICE_INDEX: any;"
        to "export declare const CONSUMER_PRICE_INDEX: { [year: number]: { [month: string]: number } };",
    "export declare const province1MaxWithdrawalPct: any;"
        to "export declare const province1MaxWithdrawalPct: MaxWithdrawalPctByAge;",
    "export declare const province2MaxWithdrawalPct: any;"
        to "export declare const province2MaxWithdrawalPct: MaxWithdrawalPctByAge;",
    "export declare const othersMaxWithdrawalPct: any;"
        to "export declare const othersMaxWithdrawalPct: MaxWithdrawalPctByAge;",
    "export declare const federalMaxWithdrawalPct: any;"
        to "export declare const federalMaxWithdrawalPct: MaxWithdrawalPctByAge;",
    "    get MIN_WITHDRAWAL_PCT(): any;"
        to "    get MIN_WITHDRAWAL_PCT(): MaxWithdrawalPctByAge;",
    "    get MALE(): any;"
        to "    get MALE(): IndividualLifeExpectancy;",
    "    get FEMALE(): any;"
        to "    get FEMALE(): IndividualLifeExpectancy;",
    "    get MAX_INCOME(): any;"
        to "    get MAX_INCOME(): NumberByYear;",
    "    get TuitionFeesData(): any;"
        to "    get TuitionFeesData(): ByProvince<number>;",
    "    get BASIC_PERSONAL_AMOUNT(): any;"
        to "    get BASIC_PERSONAL_AMOUNT(): number | { MIN: number; MAX: number };",
)

tasks.named("jsNodeProductionLibraryDistribution") {
    inputs.file("dts/overlay.d.ts")
    doLast {
        val dts = layout.buildDirectory.file("dist/js/productionLibrary/tax-ca.d.ts").get().asFile
        var content = dts.readText()
        for ((from, into) in dtsPatches) {
            require(content.contains(from)) {
                "d.ts patch target not found (generator output drifted?): $from"
            }
            content = content.replace(from, into)
        }
        dts.writeText(content + "\n" + file("dts/overlay.d.ts").readText())
    }
}
