export interface ISubscriber {
  off: () => void
}

export type ISubscriberCallback = (data: any, event?: string) => void

export interface ISubscription {
  _id: number
  _fn: ISubscriberCallback
  once: boolean
}

interface ISubscriberStore {
  [event: string]: ISubscription[]
}

interface IInstanceStore {
  [type: string]: EventAggregator
}

export class EventAggregator {
  private static _instances: IInstanceStore = {}

  public static getInstance(type: string = "main") {
    if (EventAggregator._instances[type] === undefined) EventAggregator._instances[type] = new EventAggregator()
    return EventAggregator._instances[type]
  }

  private _subs: ISubscriberStore = {}
  private _id = 0

  public on(event: string | string[], fn: ISubscriberCallback, once: boolean = false): ISubscriber {
    if (Array.isArray(event)) {
      const subs = event.map(x => this.on(x, fn, once))
      return {
        off: () => subs.forEach(x => x.off())
      }
    }

    if (this._subs[event] === undefined) this._subs[event] = []
    const sub = { _id: this._nextId(), _fn: fn, once }
    this._subs[event].push(sub)

    return {
      off: () => {
        const index = this._subs[event].indexOf(sub)
        if (index !== -1)
          this._subs[event].splice(index, 1)
      }
    }
  }

  public once(event: string | string[], fn: ISubscriberCallback) {
    return this.on(event, fn, true)
  }

  public emit(event: string | string[], data?: any) {
    if (Array.isArray(event)) event.forEach(x => this.emit(x, data))
    else {
      this._emit(event, data, event)
      this._emit("*", data, event)
    }
    return this
  }

  public off(event: string | string[]) {
    if (Array.isArray(event)) event.forEach(x => this.off(x))
    else delete this._subs[event]
    return this
  }
  

  private _emit(event: string, data: any, originalEvent: string) {
    if (this._subs[event] === undefined) return

    this._subs[event] = this._subs[event].filter(x => {
      if (typeof x._fn !== "function") return false
      x._fn(data, originalEvent)
      return !x.once
    })
  }

  private _nextId() {
    return this._id++
  }
}

export const debounce = <T extends Function>(fn: T, threshhold = 100, scope: any = null): T => {
  let deferTimer

  return ((...args: any[]) => {
    clearTimeout(deferTimer)
    deferTimer = setTimeout(() => fn.apply(scope, args), threshhold)
  }) as any as T
}

export const throttle = <T extends Function>(fn: T, threshhold = 100, scope: any = null): T => {
  let last: number
  let deferTimer

  return ((...args: any[]) => {
    const now = Date.now()
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(() => {
        last = now
        fn.apply(scope, args)
      }, threshhold)
    }
    else {
      last = now
      fn.apply(scope, args)
    }
  }) as any as T
}