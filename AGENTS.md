# AGENTS.md

## Cursor Cloud specific instructions

### Repository status

This is a blank Node.js-oriented repository (based on `.gitignore`). It contains no source code, no `package.json`, and no application yet.

### Available tooling

- **Node.js**: v22 (managed via nvm)
- **Package managers**: npm, pnpm, yarn are all available
- **No dependencies to install** until a `package.json` is added

### Development workflow

Once the project has source code:
1. Install dependencies using the package manager matching the lockfile (`package-lock.json` → npm, `yarn.lock` → yarn, `pnpm-lock.yaml` → pnpm)
2. Check `package.json` scripts for `dev`, `lint`, `test`, and `build` commands
3. Update the VM update script accordingly via `SetupVmEnvironment`
