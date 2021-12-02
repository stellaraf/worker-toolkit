import type { JWTPayload } from './types';

export function isToken<P extends JWTPayload>(token: unknown): token is P {
  if (typeof token === 'object' && token !== null && !Array.isArray(token)) {
    return 'iss' in token && 'sub' in token && 'aud' in token && 'exp' in token && 'iat' in token;
  }
  return false;
}
