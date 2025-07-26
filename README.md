# ZITADEL Node.js (CJS/ESM Fork)

> **Note**: This is a fork of the original [ZITADEL Node.js SDK](https://github.com/smartive/zitadel-node) that adds **CommonJS (CJS) support** alongside the original ES Module (ESM) support. This enables usage in CommonJS environments like NestJS.

This library contains the compiled and generated [gRPC](https://grpc.io/) service clients for the ZITADEL API with dual package support for both CommonJS and ES Modules.

## Fork Features

- ✅ **Dual Package Support**: Works with both CommonJS (`require()`) and ES Modules (`import`)
- ✅ **NestJS Compatible**: Can be used directly in NestJS applications without module compatibility issues
- ✅ **Type Safety**: Full TypeScript support for both module systems
- ✅ **Windows Compatible**: Includes Windows-compatible build configuration

## Usage in CommonJS/NestJS

### Installation

```bash
npm install @ragnaraven/zitadel-node
# or
pnpm add @ragnaraven/zitadel-node
```

### Basic Usage in NestJS

First, create a types file to import the specific types you need:

```typescript
// src/zitadel/types/zitadel.types.ts
// Import specific types from the built package
export type {
  Metadata
} from '@ragnaraven/zitadel-node/dist/types/api/generated/zitadel/metadata.js';

export type {
  TextQueryMethod,
  ListQuery,
  ListDetails,
  ObjectDetails
} from '@ragnaraven/zitadel-node/dist/types/api/generated/zitadel/object.js';

export type {
  RoleQuery,
  RoleKeyQuery,
  RoleDisplayNameQuery,
  Role
} from '@ragnaraven/zitadel-node/dist/types/api/generated/zitadel/project.js';

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
} from '@ragnaraven/zitadel-node/dist/types/api/generated/zitadel/user.js';
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
} from '@ragnaraven/zitadel-node';

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

This fork maintains full compatibility with the original API while adding CommonJS support.

## Goals

This fork extends the original goals to include:

- ✅ Provide compiled proto clients (original)
- ✅ Manage resources via proto clients (original)
- ✅ Allow authentication of a service account (original)
- **✅ Support both CommonJS and ES Module environments**
- **✅ Enable usage in NestJS and other CommonJS-based frameworks**

## Development

This fork follows the same development process as the original:

1. Clone this repository
2. Install the dependencies with `npm install`
3. Install the submodules with `git submodule update --init --recursive`
4. Generate the gRPC types with `npm run build:grpc`
5. Build dual packages with `npm run build:dual`

The dual build process creates:
- `dist/cjs/` - CommonJS build
- `dist/esm/` - ES Module build  
- `dist/types/` - TypeScript declarations

## Contributing

For issues specific to this CommonJS fork, please open issues in this repository.

For general ZITADEL Node.js SDK issues, please refer to the [original repository](https://github.com/smartive/zitadel-node).
