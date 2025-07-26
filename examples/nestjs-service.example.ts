// NestJS Service Example

import { Injectable, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  type User as ZitadelApiUser,
  TextQueryMethod,
  UserState,
  type SearchQuery
} from '@ragnaraven/zitadel-node-dual';

interface ZitadelConfig {
  apiEndpoint: string;
  serviceAccountToken: string;
}

interface UserSearchFilters {
  email?: string;
  state?: UserState;
  displayName?: string;
  limit?: number;
}

@Injectable()
export class ZitadelService implements OnModuleInit {
  private readonly logger = new Logger(ZitadelService.name);
  private authClient!: AuthServiceClient;
  private managementClient!: ManagementServiceClient;
  private userClient!: UserServiceClient;
  private config!: ZitadelConfig;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    try {
      // Initialize Zitadel configuration from environment
      this.config = {
        apiEndpoint: this.configService.getOrThrow<string>('ZITADEL_API_ENDPOINT'),
        serviceAccountToken: this.configService.getOrThrow<string>('ZITADEL_SERVICE_ACCOUNT_TOKEN')
      };

      // Create interceptor for service account authentication
      const interceptor = createAccessTokenInterceptor(this.config.serviceAccountToken);

      // Initialize all clients
      this.authClient = createAuthClient(this.config.apiEndpoint, interceptor);
      this.managementClient = createManagementClient(this.config.apiEndpoint, interceptor);
      this.userClient = createUserClient(this.config.apiEndpoint, interceptor);

      this.logger.log('Zitadel service initialized successfully');
      
      // Optional: Test connection on startup
      await this.healthCheck();
    } catch (error) {
      this.logger.error('Failed to initialize Zitadel service', error);
      throw error;
    }
  }

  /**
   * Create a user-specific client using their access token
   */
  createUserClients(userAccessToken: string) {
    const interceptor = createAccessTokenInterceptor(userAccessToken);
    
    return {
      authClient: createAuthClient(this.config.apiEndpoint, interceptor),
      managementClient: createManagementClient(this.config.apiEndpoint, interceptor),
      userClient: createUserClient(this.config.apiEndpoint, interceptor)
    };
  }

  /**
   * Get current user information using their access token
   */
  async getCurrentUser(userAccessToken: string): Promise<GetMyUserResponse> {
    try {
      const { authClient } = this.createUserClients(userAccessToken);
      const response = await authClient.getMyUser({});
      
      this.logger.debug(`Retrieved user: ${response.user?.human?.profile?.displayName || 'Unknown'}`);
      return response;
    } catch (error) {
      this.logger.error('Failed to get current user', error);
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  /**
   * Search users with type-safe filters
   */
  async searchUsers(filters: UserSearchFilters): Promise<ZitadelApiUser[]> {
    const queries: SearchQuery[] = [];

    // Build type-safe queries
    if (filters.email) {
      queries.push({
        emailQuery: {
          emailAddress: filters.email,
          method: TextQueryMethod.TEXT_QUERY_METHOD_CONTAINS
        }
      });
    }

    if (filters.state) {
      queries.push({
        stateQuery: {
          state: filters.state
        }
      });
    }

    if (filters.displayName) {
      queries.push({
        displayNameQuery: {
          displayName: filters.displayName,
          method: TextQueryMethod.TEXT_QUERY_METHOD_CONTAINS
        }
      });
    }

    try {
      const response = await this.managementClient.listUsers({
        queries,
        ...(filters.limit && { 
          query: { 
            limit: BigInt(filters.limit) 
          } 
        })
      });

      this.logger.debug(`Found ${response.result?.length || 0} users matching filters`);
      return response.result || [];
    } catch (error) {
      this.logger.error('Failed to search users', error);
      throw error;
    }
  }

  /**
   * Get all active users
   */
  async getActiveUsers(limit = 50): Promise<ZitadelApiUser[]> {
    return this.searchUsers({
      state: UserState.USER_STATE_ACTIVE,
      limit
    });
  }

  /**
   * Find user by email address
   */
  async findUserByEmail(email: string): Promise<ZitadelApiUser | null> {
    try {
      const users = await this.searchUsers({ 
        email,
        limit: 1 
      });
      
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      this.logger.error(`Failed to find user by email: ${email}`, error);
      throw error;
    }
  }

  /**
   * Validate user access token and return user info
   */
  async validateUserToken(accessToken: string): Promise<ZitadelApiUser> {
    try {
      const response = await this.getCurrentUser(accessToken);
      
      if (!response.user) {
        throw new UnauthorizedException('No user found for access token');
      }

      return response.user;
    } catch (error) {
      this.logger.error('Token validation failed', error);
      throw new UnauthorizedException('Invalid access token');
    }
  }

  /**
   * Health check for monitoring
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Test management client with a simple query
      await this.managementClient.listUsers({
        queries: [{
          stateQuery: {
            state: UserState.USER_STATE_ACTIVE
          }
        }],
        query: { limit: BigInt(1) }
      });

      this.logger.debug('Zitadel health check passed');
      return true;
    } catch (error) {
      this.logger.error('Zitadel health check failed', error);
      return false;
    }
  }
}

// Example controller to show usage
export class ZitadelController {
  constructor(private readonly zitadelService: ZitadelService) {}

  async getProfile(userAccessToken: string) {
    const user = await this.zitadelService.getCurrentUser(userAccessToken);
    
    return {
      id: user.user?.id,
      displayName: user.user?.human?.profile?.displayName,
      email: user.user?.human?.email,
      preferredLanguage: user.user?.human?.profile?.preferredLanguage
    };
  }

  async searchUsers(query: string) {
    return this.zitadelService.searchUsers({
      email: query,
      displayName: query,
      state: UserState.USER_STATE_ACTIVE,
      limit: 20
    });
  }

  async healthCheck() {
    const isHealthy = await this.zitadelService.healthCheck();
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'zitadel'
    };
  }
}

// Module configuration example
export const ZitadelModule = {
  imports: [
    // ConfigModule would be imported here
  ],
  providers: [ZitadelService],
  exports: [ZitadelService]
};

export { ZitadelService, ZitadelController, type ZitadelConfig, type UserSearchFilters }; 