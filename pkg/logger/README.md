A logger capable of forwarding to elastic.

Loggers can be scoped using the `.with(...)` method.
This creates a new logger that will log the added fields with every message.


```ts
const a = new Logger()
a.info("hello") 
// { message: "hello"}

const b = a.with({ service: "eci" })
b.info("Hello")
// { message: "hello", service: "eci" }

const c = b.with({ integration: "zoho-logistics" })
c.info("Hello")
// { message: "hello", service: "eci", integration: "zoho-logistics" }
```

The third logger (`c`) now also logs the added fields automatically. However this does not affect the parent logger (`b`)
This will still only log the fields that were added to `b`
```ts

b.info("hello") 
// { message: "hello", service: "eci" }
```