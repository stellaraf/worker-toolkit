/**
 * Perform basic authentication of a request's headers.
 *
 * @param headers Request headers.
 * @param username Username to expect.
 * @param password Password to expect.
 */
export function basicAuth(
  headers: Map<string, string> | Headers,
  username: string,
  password: string,
): boolean {
  let authorization = headers.get('Authorization');
  if (authorization === null) {
    authorization = headers.get('authorization');
  }
  if (authorization !== null && typeof authorization !== 'undefined') {
    const encodedPair = authorization.replace(/^Basic /gi, '');
    const [usernameIn, passwordIn] = Buffer.from(encodedPair, 'base64').toString().split(':');
    return usernameIn === username && passwordIn === password;
  }
  return false;
}
