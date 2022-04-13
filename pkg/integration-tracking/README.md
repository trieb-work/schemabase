The tracking integration contains multiple separate tasks.

# Syncing orders and packages to the internal db

Receives a webhook from zoho about a new order or package and upserts it into the db. Then emits a new event which the `notification.ts` task listens to.

# Sending transaction emails when necessary

Listens for package update events and sends out an email to the customer if necessary.