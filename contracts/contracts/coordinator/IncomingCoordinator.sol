// contracts/coordinator/IncomingCoordinator.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title Augmint CrossChain Protocol Coordinator for Incoming Requests.
/// @author SaratAngajala.
/// @notice This contract holds requests that are yet to be signed and delegates calls from here.
/// @dev Primary Augmint Coordinator is supposed to extend this contract.
contract IncomingCoordinator is ReentrancyGuard {
	enum IncomingRequestStatus {
		NOT_INITIATED,
		PENDING_USER_SIGNATURE,
		CALL_REVERTED,
		CALL_SUCCESSFULL
	}

    enum IncomingRequestType {
        WRITE,
        PAYMENT
    }
    
	struct IncomingRequest {
        IncomingRequestType requestType;
		uint256 requestId;
		IncomingRequestStatus status;
		address targetAddress;
		bytes callData;
		address signer;
        uint256 amount;
	}

	mapping(uint256 => IncomingRequest) private incomingRequests;

    event RequestCompleted(uint256 indexed requestId, bool isSuccess, bytes data);

	/// @notice This is for nodes to set incoming requests and their data for them to get signed.
	/// @param incomingRequestId Request id for the incoming request that has to be signed.
	/// @param targetAddress Address of the contract to send the callData to once signed.
	/// @param callData Data to be signed.
	/// @param signer Address that is supposed to sign the request.
	function acceptIncomingWriteRequest(
		uint256 incomingRequestId,
		address targetAddress,
		bytes calldata callData,
		address signer
	) external {
		incomingRequests[incomingRequestId] = IncomingRequest({
            requestType: IncomingRequestType.WRITE,
			requestId: incomingRequestId,
			status: IncomingRequestStatus.PENDING_USER_SIGNATURE,
			targetAddress: targetAddress,
			callData: callData,
			signer: signer,
            amount: 0
		});
	}

	function acceptIncomingPaymentRequest(
		uint256 incomingRequestId,
		address targetAddress,
        uint256 amount
	) external {
		incomingRequests[incomingRequestId] = IncomingRequest({
            requestType: IncomingRequestType.PAYMENT,
			requestId: incomingRequestId,
			status: IncomingRequestStatus.PENDING_USER_SIGNATURE,
			targetAddress: targetAddress,
            amount: amount,
			callData: bytes(""),
			signer: address(0)
		});
	}

    function makePayment(
        uint256 requestId
    ) external payable nonReentrant {
        IncomingRequest storage request = incomingRequests[requestId];

        require(request.status == IncomingRequestStatus.PENDING_USER_SIGNATURE, "AUGMINT_COORDINATOR: request not found");
        require(msg.value == request.amount, "AUGMINT_COORDINATOR: Amount mismatch");

        (bool success, bytes memory response) = payable(request.targetAddress).call{ value : request.amount }("");

        if(success) {
            request.status = IncomingRequestStatus.CALL_SUCCESSFULL;
            emit RequestCompleted(requestId, true, response);
        } else {
            request.status = IncomingRequestStatus.CALL_REVERTED;
            emit RequestCompleted(requestId, false, response);
        }
    }

    function getRequestDetails(
        uint256 requestId
    ) public view returns (IncomingRequest memory) {
        return incomingRequests[requestId];
    }
}
