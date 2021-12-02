import { basicAuth } from './basic';

test('basic auth passes', () => {
  const authString = Buffer.from('testUsername:testPassword').toString('base64');
  const headers = new Map([['Authorization', authString]]);
  expect(basicAuth(headers, 'testUsername', 'testPassword')).toBe(true);
});

test('basic auth fails', () => {
  const authString = Buffer.from('testUsername:testPassword1').toString('base64');
  const headers = new Map([['Authorization', authString]]);
  expect(basicAuth(headers, 'testUsername', 'testPassword')).toBe(false);
});
