This package handles the `message bus` / `queue`.

It is resposible for offering a Producer and a Consumer and will handle all serialization and context propagation.

# src/registry

A mapping of topic/queue-names and the message datatype.
Add a new mapping by adding a topic at the top of the file and then copy and edit a section starting with `export type ...`

# src/signature

Handles signing and verifying the authenticity of messages in the queue. Only needed if a 3rd party produces messages.

# src/message

A message class to handle serialization and deserialization in a single place. This also handles adding metadata about a message.

# src/events (probably a bad name :/ )

Contains the producer and consumer classes that need to be reimplemented using bullmq.
The interfaces for these classes are also defined here.
