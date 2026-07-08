/**
 * Cross-cutting primitive types shared by multiple node configurations.
 */

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
export type HttpMethod = (typeof HTTP_METHODS)[number];

/** A single editable request header row in the properties panel. */
export type HeaderPair = {
  id: string;
  key: string;
  value: string;
};

export const AUTH_TYPES = ['none', 'bearer', 'basic', 'apiKey'] as const;
export type AuthType = (typeof AUTH_TYPES)[number];

/** Authentication settings for API-style nodes (discriminated by `type`). */
export type AuthConfig =
  | { type: 'none' }
  | { type: 'bearer'; token: string }
  | { type: 'basic'; username: string; password: string }
  | { type: 'apiKey'; key: string; value: string };
