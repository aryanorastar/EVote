// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title EVoteDAO
 * @dev A decentralized governance contract for local community decision-making
 */
contract EVoteDAO {
    // Structure for a proposal
    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 deadline;
        uint256 votesFor;
        uint256 votesAgainst
