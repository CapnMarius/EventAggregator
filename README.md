# EventAggregator

## Usage

### get an instance
```
const ea: EventAggregator = EventAggregator.getInstance("dom");
```

### emit an event
```
window.addEventListener("resize", (event) => ea.emit("resize", event));
```

### subscribe to an event
```
ea.on("resize", (data) => {
  // do something on resize
});
```

### subscribe to only the first event
```
ea.once("resize", (data) => {
  // do something on the first resize event
});
```

### unsubscribe a subscription
```
const subscription: ISubscription = ea.on("resize", (data) => {...});
subscription.off();
```

### subscribe to all events of the EventAggregator
```
ea.on("*", (data, originalEvent) => {
  // handle all events
  // originalEvent holds the event name, for example: "resize"
});
```

### multiple event subscriptions
```
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
```
const subs: ISubscription[] = [];

subs.push(ea.on("resize", (data) => {
  // do something on resize
}));

function unsubscribeAll(() {
  subs.forEach((sub: ISubscription) => sub.off());
  subs = [];
}
```

### debounce an event
```
const subs: ISubscription[] = [];

subs.push(ea.on("resize", (data) => {
  // do something on resize
}));

function unsubscribeAll(() {
  subs.forEach((sub: ISubscription) => sub.off());
  subs = [];
}
```
