# transport-layer-security (TLS)

This is a JavaScript module created for use with NodeJS that loads TLS certificates from the filesystem for use with the https module.

This module will also generate self signed certificates for "localhost" when no certificates are found in the prescribes location. (uses openssl from the command line)

## Usage
```js
const TLS = require("transport-layer-security");
const https = require("https");

let tls = new TLS(`${__dirname}/certs/`);

const insecure = https.createServer(tls, (req, res) => {
  /* do stuffs */
});
```

### Parameters
| Required | Param | Type | Default value | Description |
| --- | --- | --- | --- | --- |
| true | path | string | NAN | Absolute path to key/cert storage location |
| false | options | object | { } (empty object) | Module options |
| false | options.passphrase | string | "" (empty string)| TLS key passphrase (if required)
| false | options.keyname | string | "key.pem" | Name of the key to look for / generate |
| false | options.certname | string | "cert.pem" | Name of the cert to look for / generate |
