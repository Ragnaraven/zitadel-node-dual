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

### Examples

Check out the TypeScript examples in the `/examples` folder:

- **`api-example.ts`** - Basic TypeScript example showing import usage
- **`nestjs-service.example.ts`** - NestJS service implementation example

### Basic Usage in NestJS

First, create a types file to import the specific types you need:

```typescript
// src/zitadel/types/zitadel.types.ts
// Import specific types from the built package
export type {
  Metadata
} from '@ragnaraven/zitadel-node-dual/dist/types/api/generated/zitadel/metadata.js';

export type {
  TextQueryMethod,
  ListQuery,
  ListDetails,
  ObjectDetails
} from '@ragnaraven/zitadel-node-dual/dist/types/api/generated/zitadel/object.js';

export type {
  RoleQuery,
  RoleKeyQuery,
  RoleDisplayNameQuery,
  Role
} from '@ragnaraven/zitadel-node-dual/dist/types/api/generated/zitadel/project.js';

export type { 
  Type,
  UserGrantQuery,
  UserState,
  SearchQuery,
  UserFieldName,
  EmailQuery,
  OrQuery,
  AndQuery,
  UserGrant,
  User as ZitadelApiUser,
  Human,
  Machine
} from '@ragnaraven/zitadel-node-dual/dist/types/api/generated/zitadel/user.js';
```

Then use it in your service:

```typescript
// src/zitadel/services/zitadel.service.ts
import { Injectable } from '@nestjs/common';
import { 
  createAccessTokenInterceptor,
  createAuthClient,
  createManagementClient,
  createUserClient,
  type AuthServiceClient,
  type ManagementServiceClient,
  type UserServiceClient,
  TextQueryMethod,
  Type,
  UserState
} from '@ragnaraven/zitadel-node-dual';

// Import your custom types
import type { 
  RoleQuery, 
  UserGrant, 
  ZitadelApiUser 
} from '../types/zitadel.types';

@Injectable()
export class ZitadelService {
  private authClient: AuthServiceClient;
  private managementClient: ManagementServiceClient;
  private userClient: UserServiceClient;

  constructor() {
    // Initialize clients
    this.initializeClients();
  }

  private async initializeClients() {
    const apiEndpoint = 'https://your-zitadel-instance.com';
    const accessToken = 'your-access-token';
    const interceptor = createAccessTokenInterceptor(accessToken);
    
    this.authClient = createAuthClient(apiEndpoint, interceptor);
    this.managementClient = createManagementClient(apiEndpoint, interceptor);
    this.userClient = createUserClient(apiEndpoint, interceptor);
  }

  async findRolesByQuery(roleQuery: RoleQuery): Promise<any> {
    // Use the imported types and enums
    const query = {
      ...roleQuery,
      method: TextQueryMethod.TEXT_QUERY_METHOD_CONTAINS
    };
    
    // Make API call using the clients
    return this.managementClient.listProjectRoles({
      projectId: 'your-project-id',
      queries: [query]
    });
  }

  async getUsersByType(userType: Type): Promise<ZitadelApiUser[]> {
    const response = await this.managementClient.listUsers({
      queries: [{
        typeQuery: {
          type: userType
        }
      }]
    });
    
    return response.result || [];
  }
}
```

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

### Examples and Testing

The `/examples` folder contains TypeScript examples demonstrating:
- ✅ Import syntax usage in both CommonJS and ES Module environments
- ✅ Type safety and IntelliSense support
- ✅ NestJS service integration patterns
- ✅ Error handling and API usage

Run the examples:
```bash
# Install dependencies in examples folder
cd examples && npm install

# Run the API example (requires ts-node)
npx ts-node api-example.ts
```

## Contributing

For issues specific to this fork, please open issues in this repository.

For general ZITADEL Node.js SDK issues, please refer to the [original repository](https://github.com/smartive/zitadel-node).
