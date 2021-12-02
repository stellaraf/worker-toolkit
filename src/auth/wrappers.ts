import { isResponseWithSentry } from '../router/util';
import { verifyToken } from './token';
import { InvalidRequestError } from '../errors';

import type { Handler, ServerResponse, Params, ServerRequest } from '../router/types';

/**
 * Wrap a standard handler with authentication. Handler is only executed if authentication
 * succeeds.
 */
export function withTokenAuth<
  P extends Params = Params,
  Res extends ServerResponse = ServerResponse,
  Req extends ServerRequest<P> = ServerRequest<P>,
>(handler: Handler<P, Res, Req>, key: string): Handler<P, Res, Req> {
  const wrapped: Handler<P, Res, Req> = async (request, response) => {
    let token = request.headers.get('Authorization');
    if (token === null) {
      token = request.headers.get('authorization');
    }
    if (token === null) {
      if (isResponseWithSentry(response)) {
        response.sentry.captureMessage('Missing Authorization header', 'warning');
      }
      throw new InvalidRequestError('Missing Authorization header', 400);
    }
    verifyToken(token.trim(), key);
    return await handler(request, response);
  };
  return wrapped;
}
