export interface ISubscription {
    off: () => void;
}

export default class EventAggregator {
    public static getInstance(type: string = "main"): EventAggregator {
        if (EventAggregator.instances[type] === undefined) {
            EventAggregator.instances[type] = new EventAggregator();
        }
        return EventAggregator.instances[type];
    }

    private static instances: {} = {};

    private subs: {} = {};
    private _id: number = 0;

    private get nextId() {
        return this._id++;
    }

    public off(event: string, id: number) {
        this.subs[event].splice(this.subs[event].findIndex((sub) => sub._id === id), 1);
    }

    public on(event: string | string[], fn: (data: any, event?: string) => any, once: boolean = false): ISubscription {
        if (Array.isArray(event)) {
            const subs: ISubscription[] = event.map((e: string) => this.addSub(e, fn, once));
            return {
                off: () => subs.forEach((sub: ISubscription) => sub.off()),
            };
        } else {
            return this.addSub(event, fn, once);
        }
    }

    public once(event: string | string[], fn: (data: any, event?: string) => any): ISubscription {
        return this.on(event, fn, true);
    }

    public emit(event: string | string[], data?: any): void {
        if (Array.isArray(event)) {
            return event.forEach((e: string) => this.emitSubs(e, data, e));
        } else {
            this.emitSubs(event, data, event);
        }
        this.emitSubs("*", data, event);
    }

    private addSub(event: string, fn: (data: any, event?: string) => void, once: boolean = false): ISubscription {
        const id: number = this.nextId;
        const off = () => this.off(event, id);
        if (this.subs[event] === undefined) {
            this.subs[event] = [];
        }
        this.subs[event].push({ _id: id, _fn: fn, once });
        return { off };
    }

    private emitSubs(event: string, data: any, originalEvent: string): void {
        if (this.subs[event] !== undefined) {
            for (let i: number = 0; i < this.subs[event].length; i++) {
                const sub = this.subs[event][i];
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
}

export const debounce = (fn: any, threshhold: number = 100, scope: any = null): any => {
  let deferTimer: number;

  return function() {
    const args: any = arguments;
    clearTimeout(deferTimer);
    deferTimer = setTimeout(() => {
      fn.apply(scope, args);
    }, threshhold);
  };
};

export const throttle = (fn: any, threshhold: number = 100, scope: any = null): any => {
    let last: number;
    let deferTimer: number;

    return function() {
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
