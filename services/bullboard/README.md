# Bullboard - Queue monitoring dashboard

The bullboard service can be used to monitor and fix current cron pipelines. The service is running in docker and is protected with OAuth

## Authentication & Authorization

Currently, it is just possible to allow users accessing bullboard with the domain they login with. Default is to allow all @trieb.work addresses.
Can be configured by setting the env variable ALLOWED_LOGIN_DOMAINS=[""].
For simple e2e testing we allow also the bypassing of the authentication using a query parameter, that you can set by setting the env variable BYPASS_AUTH_PARAM=""
and set authparam=XXXXX in the url.
