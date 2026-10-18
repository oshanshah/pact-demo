const path = require('path');
const { Verifier } = require('@pact-foundation/pact');
const app = require('../src/app');

jest.setTimeout(60000);

describe('UserService provider verification', () => {
  let server;
  const PORT = 8081;

  beforeAll((done) => { server = app.listen(PORT, done); });
  afterAll((done) => { server.close(done); });

  it('satisfies all consumer contracts', () => {
    const opts = {
      provider: 'UserService',
      providerBaseUrl: `http://localhost:${PORT}`,
      logLevel: 'warn',
      stateHandlers: {
        'user 1 exists': async () => 'user 1 ready',
        'user 999 does not exist': async () => 'user 999 absent',
      },
    };

    if (process.env.PACT_BROKER_BASE_URL) {
      // CI mode: pull pacts from the Broker, publish results back
      Object.assign(opts, {
        pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
        consumerVersionSelectors: [{ mainBranch: true }, { deployedOrReleased: true }],
        publishVerificationResult: true,
        providerVersion: process.env.GIT_COMMIT || 'local',
        providerVersionBranch: process.env.GIT_BRANCH || 'local',
      });
    } else {
      // Local mode: verify against the pact file on disk
      opts.pactUrls = [
        path.resolve(__dirname, '../../consumer/pacts/OrderService-UserService.json'),
      ];
    }
    return new Verifier(opts).verifyProvider();
  });
});
