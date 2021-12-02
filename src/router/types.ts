import type { Promisable } from 'worktop';
import type { ServerResponse as WorktopServerResponse } from 'worktop/response';
import type { Params, ServerRequest } from 'worktop/request';
import type { WorkerError } from '../errors';

export interface ServerResponse extends WorktopServerResponse {
  error?: WorkerError;
}

export interface ServerResponseWithSentry extends ServerResponse {
  sentry: InstanceType<typeof import('toucan-js').default>;
}

export type Handler<
  P extends Params = Params,
  Res extends ServerResponse = ServerResponse,
  Req extends ServerRequest<P> = ServerRequest<P>,
> = (request: Req, response: Res) => Promisable<Response>;

export type { Params, ServerRequest } from 'worktop/request';
