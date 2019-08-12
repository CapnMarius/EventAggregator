# EventAggregator

## Usage

### import in TypeScript
```typescript
import {EventAggregator, debounce} from "eventaggregator";
```
### import in JavaScript
```javascript
const ea = require("eventaggregator");
const EventAggregator = ea.EventAggregator;
const debounce = ea.debounce;
```

### get an instance
```typescript
const ea = EventAggregator.getInstance("dom"); // acts like a Singleton

const ea = new EventAggregator();
```

### emit an event
```typescript
window.addEventListener("resize", event => ea.emit("resize", event));
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
const sub = ea.on("resize", (data: any, event: string): void => {...});
sub.off();
```

### subscribe to all events of the EventAggregator
```typescript
ea.on("*", (data: any, event: string): void => {
  // handle all events
  // event holds the original event name, for example: "resize"
});
```

### multiple event subscriptions
```typescript
const subs = ea.on(["click", "touchstart"], (data: any, event: string): void => {...});
subs.off();
```

### remove all event subscriptions
```typescript
ea.off("resize")
// or
ea.off(["click", "touchstart"])
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