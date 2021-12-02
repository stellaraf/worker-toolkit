import { Router as WorktopRouter } from 'worktop';
import { JSONResponse } from '../responses';

import type { RouteParams, Promisable } from 'worktop';
import type { Params, ServerRequest } from 'worktop/request';
import type { Handler, ServerResponse } from './types';

export type ErrorHandler<Res extends ServerResponse, Req extends ServerRequest = ServerRequest> = (
  request: Req,
  response: Res,
) => Promisable<Response>;

export class Router<Res extends ServerResponse, Req extends ServerRequest = ServerRequest> {
  #worktop: InstanceType<typeof WorktopRouter>;
  public add: WorktopRouter['add'];

  constructor() {
    this.#worktop = new WorktopRouter();
    this.add = this.#worktop.add;
  }

  /**
   * Add a `POST` method.
   *
   * @param path Request path or regex.
   * @param handler Request handler.
   */
  public post<T extends RegExp>(path: T, handler: Handler<Params>): void;
  public post<T extends string>(path: T, handler: Handler<RouteParams<T>>): void {
    this.#worktop.add<T>('POST', path, handler);
  }

  /**
   * Add a `GET` method.
   *
   * @param path Request path or regex.
   * @param handler Request handler.
   */
  public get<T extends RegExp>(path: T, handler: Handler<Params>): void;
  public get<T extends string>(path: T, handler: Handler<RouteParams<T>>): void {
    this.#worktop.add('GET', path, handler);
  }

  /**
   * Add a `PATCH` method.
   *
   * @param path Request path or regex.
   * @param handler Request handler.
   */
  public patch<T extends RegExp>(path: T, handler: Handler<Params>): void;
  public patch<T extends string>(path: T, handler: Handler<RouteParams<T>>): void {
    this.#worktop.add('PATCH', path, handler);
  }

  /**
   * Add a `PUT` method.
   *
   * @param path Request path or regex.
   * @param handler Request handler.
   */
  public put<T extends RegExp>(path: T, handler: Handler<Params>): void;
  public put<T extends string>(path: T, handler: Handler<RouteParams<T>>): void {
    this.#worktop.add('PUT', path, handler);
  }

  /**
   * Add a `DELETE` method.
   *
   * @param path Request path or regex.
   * @param handler Request handler.
   */
  public delete<T extends RegExp>(path: T, handler: Handler<Params>): void;
  public delete<T extends string>(path: T, handler: Handler<RouteParams<T>>): void {
    this.#worktop.add('DELETE', path, handler);
  }

  /**
   * Add an error handler to the request router.
   *
   * @param handler Error handler callback.
   */
  public addErrorHandler(handler: ErrorHandler<Res, Req>): void {
    this.#worktop.onerror = handler;
  }

  /**
   * Default error handler.
   */
  public handleError(request: Req, response: Res): Promisable<Response> {
    let error = 'Internal Server Error';
    const data = {
      path: request.path,
      query: request.query.toString(),
      headers: Object.fromEntries(request.headers),
    };
    if (response.error) {
      error = String(response.error);
      return JSONResponse({ error }, response.error.statusCode);
    }
    return JSONResponse({ error, data }, 500);
  }
}
