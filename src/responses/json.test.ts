import { JSONResponse } from './json';

describe('JSON response is valid', () => {
  const response = JSONResponse(
    { array: [1, 2, 3], string: 'string', number: 1, boolean: true, null: null },
    200,
  );
  it('is a response', () => {
    expect(response instanceof Response).toBe(true);
  });

  it('has correct headers', () => {
    expect(response.headers.get('content-type')).toBe('application/json');
  });

  it('has correct status code', () => {
    expect(response.status).toBe(200);
  });

  it('has correct body', async () => {
    const body = await response.json();
    expect(Array.isArray(body.array)).toBe(true);
    expect(typeof body.string === 'string').toBe(true);
    expect(typeof body.number === 'number').toBe(true);
    expect(typeof body.boolean === 'boolean').toBe(true);
    expect(body.null === null).toBe(true);
    expect(typeof body.notAThing === 'undefined').toBe(true);
  });
});
