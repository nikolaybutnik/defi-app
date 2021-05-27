/* eslint-disable no-undef */
const TokenFarm = artifacts.require('TokenFarm')
const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')

module.exports = async function(deployer, network, accounts) {
  // this process puts all the smart contracts on the network

  // deploy Mock Dai Token
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  // deploy Dapp Token
  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()

  // deploy TokenFarm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()

  // transfer all tokens to TokenFarm (1 million)
  // solidity doesn't handle decimals. The number looks larger than 1 mil because Dapp Token has 18 decimal places.
  // therefore 1 million is: 1,000,000.000,000,000,000,000,000
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

  // transer 100 Mock Dai Tokens to investor
  await daiToken.transfer(accounts[1], '100000000000000000000')
}
