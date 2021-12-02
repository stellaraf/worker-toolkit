import type { Promisable } from 'worktop';
import type { ServerResponse as WorktopServerResponse } from 'worktop/response';
import type { Params, ServerRequest as WorktopServerRequest } from 'worktop/request';
import type { WorkerError } from '../errors';

export interface ServerRequest<P extends Params = Params> extends WorktopServerRequest<P> {}

export interface ServerResponse extends WorktopServerResponse {
  error?: WorkerError;
}

export interface ServerResponseWithSentry extends ServerResponse {
  sentry: null;
}

export type Handler<
  P extends Params = Params,
  Res extends ServerResponse = ServerResponse,
  Req extends ServerRequest<P> = ServerRequest<P>,
> = (request: Req, response: Res) => Promisable<Response>;

export type { Params } from 'worktop/request';
export type { RouteParams } from 'worktop';
