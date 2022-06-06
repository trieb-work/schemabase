# Encrypt/decrypt strings

This package can be used to encrypt variables before storing them in the DB.

It needs a secret key as env variable "SECRET_KEY" to work.

It uses the "cloak" package in the background: https://github.com/47ng/cloak

The secret key needs to be of a specific format and can be generated easily with the cloak CLI:

```
pnpm cloak generate
```
