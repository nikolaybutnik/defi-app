// Mocha testing framework and Chai assertion library come bundled with Truffle

const { assert } = require('chai')

/* eslint-disable no-undef */
require('chai')
  .use(require('chai-as-promised'))
  .should()

const TokenFarm = artifacts.require('TokenFarm')
const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')

function tokens(n) {
  return web3.utils.toWei(n, 'ether')
}

// destructure the accounts from the accounts array for clarity
// owner is the one who deployed the contract to the network, and investor is the buyer of the token
contract(TokenFarm, ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm

  before(async () => {
    // load contracts
    daiToken = await DaiToken.new()
    dappToken = await DappToken.new()
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

    // transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'))

    // send tokens to investor
    await daiToken.transfer(investor, tokens('100'), { from: owner })
  })

  describe('Mock Dai deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token')
    })
  })

  describe('Dapp Token deployment', async () => {
    it('has a name', async () => {
      const name = await dappToken.name()
      assert.equal(name, 'Dapp Token')
    })
  })

  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      const name = await tokenFarm.name()
      assert.equal(name, 'Dapp Token Farm')
    })
    it('contract has tokens', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  describe('Farming tokens', async () => {
    it('rewards investors for staking mDai tokens', async () => {
      let result

      // check investor balance before staking
      result = await daiToken.balanceOf(investor)
      assert.equal(
        result.toString(),
        tokens('100'),
        'investor Mock Dai balance correct before staking'
      )

      // stake Mock Dai tokens. Tokens must be approved first
      await daiToken.approve(tokenFarm.address, tokens('100'), {
        from: investor,
      })
      await tokenFarm.stakeTokens(tokens('100'), { from: investor })

      // check staking result
      result = await daiToken.balanceOf(investor)
      assert.equal(
        result.toString(),
        tokens('0'),
        'investor Mock Dai wallet balance correct after staking'
      )

      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(
        result.toString(),
        tokens('100'),
        'Token Farm Mock Dai balance correct after staking'
      )

      result = await tokenFarm.stakingBalance(investor)
      assert.equal(
        result.toString(),
        tokens('100'),
        'investor staking balance correcty after staking'
      )

      result = await tokenFarm.isStaking(investor)
      assert.equal(
        result.toString(),
        'true',
        'investor staking status correct after staking'
      )

      // issue tokens
      await tokenFarm.issueTokens({ from: owner })

      // check balances after issuance
      result = await dappToken.balanceOf(investor)
      assert.equal(
        result.toString(),
        tokens('100'),
        'investor Dapp Token wallet balance correct after issuance'
      )

      // ensure that only owner can issue tokens
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected
    })
  })
})
