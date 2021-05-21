// SPDX-License-Identifier: MIT

pragma solidity >=0.7.6;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    // assign state variables
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    // an array of all adresses that have staked
    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;

    constructor(DappToken _dappToken, DaiToken _daiToken) {
        // above: type, variable name. The type is the smart contract itself.
        // this function will only run once when the contrct is deployed to the blockchain
        dappToken = _dappToken;
        daiToken = _daiToken;
    }

    // stake tokens (deposit)
    function stakeTokens(uint256 _amount) public {
        // transfer Mock Dai tokens to this contract for staking
        // 'this' corresponds to the smart contract itself
        daiToken.transferFrom(msg.sender, address(this), _amount);
        // update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
    }
}
