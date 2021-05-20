// SPDX-License-Identifier: MIT

pragma solidity >=0.7.6;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    // assign state variables
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    constructor(DappToken _dappToken, DaiToken _daiToken) {
        // above: type, variable name. The type is the smart contract itself.
        // this function will only run once when the contrct is deployed to the blockchain
        dappToken = _dappToken;
        daiToken = _daiToken;
    }
}
