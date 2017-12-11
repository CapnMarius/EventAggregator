export interface ISubscriber {
  off: () => void;
}

export type ISubscriberCallback = (data: any, event?: string) => void;

export interface ISubscription {
  _id: number;
  _fn: ISubscriberCallback;
  once: boolean;
}

interface ISubscriberStore {
  [event: string]: ISubscription[];
}

interface IInstanceStore {
  [type: string]: EventAggregator;
}

class EventAggregator {
  private static instances: IInstanceStore = {};

  public static getInstance(type: string = "main"): EventAggregator {
    if (EventAggregator.instances[type] === undefined) {
      EventAggregator.instances[type] = new EventAggregator();
    }
    return EventAggregator.instances[type];
  }

  private subs: ISubscriberStore = {};
  private _id: number = 0;

  public on(event: string | string[], fn: ISubscriberCallback, once: boolean = false): ISubscriber {
    if (Array.isArray(event)) {
      const subs: ISubscriber[] = event.map((e: string) => this.on(e, fn, once));
      return {
        off: () => subs.forEach((sub: ISubscriber) => sub.off()),
      };
    } else {
      return this.addSub(event, fn, once);
    }
  }

  public once(event: string | string[], fn: ISubscriberCallback): ISubscriber {
    return this.on(event, fn, true);
  }

  public emit(event: string | string[], data?: any): EventAggregator {
    if (Array.isArray(event)) {
      event.forEach((e: string) => this.emit(e, data));
    } else {
      this.emitSubs(event, data, event);
      this.emitSubs("*", data, event);
    }
    return this;
  }

  public off(event: string, id: number): EventAggregator {
    this.subs[event].splice(this.subs[event].findIndex((sub: ISubscription) => sub._id === id), 1);
    return this;
  }

  private addSub(event: string, fn: ISubscriberCallback, once: boolean = false): ISubscriber {
    if (this.subs[event] === undefined) {
      this.subs[event] = [];
    }
    const id: number = this.getNextId();
    this.subs[event].push({ _id: id, _fn: fn, once });
    return { off: () => this.off(event, id) };
  }

  private emitSubs(event: string, data: any, originalEvent: string): void {
    if (this.subs[event] !== undefined) {
      for (let i: number = 0; i < this.subs[event].length; i++) {
        const sub: ISubscription = this.subs[event][i];
        if (typeof sub._fn === "function") {
          sub._fn(data, originalEvent);
          if (sub.once === true) {
            this.off(event, sub._id);
            i--;
          }
        } else {
          this.off(event, sub._id);
          i--;
        }
      }
    }
  }

  private getNextId() {
    return this._id++;
  }
}

const debounce = (fn: any, threshhold: number = 100, scope: any = null): any => {
  let deferTimer: number;

  return function () {
    const args: any = arguments;
    clearTimeout(deferTimer);
    deferTimer = setTimeout(() => {
      fn.apply(scope, args);
    }, threshhold);
  };
};

const throttle = (fn: any, threshhold: number = 100, scope: any = null): any => {
  let last: number;
  let deferTimer: number;

  return function () {
    const now: number = Date.now();
    const args: any = arguments;
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        fn.apply(scope, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(scope, args);
    }
  };
};

export default EventAggregator;
export { debounce, throttle };