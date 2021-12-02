import { isToken } from './util';

describe('token type guard', () => {
  it('is a token', () => {
    expect(isToken({ iss: 'test', sub: 'test', aud: 'test', exp: 1000, iat: 1000 })).toBe(true);
  });

  it('is an array, not a token', () => {
    expect(isToken([1, 2, 3])).toBe(false);
  });

  it('is a string, not a token', () => {
    expect(isToken('token')).toBe(false);
  });

  it('is a number, not a token', () => {
    expect(isToken(1234)).toBe(false);
  });

  it('is a boolean, not a token', () => {
    expect(isToken(true)).toBe(false);
  });

  it('is an object, but not a token', () => {
    expect(isToken({ one: 1, two: 2, three: 'three', four: [1, 2, 3, 4] })).toBe(false);
  });
});
