// SPDX-License-Identifier: MIT

pragma solidity >=0.7.6;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    // assign state variables
    string public name = "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    // an array of all adresses that have staked
    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) {
        // above: type, variable name. The type is the smart contract itself.
        // this function will only run once when the contrct is deployed to the blockchain
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // stake tokens (deposit)
    function stakeTokens(uint256 _amount) public {
        // require amount being staked ot be greater than 0
        // if the condition evaluates to true, the function will continue running.
        require(_amount > 0, "amount can't be 0");

        // transfer Mock Dai tokens to this contract for staking
        // 'this' corresponds to the smart contract itself
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // add users to stakers array if they haven't already staked
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // issue tokens (interest)
    function issueTokens() public {
        // only allow owner to call this function
        require(msg.sender == owner, "caller must be the owner");

        // issue tokens to all stakers
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }

    // unstake tokens (withdraw)
    function unstakeTokens() public {
        // fetch staking balance
        uint256 balance = stakingBalance[msg.sender];

        // require amount to be greater than 0
        require(balance > 0, "staking balance can't be 0");

        // transfer mDai tokens to this contract for staking
        daiToken.transfer(msg.sender, balance);

        // reset staking balance
        stakingBalance[msg.sender] = 0;

        // update staking status
        isStaking[msg.sender] = false;
    }
}
