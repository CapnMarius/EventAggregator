export interface ISubscriber {
    off: () => void;
}
export declare type ISubscriberCallback = (data: any, event?: string) => void;
export interface ISubscription {
    _id: number;
    _fn: ISubscriberCallback;
    once: boolean;
}
export declare class EventAggregator {
    private static _instances;
    static getInstance(type?: string): EventAggregator;
    private _subs;
    private _id;
    on(event: string | string[], fn: ISubscriberCallback, once?: boolean): ISubscriber;
    once(event: string | string[], fn: ISubscriberCallback): ISubscriber;
    emit(event: string | string[], data?: any): this;
    off(event: string | string[]): this;
    private _emit(event, data, originalEvent);
    private _nextId();
}
export declare const debounce: <T extends Function>(fn: T, threshhold?: number, scope?: any) => T;
export declare const throttle: <T extends Function>(fn: T, threshhold?: number, scope?: any) => T;
