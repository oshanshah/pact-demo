const path = require('path');
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { getUser } = require('../src/userClient');
const { integer, string } = MatchersV3;

const provider = new PactV3({
  consumer: 'OrderService',
  provider: 'UserService',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('OrderService -> UserService contract', () => {
  it('gets an existing user', () => {
    provider
      .given('user 1 exists')
      .uponReceiving('a request for user 1')
      .withRequest({ method: 'GET', path: '/users/1', headers: { Accept: 'application/json' } })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { id: integer(1), name: string('Alice'), email: string('alice@example.com') },
      });

    return provider.executeTest(async (mockServer) => {
      const user = await getUser(mockServer.url, 1);
      expect(user.name).toBe('Alice');
      expect(user.email).toBe('alice@example.com');
    });
  });

  it('gets 404 for a missing user', () => {
    provider
      .given('user 999 does not exist')
      .uponReceiving('a request for user 999')
      .withRequest({ method: 'GET', path: '/users/999', headers: { Accept: 'application/json' } })
      .willRespondWith({ status: 404 });

    return provider.executeTest(async (mockServer) => {
      expect(await getUser(mockServer.url, 999)).toBeNull();
    });
  });
});