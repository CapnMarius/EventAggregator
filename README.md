# EventAggregator

## Usage

### get an instance
```typescript
const ea: EventAggregator = EventAggregator.getInstance("dom"); // acts like a Singleton

const ea: EventAggregator = new EventAggregator();
```

### emit an event
```typescript
window.addEventListener("resize", (event) => ea.emit("resize", event));
```

### subscribe to an event
```typescript
ea.on("resize", (data) => {
  // do something on resize
});
```

### subscribe to only the first event
```typescript
ea.once("resize", (data) => {
  // do something on the first resize event
});
```

### unsubscribe a subscription
```typescript
const subscription: ISubscription = ea.on("resize", (data) => {...});
subscription.off();
```

### subscribe to all events of the EventAggregator
```typescript
ea.on("*", (data, originalEvent) => {
  // handle all events
  // originalEvent holds the event name, for example: "resize"
});
```

### multiple event subscriptions
```typescript
const subs: ISubscription[] = [];

subs.push(ea.on("resize", (data) => {
  // do something on resize
}));

function unsubscribeAll(() {
  subs.forEach((sub: ISubscription) => sub.off());
  subs = [];
}
```

### throttle an event
```typescript
ea.on("very-frequent-event", throttle((data) => {
  // handle the events with a maximum of one per 500 milliseconds (default threshhold is 100 milliseconds)
}, 500));
```

### debounce an event
```typescript
ea.on("very-frequent-event", debounce((data) => {
  // handle the last event and only if the event has been silence for 500 milliseconds (default threshhold is 100 milliseconds)
}, 500));
```
