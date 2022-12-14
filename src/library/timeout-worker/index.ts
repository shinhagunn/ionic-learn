import { workerCode } from './worker-code'
import { ON_ERROR_ARG_TYPE_ERROR, WORKER_NOT_INITIALIZED_ERROR, getErrFromEvent } from './errors'
import type {
  ErrorHandler,
  RequestMessage,
  ResponseMessage,
  TimeoutCallback,
  TimeoutObj,
  TimeoutRef,
  TimeoutWorker,
} from './types'
import {
  WorkerRequest,
  WorkerResponse,
} from './types'

const timers = new Map<TimeoutRef, TimeoutObj>()

let errorHandler: ErrorHandler | null = null
let worker: Worker | null = null
let count = 1

function onMsgFromWorker(responseMsg: ResponseMessage) {
  const { id } = responseMsg

  if (responseMsg.action === WorkerResponse.TimeoutIsSet) {
    if (!timers.has(id)) {
      // Timeout was cleared before it was set.
      return worker && worker.postMessage({
        action: WorkerRequest.ClearTimeout,
        ref: responseMsg.ref,
      })
    }

    timers.get(id)!.ref = responseMsg.ref
  }
  else if (responseMsg.action === WorkerResponse.TimesUp) {
    if (!timers.has(id)) return

    const timeoutItem = timers.get(id)
    const callback = timeoutItem!.fn
    const args = timeoutItem!.args

    callback(...args)
    timers.delete(id)
  }
}

export * from './types'

export const timeoutWorker: TimeoutWorker = {
  start(workerInstance?: Worker): TimeoutWorker {
    if (!worker) {
      const blob = new Blob([workerCode], { type: 'application/javascript' })
      const workerObjUrl = URL.createObjectURL(blob)

      worker = workerInstance || new Worker(workerObjUrl)

      worker.addEventListener('message', (ev: { data: ResponseMessage }) => {
        const { data } = ev
        onMsgFromWorker(data)
      })

      worker.addEventListener('error', (errEv: ErrorEvent) => {
        if (!errorHandler) return
        errEv.preventDefault()

        const err = getErrFromEvent(errEv)
        errorHandler(err)
      })
    }

    return timeoutWorker
  },

  onError(callback: ErrorHandler): void {
    if (typeof callback !== 'function') throw new Error(ON_ERROR_ARG_TYPE_ERROR)

    errorHandler = callback
  },

  setTimeout(
    callback: TimeoutCallback,
    ms: number,
    ...args: Array<unknown>
  ): TimeoutRef {
    const wasSetAt = Date.now()
    if (!worker) throw new Error(WORKER_NOT_INITIALIZED_ERROR)

    const id = count++

    worker.postMessage({
      action: WorkerRequest.SetTimeout,
      id,
      ms,
      wasSetAt,
    } as RequestMessage)

    timers.set(id, {
      ref: null,
      fn: callback,
      args,
    })

    return id
  },

  clearTimeout(id: TimeoutRef): void {
    if (!worker) throw new Error(WORKER_NOT_INITIALIZED_ERROR)
    if (!timers.has(id)) return

    const ref = timers.get(id)!.ref

    worker && ref !== null && worker.postMessage({
      action: WorkerRequest.ClearTimeout,
      ref,
    } as RequestMessage)

    timers.delete(id)
  },

  stop(): TimeoutWorker {
    if (worker) {
      worker.terminate()
      worker = null
      errorHandler = null
      timers.clear()
      count = 1
    }

    return timeoutWorker
  },
}
