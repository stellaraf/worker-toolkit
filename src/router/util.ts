import type { ServerResponseWithSentry, ServerResponse } from './types';

export function isResponseWithSentry(
  response: ServerResponse | ServerResponseWithSentry,
): response is ServerResponseWithSentry {
  return 'sentry' in response && typeof response.sentry !== 'undefined';
}
