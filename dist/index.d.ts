export interface ISubscriber {
    off: () => void;
}
export declare type ISubscriberCallback = (data: any, event?: string) => void;
export interface ISubscription {
    _id: number;
    _fn: ISubscriberCallback;
    once: boolean;
}
declare class EventAggregator {
    private static instances;
    static getInstance(type?: string): EventAggregator;
    private subs;
    private _id;
    on(event: string | string[], fn: ISubscriberCallback, once?: boolean): ISubscriber;
    once(event: string | string[], fn: ISubscriberCallback): ISubscriber;
    emit(event: string | string[], data?: any): EventAggregator;
    off(event: string, id: number): EventAggregator;
    private addSub(event, fn, once?);
    private emitSubs(event, data, originalEvent);
    private getNextId();
}
declare const debounce: (fn: any, threshhold?: number, scope?: any) => any;
declare const throttle: (fn: any, threshhold?: number, scope?: any) => any;
export default EventAggregator;
export { debounce, throttle };
