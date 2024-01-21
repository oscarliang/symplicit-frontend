import { defineConfig } from 'cypress';

import { ENV } from 'utils/env';

export default defineConfig({
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    env: {
      host: `http://localhost:${ENV.port}`,
      api_url: "http://localhost:3002"
    },
  },
});
