declare module "node-mocks-http" {
    import { IncomingMessage, ServerResponse } from "http";
  
    export function createMocks<TReq = IncomingMessage, TRes = ServerResponse>(
      options?: {
        method?: string;
        url?: string;
        headers?: Record<string, string>;
        body?: unknown;
      }
    ): { req: TReq; res: TRes };
  
    export interface MockResponse<T = unknown> extends ServerResponse {
      _getJSONData(): T;
      _getData(): string;
      _getStatusCode(): number;
    }
  }
  