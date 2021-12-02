import { createToken, verifyToken } from './token';

describe('create and verify a JWT token', () => {
  const token = createToken({ iss: 'test', aud: 'test', sub: 'test' }, 'test');

  it('creates token', () => {
    expect(token).toEqual(expect.stringContaining('.'));
  });

  it('passes token verification', () => {
    expect(verifyToken(token, 'test')).toBeTruthy();
  });

  it('fails token verification', () => {
    expect(() => verifyToken(token, 'wrong')).toThrow();
  });
});
