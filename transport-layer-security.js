/**
 * Module for TLS certificates, checking and generation
 * @author Thomas vanBommel
 * @since 12-11-2020
 */
const { spawnSync } = require("child_process");
const fs = require("fs");

class TLS {
  /**
   * Create a new TLS object to create / find key + certificate
   * @constructor
   * @param {string} path - Absolute path to key/cert storage/location
   * @param {Object} [options={}] - TLS certificate options
   * @param {string} [options.passphrase=""] - TLS key passphrase
   * @param {string} [options.keyname="key.pem"] - Name of the key to look for/generate
   * @param {string} [options.certname="cert.pem"] - Name of the certificate to look for/generate
   * @throws Will throw an error if openssl exit status is not 0
   */
  constructor(path, options={}){
    let keyname = options.keyname ? options.keyname : "key.pem";
    let certname = options.certname ? options.certname : "cert.pem";

    this.keypath  = path + keyname;
    this.certpath = path + certname;
    this.passphrase = options.passphrase ? options.passphrase : "";

    // ensure the certificates exist
    if(!fs.existsSync(this.keypath) || !fs.existsSync(this.certpath)){
      // generate keys with openssl
      let cmd = spawnSync(
        "openssl", [
          "req", "-nodes", "-new", "-x509", "-days", "365",
          "-subj", "/C=CA/ST=NS/L=Online/O=Company/OU=IT/CN=localhost",
          "-keyout", keyname, "-out", certname
        ], { cwd: path }
      );

      // check for errors
      if(cmd.error){
        console.error(cmd.error);
        throw `Missing openssl command or target directory '${path}' doesn't exist`;
      }

      // inform user they must try again...
      if(cmd.status === 1)
        throw "Error creating TLS certificate + key: " + cmd.stderr.toString();
    }

    // read key/cert from file system
    this.key = fs.readFileSync(this.keypath);
    this.cert = fs.readFileSync(this.certpath);

    // inform user progress
    console.log("TLS initialized: " + path);
  }
}

module.exports = TLS;
