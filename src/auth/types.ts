export interface JWTPayload {
  /**
   * Issuer.
   */
  iss: string;

  /**
   * Subject.
   */
  sub: string;

  /**
   * Audience.
   */
  aud: string;

  /**
   * Expiry timestamp.
   */
  exp: number;

  /**
   * Issued at timestamp.
   */
  iat: number;
}
export type { SupportedAlgorithms as JWTAlgorithms } from 'njwt';
