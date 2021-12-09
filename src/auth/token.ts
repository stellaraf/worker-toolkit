import jwt from 'jsonwebtoken';
import { isToken } from './util';
import { TokenError } from '../errors';

import type { SignOptions } from 'jsonwebtoken';
import type { JWTPayload } from './types';

export interface Payload {
  iss: string;
  sub: string;
  aud: string;
}

/**
 * Create a JWT token.
 *
 * @param payload JWT Payload.
 * @param key JWT Secret/Key.
 * @param expireIn Number of seconds in which key expires (default `300`).
 * @returns JWT token string.
 */
export function createToken<P extends Payload>(
  payload: P,
  key: string,
  expireIn: number = 300,
  options: SignOptions = {},
): string {
  const now = new Date();
  now.setSeconds(now.getSeconds() + expireIn);

  const extended = {
    exp: now.getTime() / 1000,
    ...payload,
  };
  return jwt.sign(extended, key, options);
}

/**
 * Verify a JWT token string.
 */
export function verifyToken<P extends JWTPayload>(token: string, key: string): P {
  try {
    const verified = jwt.verify(token, key);
    if (isToken<P>(verified)) {
      return verified;
    }
    throw new TokenError('Token was valid, but token payload was invalid', 400);
  } catch (data) {
    if (data instanceof Error) {
      throw new TokenError('Authentication failed', 401);
    }
    throw new TokenError('Error verifying authentication token', 401);
  }
}
