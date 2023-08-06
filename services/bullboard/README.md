# Bullboard - Queue monitoring dashboard

The bullboard service can be used to monitor and fix current cron pipelines. The service is running in docker and is protected with OAuth

## Authentication & Authorization

Currently, it is just possible to allow users accessing bullboard with the domain they login with. Default is to allow all @trieb.work addresses.
Can be configured by setting the env variable ALLOWED_LOGIN_DOMAINS=[""]
