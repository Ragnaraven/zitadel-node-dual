// Comprehensive TypeScript Example
// This demonstrates using @ragnaraven/zitadel-node-dual with modern ES imports
// 🎯 SAME SYNTAX WORKS IN BOTH CommonJS AND ES Module environments!

import {
  createAccessTokenInterceptor,
  createAuthClient,
  createManagementClient,
  createUserClient,
  type AuthServiceClient,
  type ManagementServiceClient,
  type UserServiceClient,
  type GetMyUserResponse,
  type ListUsersResponse,
  type ListProjectRolesResponse,
  TextQueryMethod,
  UserState,
  type SearchQuery,
  type RoleQuery
} from '@ragnaraven/zitadel-node-dual';

const apiEndpoint = 'https://your-zitadel-instance.com';
const personalAccessToken = 'your-personal-access-token';

interface ZitadelConfig {
  endpoint: string;
  token: string;
}

class AdvancedZitadelClient {
  private authClient: AuthServiceClient;
  private managementClient: ManagementServiceClient;
  private userClient: UserServiceClient;
  private config: ZitadelConfig;

  constructor(config: ZitadelConfig) {
    this.config = config;
    const interceptor = createAccessTokenInterceptor(config.token);
    
    this.authClient = createAuthClient(config.endpoint, interceptor);
    this.managementClient = createManagementClient(config.endpoint, interceptor);
    this.userClient = createUserClient(config.endpoint, interceptor);
  }

  // Get current user with detailed error handling and typing
  async getCurrentUser(): Promise<GetMyUserResponse> {
    try {
      const response = await this.authClient.getMyUser({});
      
      if (response.user?.human?.profile) {
        const profile = response.user.human.profile;
        console.log(`✅ Current user: ${profile.displayName} (${profile.preferredLanguage})`);
      } else if (response.user?.machine) {
        console.log(`🤖 Machine user: ${response.user.machine.name}`);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error fetching current user:', error);
      throw error;
    }
  }

  // Advanced user search with multiple filters
  async searchUsers(filters: {
    email?: string;
    state?: UserState;
    displayName?: string;
  }): Promise<ListUsersResponse> {
    const queries: SearchQuery[] = [];

    // Add email filter if provided
    if (filters.email) {
      queries.push({
        emailQuery: {
          emailAddress: filters.email,
          method: TextQueryMethod.TEXT_QUERY_METHOD_CONTAINS
        }
      });
    }

    // Add state filter if provided
    if (filters.state) {
      queries.push({
        stateQuery: {
          state: filters.state
        }
      });
    }

    // Add display name filter if provided
    if (filters.displayName) {
      queries.push({
        displayNameQuery: {
          displayName: filters.displayName,
          method: TextQueryMethod.TEXT_QUERY_METHOD_CONTAINS
        }
      });
    }

    try {
      const response = await this.managementClient.listUsers({ queries });
      
      console.log(`🔍 Found ${response.result?.length || 0} users matching filters:`, filters);
      response.result?.forEach((user, index) => {
        const name = user.human?.profile?.displayName || user.machine?.name || 'Unknown';
        console.log(`  ${index + 1}. ${name} (${user.id})`);
      });
      
      return response;
    } catch (error) {
      console.error('❌ Error searching users:', error);
      throw error;
    }
  }

  // Get project roles with type-safe queries
  async getProjectRoles(projectId: string, roleName?: string): Promise<ListProjectRolesResponse> {
    const queries: RoleQuery[] = [];

    if (roleName) {
      queries.push({
        keyQuery: {
          key: roleName,
          method: TextQueryMethod.TEXT_QUERY_METHOD_CONTAINS
        }
      });
    }

    try {
      const response = await this.managementClient.listProjectRoles({
        projectId,
        queries
      });

      console.log(`📋 Found ${response.result?.length || 0} roles in project ${projectId}`);
      response.result?.forEach((role, index) => {
        console.log(`  ${index + 1}. ${role.key} - ${role.displayName}`);
      });

      return response;
    } catch (error) {
      console.error('❌ Error fetching project roles:', error);
      throw error;
    }
  }

  // Comprehensive health check
  async healthCheck(): Promise<boolean> {
    try {
      console.log('🏥 Running Zitadel API health check...');
      
      // Test auth client
      await this.getCurrentUser();
      console.log('✅ Auth client: OK');
      
      // Test management client
      await this.searchUsers({ state: UserState.USER_STATE_ACTIVE });
      console.log('✅ Management client: OK');
      
      console.log('🎉 All clients healthy!');
      return true;
    } catch (error) {
      console.error('💥 Health check failed:', error);
      return false;
    }
  }
}

// Demonstrate usage
async function main(): Promise<void> {
  try {
    const config: ZitadelConfig = {
      endpoint: apiEndpoint,
      token: personalAccessToken
    };

    const client = new AdvancedZitadelClient(config);
    
    console.log('🚀 Starting comprehensive TypeScript example...');
    console.log('🎯 This SAME syntax works in both CommonJS AND ES Module environments!');
    
    // Run health check
    const isHealthy = await client.healthCheck();
    if (!isHealthy) {
      throw new Error('API health check failed');
    }

    // Demonstrate advanced features
    await client.searchUsers({
      state: UserState.USER_STATE_ACTIVE,
      email: '@example.com'
    });

    // Example project role query (replace with real project ID)
    // await client.getProjectRoles('your-project-id', 'admin');
    
    console.log('✅ Comprehensive example completed successfully');
    console.log('🎯 No more require() - modern imports everywhere thanks to dual package support!');
  } catch (error) {
    console.error('❌ Example failed:', error);
    process.exit(1);
  }
}

// Export everything for use as a module
export { AdvancedZitadelClient, type ZitadelConfig, main };

// Run if called directly  
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 