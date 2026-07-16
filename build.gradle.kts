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

// Append the hand-maintained declaration overlay (dts/overlay.d.ts) to the generated
// TypeScript definitions: Kotlin `external interface` input types are referenced by the
// generated d.ts but not emitted, and legacy-exact types (literal unions, etc.) can only
// be expressed by hand.
tasks.named("jsNodeProductionLibraryDistribution") {
    inputs.file("dts/overlay.d.ts")
    doLast {
        val dts = layout.buildDirectory.file("dist/js/productionLibrary/tax-ca.d.ts").get().asFile
        dts.appendText("\n" + file("dts/overlay.d.ts").readText())
    }
}
