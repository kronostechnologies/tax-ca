# ts-compat — npm TypeScript surface check

Run `yarn compat` after `yarn build` to compile the strict-TypeScript consumer
surface check.

## `smoke.ts` — type-level check

A strict-TypeScript compile check (`tsc -p ts-compat`) of the **real consumers' import
surface**: every symbol fna-engine and kronos-fna import, used in type positions the way
their code uses them (literal `ProvinceCode` unions, `ByProvince<T>` mapped types,
object shapes). If the shipped declarations regress, this fails before any consumer sees it.

Tax data and calculation behavior are tested by `src/commonTest` on both JVM and Node;
JVM-specific behavior is tested in `src/jvmTest`. The migration-only deep parity
snapshot has been removed so intentional tax-data revisions do not require updating a
frozen copy of every export and function result.
