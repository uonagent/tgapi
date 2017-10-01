/* @flow */

/* :: import { IncomingMessage, ServerResponse, Server } from 'http' */

import { resolve } from 'url'

import type { PartialObserver } from './types'
import type { Update } from './generatedTypes'

import isValidUpdate from './util/isValidUpdate'
import HTTPError from './HTTPError'

/* :: interface HTTPServer extends Server {} */

const createErrorHandler =
  (bot: PartialObserver<Update>, res: ServerResponse) =>
    (err: HTTPError) => {
      const error = HTTPError.fromCatch(err)

      res.statusCode = error.httpStatusCode
      res.statusMessage = error.httpStatusMessage

      res.end()

      bot.error && bot.error(error)
    }

export default (bot: PartialObserver<Update>, path: string = '') =>
  (server: HTTPServer): void => {
    const url = resolve('/', path)

    server.on(
      'request',
      (req: IncomingMessage, res: ServerResponse) => {
        const handleError = createErrorHandler(bot, res)

        if (req.method !== 'POST') {
          handleError(new HTTPError(
            req.url === url ? 405 : 501,
            `Invalid ${req.method} request to ${req.url}`,
          ))
        } else if (req.url !== url) {
          handleError(new HTTPError(
            404, `Invalid ${req.method} request to ${req.url}`,
          ))
        } else {
          let data = ''

          req.on('data', newData => (data += newData || ''))

          req.on('end', () => {
            try {
              const update: any = JSON.parse(data)

              if (!isValidUpdate(update)) throw new HTTPError(400, 'Bad request')

              bot.next(update)
              res.end()
            } catch (e) {
              handleError(e)
            }
          })
        }
      },
    )
  }