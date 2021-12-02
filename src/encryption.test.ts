import { encrypt, decrypt } from './encryption';

const VALUE = 'Test Value';
const SECRET = 'Test1234';

describe('encryption & decryption works', () => {
  it('encrypts properly', async () => {
    const encrypted = await encrypt(VALUE, SECRET);
    expect(encrypted).toEqual(expect.stringContaining('='));
  });

  it('decrypts properly', async () => {
    const encrypted = await encrypt(VALUE, SECRET);
    const decrypted = await decrypt(encrypted, SECRET);
    expect(decrypted).toBe(VALUE);
  });

  it('fails to decrypt with wrong secret', async () => {
    const encrypted = await encrypt(VALUE, SECRET);
    const decrypted = await decrypt(encrypted, 'Wrong Secret');
    expect(decrypted).not.toBe(encrypted);
  });
});
