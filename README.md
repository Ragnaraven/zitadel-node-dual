# ZITADEL Node.js (Import Compatibility Fork)

> **Note**: This is a fork of the original [ZITADEL Node.js SDK](https://github.com/smartive/zitadel-node) that enables **ES import syntax** in environments that require it, including NestJS and other CommonJS-based applications.

This library contains the compiled and generated [gRPC](https://grpc.io/) service clients for the ZITADEL API, packaged to work with `import` syntax in TypeScript environments.

## Fork Features

- ✅ **ES Import Support**: Use `import` statements in CommonJS environments like NestJS
- ✅ **Dual Package**: Compatible with both CommonJS and ES Module environments
- ✅ **TypeScript Support**: Full type definitions and IntelliSense
- ✅ **Drop-in Replacement**: Same API as the original package

## Usage

### Installation

```bash
npm install @ragnaraven/zitadel-node-dual
# or
pnpm add @ragnaraven/zitadel-node-dual
```

### Quick Start

See the [`/examples`](./examples) folder for complete usage examples:

- **[`api-example.ts`](./examples/api-example.ts)** - Basic API usage
- **[`nestjs-service.example.ts`](./examples/nestjs-service.example.ts)** - NestJS integration

## Original Documentation

For complete documentation, API reference, and additional examples, please refer to the **[original ZITADEL Node.js SDK repository](https://github.com/smartive/zitadel-node)**.

This fork maintains full compatibility with the original API while adding import syntax support for CommonJS environments.

## Goals

This fork extends the original goals to include:

- ✅ Provide compiled proto clients (original)
- ✅ Manage resources via proto clients (original)  
- ✅ Allow authentication of a service account (original)
- **✅ Support ES import syntax in CommonJS environments**
- **✅ Maintain compatibility across module systems**

## Development

This fork follows the same development process as the original:

1. Clone this repository
2. Install the dependencies with `npm install`
3. Install the submodules with `git submodule update --init --recursive`
4. Generate the gRPC types with `npm run build:grpc`
5. Build dual packages with `npm run build:dual`

### Windows Development

If you're developing on Windows, use the Windows-specific build command:

```bash
npm run build:windows
```

This uses `buf.gen.windows.yaml` which includes the Windows-specific `.cmd` path for `protoc-gen-ts_proto`. The standard `npm run build` command may fail on Windows due to cross-platform path resolution issues with the buf generate process.

**Windows Commands:**
- `npm run build:windows` - Full build with Windows-compatible gRPC generation
- `npm run build:grpc:windows` - Just the gRPC generation step for Windows
- `npm run build:dual` - Just the TypeScript compilation (works cross-platform)

The dual build process creates:
- `dist/cjs/` - CommonJS build
- `dist/esm/` - ES Module build  
- `dist/types/` - TypeScript declarations

### Testing

Run the test suite:
```bash
npm test
```

Tests cover client creation, API calls, and authentication flows across both CommonJS and ES Module environments.

## Contributing

For issues specific to this fork, please open issues in this repository.

For general ZITADEL Node.js SDK issues, please refer to the [original repository](https://github.com/smartive/zitadel-node).
