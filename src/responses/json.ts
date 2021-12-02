/**
 * Create a JSON response with proper headers.
 *
 * @param data Any JSON-able Data.
 * @param status HTTP Status Code.
 */
export function JSONResponse<T>(data: T, status: number, other?: Omit<ResponseInit, 'status'>) {
  const body = JSON.stringify(data);
  const headers = new Headers({ 'content-type': 'application/json' });
  const init = { status, headers, ...other };
  return new Response(body, init);
}
