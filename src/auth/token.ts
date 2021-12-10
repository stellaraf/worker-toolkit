import { create, verify } from 'njwt';
import { isToken } from './util';
import { TokenError } from '../errors';

import type { SupportedAlgorithms } from 'njwt';
import type { JWTPayload } from './types';

export type Payload = {
  iss: string;
  sub: string;
  aud: string;
};

/**
 * Create a JWT token.
 *
 * @param payload JWT Payload.
 * @param key JWT Secret/Key.
 * @param expireIn Number of seconds in which key expires (default `300`).
 * @param algorithm JWT signing algorithm.
 * @returns JWT token string.
 */
export function createToken<P extends Payload>(
  payload: P,
  key: string,
  expireIn: number = 300,
  algorithm: SupportedAlgorithms = 'HS256',
): string {
  const now = new Date();
  now.setSeconds(now.getSeconds() + expireIn);

  const extended = {
    exp: now.getTime() / 1000,
    ...payload,
  };

  return create(extended, key, algorithm).compact();
}

/**
 * Verify a JWT token string.
 *
 * @param token JWT token string.
 * @param key Signing key.
 */
export function verifyToken<P extends JWTPayload>(token: string, key: string): P {
  try {
    const { body } = verify(token, key) ?? {};
    if (isToken<P>(body)) {
      return body;
    }
    throw new TokenError('Token was valid, but token payload was invalid', 400);
  } catch (data) {
    if (data instanceof Error) {
      throw new TokenError('Authentication failed', 401);
    }
    throw new TokenError('Error verifying authentication token', 401);
  }
}
