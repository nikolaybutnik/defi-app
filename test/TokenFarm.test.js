// Mocha testing framework and Chai assertion library come bundled with Truffle

/* eslint-disable no-undef */
require('chai')
  .use(require('chai-as-promised'))
  .should()

const TokenFarm = artifacts.require('TokenFarm')
const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')

contract(TokenFarm, (accounts) => {
  // write tests here
  describe('Mock Dai deployment', async () => {
    it('has a name', async () => {
      const daiToken = await DaiToken.new()
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token')
    })
  })
})
