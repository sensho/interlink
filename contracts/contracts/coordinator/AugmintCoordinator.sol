// contracts/coordinator/AugmintCoordinator.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IncomingCoordinator.sol";
import "./OutgoingCoordinator.sol";

/// @title Augmint CrossChain Protocol Coordinator
/// @author SaratAngajala
/// @notice This contract handles aggregation of outgoingRequests for both source chain and target chain
/// @dev This contract will be deployed once per chain by augmint, calls coming from implementor contracts will all be aggregated here for nodes to pick up.
contract AugmintCoordinator is Ownable, IncomingCoordinator, OutgoingCoordinator {}
