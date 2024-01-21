// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const fs = require('fs');
const http = require('http');
const { URL } = require('url');

let server; // static reference to the mock server
// so we can close and re-assign on 2nd call

// start the Next.js server when Cypress starts
module.exports = async (on, config) => {
  on('task', {
    mockServer({ fixture, interceptUrl }) {
      if (server) server.close(); // close any previous instance

      const url = new URL(interceptUrl);
      server = http.createServer((req, res) => {
        if (req.url === url.pathname) {
          const data = fs.readFileSync(`./cypress/fixtures/${fixture}`);
          res.end(data);
        } else {
          res.end();
        }
      });

      server.listen(url.port);
      // eslint-disable-next-line no-console
      console.log(`listening at port ${url.port}`);

      return null;
    },
  });

  return config;
};
