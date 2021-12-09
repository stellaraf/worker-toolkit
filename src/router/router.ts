import {
  Router as WorktopRouter,
  listen as WorktopListen,
  reply as WorktopReply,
  FetchHandler,
} from 'worktop';
import * as Cache from 'worktop/cache';
import { JSONResponse } from '../responses';

import type { Promisable } from 'worktop';
import type { Handler, ServerRequest, ServerResponse, Params, RouteParams } from './types';

export type ErrorHandler<Res extends ServerResponse, Req extends ServerRequest = ServerRequest> = (
  request: Req,
  response: Res,
) => Promisable<Response>;

export interface RouterOptions<Res extends ServerResponse, Req extends ServerRequest> {
  prepare?: (req: Req, res: Res) => void;
  errorHandler?: ErrorHandler<Res, Req>;
  /** @default true */
  cacheResponses?: boolean;
}

export class Router<Res extends ServerResponse, Req extends ServerRequest = ServerRequest> {
  #worktop: InstanceType<typeof WorktopRouter>;
  public add: WorktopRouter['add'];
  private cacheResponses: boolean;

  constructor(options: RouterOptions<Res, Req> = {}) {
    this.#worktop = new WorktopRouter();
    this.add = this.#worktop.add;
    const { prepare, errorHandler, cacheResponses = true } = options;
    if (typeof prepare === 'function') {
      this.#worktop.prepare = prepare;
    }
    if (typeof errorHandler === 'function') {
      this.addErrorHandler(errorHandler);
    }
    this.cacheResponses = cacheResponses;
  }

  /**
   * Attach `fetch` event handler.
   */
  public attach(): void {
    if (this.cacheResponses) {
      Cache.listen(this.#worktop.run);
    } else {
      WorktopListen(this.#worktop.run);
    }
  }

  /**
   * Get a `FetchHandler` for Cloudflare ESM workers.
   */
  public handler(): FetchHandler {
    if (this.cacheResponses) {
      return Cache.reply(this.#worktop.run);
    }
    return WorktopReply(this.#worktop.run);
  }

  /**
   * Add a `POST` method.
   *
   * @param path Request path or regex.
   * @param handler Request handler.
   */
  public post<T extends string>(path: T, handler: Handler<RouteParams<T>, Res>): void;
  public post<T extends RegExp>(path: T, handler: Handler<Params, Res, Req>): void {
    this.#worktop.add<T>('POST', path, handler as Handler);
  }

  /**
   * Add a `GET` method.
   *
   * @param path Request path or regex.
   * @param handler Request handler.
   */
  public get<T extends string>(path: T, handler: Handler<RouteParams<T>, Res>): void;
  public get<T extends RegExp>(path: T, handler: Handler<Params, Res, Req>): void {
    this.#worktop.add('GET', path, handler as Handler);
  }

  /**
   * Add a `PATCH` method.
   *
   * @param path Request path or regex.
   * @param handler Request handler.
   */
  public patch<T extends string>(path: T, handler: Handler<RouteParams<T>, Res>): void;
  public patch<T extends RegExp>(path: T, handler: Handler<Params, Res, Req>): void {
    this.#worktop.add('PATCH', path, handler as Handler);
  }

  /**
   * Add a `PUT` method.
   *
   * @param path Request path or regex.
   * @param handler Request handler.
   */
  public put<T extends string>(path: T, handler: Handler<RouteParams<T>, Res>): void;
  public put<T extends RegExp>(path: T, handler: Handler<Params, Res, Req>): void {
    this.#worktop.add('PUT', path, handler as Handler);
  }

  /**
   * Add a `DELETE` method.
   *
   * @param path Request path or regex.
   * @param handler Request handler.
   */
  public delete<T extends string>(path: T, handler: Handler<RouteParams<T>, Res>): void;
  public delete<T extends RegExp>(path: T, handler: Handler<Params, Res, Req>): void {
    this.#worktop.add('DELETE', path, handler as Handler);
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
    };
    if (response.error) {
      error = String(response.error);
      return JSONResponse({ error }, response.error.statusCode);
    }
    return JSONResponse({ error, data }, 500);
  }
}
