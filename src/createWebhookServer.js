/* @flow */

import http from 'http'
import { resolve } from 'url'

import type { UpdateHandler } from './types'
import type { Result, Update } from './generatedTypes'

import HTTPError from './HTTPError'

export default (
  bot: UpdateHandler,
  path: string = '',
  onError?: (error: HTTPError) => any,
) => {
  const server = http.createServer()
  const url = resolve('/', path)

  server.on(
    'request',
    (req: http.IncomingMessage, res: http.ServerResponse) => {
      try {
        if (req.method !== 'POST') {
          throw new HTTPError(
            req.url === url ? 405 : 501,
            `Invalid ${req.method} request to ${req.url}`,
          )
        }

        if (req.url !== url) {
          throw new HTTPError(404, `Invalid ${req.method} request to ${req.url}`)
        }

        let data = ''

        req.on('data', newData => (data += newData || ''))

        req.on('end', () => {
          try {
            const request: Result<Update[]> = JSON.parse(data)
            if (request.ok) request.result.forEach(bot.emit)
          } finally {
            res.end()
          }
        })
      } catch (e) {
        const error = HTTPError.fromCatch(e)

        res.statusCode = error.httpStatusCode
        res.statusMessage = error.httpStatusMessage
        res.end()

        onError && onError(
          HTTPError.fromCatch(e),
        )
      }
    },
  )

  return server
}
