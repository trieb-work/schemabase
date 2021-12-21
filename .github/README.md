# eCommerce-integrations

This is the MonoRepo for the ecommere-integrations (ECI).

We are using pnpm2 package manager and have a serverless Next.Js application, a node.js task runner, several shared packages and a trigger function running in AWS Lambda.

Deployment of the different services is done via the Gitlab-CI. The task-runner is hosted in Rancher. We are using a central PostgresQL Database as data store.
