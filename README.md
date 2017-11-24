# EventAggregator

## Usage

### get an instance
```typescript
const ea: EventAggregator = EventAggregator.getInstance("dom"); // acts like a Singleton

const ea: EventAggregator = new EventAggregator();
```

### emit an event
```typescript
window.addEventListener("resize", (event: any): void => ea.emit("resize", event));
```

### subscribe to an event
```typescript
ea.on("resize", (data: any, event: string): void => {
  // do something on resize
});
```

### subscribe to only the first event
```typescript
ea.once("resize", (data: any, event: string): void => {
  // do something on the first resize event
});
```

### unsubscribe a subscription
```typescript
const subscription: IUnsubscribe = ea.on("resize", (data: any, event: string): void => {...});
subscription.off();
```

### subscribe to all events of the EventAggregator
```typescript
ea.on("*", (data: any, event: string): void => {
  // handle all events
  // originalEvent holds the event name, for example: "resize"
});
```

### multiple event subscriptions
```typescript
const subs: IUnsubscribe[] = [];

subs.push(ea.on("resize", (data: any, event: string): void => {
  // do something on resize
}));

function unsubscribeAll(): void {
  subs.forEach((sub: IUnsubscribe): void => sub.off());
  subs = [];
}
```

### throttle an event
```typescript
ea.on("very-frequent-event", throttle((data: any, event: string): void => {
  // handle the events with a maximum of one per 500 milliseconds (default threshhold is 100 milliseconds)
}, 500));
```

### debounce an event
```typescript
ea.on("very-frequent-event", debounce((data: any, event: string): void => {
  // handle the last event and only if the event has been silence for 500 milliseconds (default threshhold is 100 milliseconds)
}, 500));
```