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
