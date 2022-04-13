# eciApiHandlder.ts

The boilerplate code used in every nextjs api route. 

The wrapper does:
- request validation -> makes it typesafe to work
- manages traceId
- sets up the backgroundContext
- Handles errors by converting to proper http status codes


# http.ts

Offers an http client ( a wrapper around axios ) for outgoing http requests.
Mainly used to make axios behave like you would expect... and add the traceId automatically. 