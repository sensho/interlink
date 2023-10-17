# Solidity API

## AugmintCoordinator

This contract handles aggregation of outgoingRequests for both source chain and target chain

_This contract will be deployed once per chain by augmint, calls coming from implementor contracts will all be aggregated here for nodes to pick up._

### OutgoingRequestStatus

```solidity
enum OutgoingRequestStatus {
  NOT_INITIATED,
  PENDING,
  FULLFILLED_SUCCESSFULLY_CALLBACK_FAILED,
  FULLFILLED_SUCCESSFULLY_CALLBACK_SUCCESSFULL,
  FULLFILLED_UNSUCCESSFULLY_CALLBACK_FAILED,
  FULLFILLED_UNSUCCESSFULLY_CALLBACK_SUCCESSFULL
}
```

### IncomingRequestStatus

```solidity
enum IncomingRequestStatus {
  NOT_INITIATED,
  PENDING_USER_SIGNATURE,
  CALL_REVERTED,
  CALL_SUCCESSFULL
}
```

### OutgoingRequest

```solidity
struct OutgoingRequest {
  bool isReadRequest;
  uint256 requestId;
  enum AugmintCoordinator.OutgoingRequestStatus status;
  address callbackAddress;
  string callbackSelector;
}
```

### IncomingRequest

```solidity
struct IncomingRequest {
  uint256 requestId;
  enum AugmintCoordinator.IncomingRequestStatus status;
  address targetContractAddress;
  bytes callData;
  address signer;
}
```

### ReadRequestInitated

```solidity
event ReadRequestInitated(uint256 chainId, address contractAddress, bytes callData, uint256 requestId)
```

Event for oracles to identify new read request.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| chainId | uint256 | EIP-155 id for the target chain. |
| contractAddress | address | Address of the contract to interact with on the target chain. |
| callData | bytes | Byte array of encoded calldata which can be generated by using abi.encodeCall(functionSignature,...arguments). |
| requestId | uint256 | Indexed uint256 unique identifier for the request. |

### WriteRequestInitated

```solidity
event WriteRequestInitated(uint256 chainId, address contractAddress, bytes callData, address signer, uint256 requestId)
```

Event for oracles to identify new read request.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| chainId | uint256 | EIP-155 id for the target chain. |
| contractAddress | address | Address of the contract to interact with on the target chain. |
| callData | bytes | Byte array of encoded calldata which can be generated by using abi.encodeCall(functionSignature,...arguments). |
| signer | address | Address of the user that is supposed to sign the contract on target chain. |
| requestId | uint256 | Indexed uint256 unique identifier for the request. |

### RequestFulfilled

```solidity
event RequestFulfilled(uint256 requestId, bool isFulfillmentSuccessful, bool isCallbackSuccessful, bytes returnData)
```

Event emitted when a request is fullfilled.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | Indexed uint256 unique identifier for the request. |
| isFulfillmentSuccessful | bool | Indexed boolean to indicate success/failure of fulfillment. |
| isCallbackSuccessful | bool | Indexed boolean to indicate success/failure of callback. |
| returnData | bytes | Byte array of any data returned by comutation on target chain. |

### initiateReadRequest

```solidity
function initiateReadRequest(uint256 chainId, address targetContractAddress, bytes callData, address callbackAddress, string callbackSelector) external returns (uint256 requestId)
```

Initiates a read request, should come from the AugmintExternalContract contract.

_Initiates a read request and emits and event for oracles to listen to._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| chainId | uint256 | EIP-155 id for the target chain. |
| targetContractAddress | address | Address of the contract to interact with on the target chain. |
| callData | bytes | Byte array of encoded calldata which can be generated by using abi.encodeCall(functionSignature,...arguments). |
| callbackAddress | address | Address of the contract the callback is on. |
| callbackSelector | string | Selector of the callback function. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | A uint256 unique identifier for the request. |

### initiateWriteRequest

```solidity
function initiateWriteRequest(uint256 chainId, address targetContractAddress, bytes callData, address signer, address callbackAddress, string callbackSelector) external returns (uint256 requestId)
```

Initiates a write request, should come from the AugmintExternalContract contract.

_Initiates a write request and emits and event for oracles to listen to._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| chainId | uint256 | EIP-155 id for the target chain. |
| targetContractAddress | address | Address of the contract to interact with on the target chain. |
| callData | bytes | Byte array of encoded calldata which can be generated by using abi.encodeCall(functionSignature,...arguments). |
| signer | address | Address of the user that is supposed to sign the contract on target chain. |
| callbackAddress | address | Address of the contract the callback is on. |
| callbackSelector | string | Selector of the callback function. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | A uint256 unique identifier for the request. |

### fullfillRequest

```solidity
function fullfillRequest(uint256 requestId, bool isFulfillmentSuccess, bytes returnData) external
```

Once a request has been fullfilled off the chain, result is to be committed here.

_Validates the request being fulfilled and calls the provided callback address using provided callback selector._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | Id of the request being fulfilled. |
| isFulfillmentSuccess | bool | Boolean flag to indicate success/failure of the request. |
| returnData | bytes | Any data returned by the computation on target chain. |

### acceptIncomingRequest

```solidity
function acceptIncomingRequest(uint256 incomingRequestId, address targetAddress, bytes callData, address signer) external
```

This is for nodes to set incoming requests and their data for them to get signed.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| incomingRequestId | uint256 | Request id for the incoming request that has to be signed. |
| targetAddress | address | Address of the contract to send the callData to once signed. |
| callData | bytes | Data to be signed. |
| signer | address | Address that is supposed to sign the request. |

### getDataToSign

```solidity
function getDataToSign(uint256 requestId) external view returns (bytes callData)
```

Returns a hash with encoded data for the user to sign.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | Id for the request to sign. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| callData | bytes | Calldata to be signed using the signers private key. |

### signIncomingRequest

```solidity
function signIncomingRequest(uint256 requestId, bytes signature) external
```

## AugmintExternalContract

Users should extend this contract from their contracts to integrate Augmint

_This contract is an object for holding all details regarding a contract on target blockchain to be interacted with._

### constructor

```solidity
constructor(uint256 _chainId, address _contractAddress, address _coordinatorAddress) public
```

Initiates a target contract object with required details.

_Recieves all required parameters for target chain contract interaction and provides an interface for target chain function calls._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _chainId | uint256 | EIP-155 specified id for the target chain. |
| _contractAddress | address | Address of the contract on the target chain. |
| _coordinatorAddress | address | Address of augmint coordinator on source chain. |

### sendReadRequest

```solidity
function sendReadRequest(bytes callData) external returns (uint256 requestId)
```

Initiates a read type request.

_Makes a call to the AugmintCoordinator to initiate a read request._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| callData | bytes | Byte array of encoded calldata which can be generated by using abi.encodeCall(functionSignature,...arguments) |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | A uint256 request id used to identify the initiated request. |

### sendWriteRequest

```solidity
function sendWriteRequest(bytes callData, address signer) external returns (uint256 requestId)
```

Initiates a write type request.

_Makes a call to the AugmintCoordinator to initiate a write request._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| callData | bytes | Byte array of encoded calldata which can be generated by using abi.encodeCall(functionSignature,...arguments). |
| signer | address | Address of the signer that is supposed to sign the transaction on target chain. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | A uint256 request id used to identify the initiated request. |

## AugmintCoordinator

This contract handles aggregation of outgoingRequests for both source chain and target chain

_This contract will be deployed once per chain by augmint, calls coming from implementor contracts will all be aggregated here for nodes to pick up._

## IncomingCoordinator

## OutgoingCoordinator

### OutgoingRequestStatus

```solidity
enum OutgoingRequestStatus {
  NOT_INITIATED,
  PENDING,
  FULLFILL_SUCCESS_CALLBACK_SUCCESS,
  FULLFILL_SUCCESS_CALLBACK_FAIL,
  FULLFILL_FAIL_CALLBACK_SUCCESS,
  FULLFILL_FAIL_CALLBACK_FAIL
}
```

### OutgoingRequestTypes

```solidity
enum OutgoingRequestTypes {
  CONTRACT_WRITE_REQUEST,
  NATIVE_PAYMENT_REQUEST,
  CONTRACT_READ_REQUEST,
  TOKEN_PAYMENT_REQUEST,
  BALANCE_QUERY_REQUEST
}
```

### OutgoingRequest

```solidity
struct OutgoingRequest {
  enum OutgoingCoordinator.OutgoingRequestTypes requestType;
  enum OutgoingCoordinator.OutgoingRequestStatus status;
  address callbackAddress;
  string callbackSelector;
  uint256 requestId;
}
```

### ContractReadRequestInitated

```solidity
event ContractReadRequestInitated(uint256 requestId, uint256 chainId, address contractAddress, bytes callData)
```

Event for oracles to identify new read request.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | Indexed uint256 unique identifier for the request. |
| chainId | uint256 | EIP-155 id for the target chain. |
| contractAddress | address | Address of the contract to interact with on the target chain. |
| callData | bytes | Byte array of encoded calldata which can be generated by using abi.encodeCall(functionSignature,...arguments). |

### ContractWriteRequestInitated

```solidity
event ContractWriteRequestInitated(uint256 requestId, uint256 chainId, address contractAddress, bytes callData, address signer)
```

Event for oracles to identify new write request.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | Indexed uint256 unique identifier for the request. |
| chainId | uint256 | EIP-155 id for the target chain. |
| contractAddress | address | Address of the contract to interact with on the target chain. |
| callData | bytes | Byte array of encoded calldata which can be generated by using abi.encodeCall(functionSignature,...arguments). |
| signer | address | Address of the user that is supposed to sign the contract on target chain. |

### NativePaymentRequestInitiated

```solidity
event NativePaymentRequestInitiated(uint256 requestId, uint256 chainId, address recepientAddress, uint256 amount)
```

Event for oracles to identify a native coin payment request.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | Indexed uint256 unique identifier for the request. |
| chainId | uint256 | EIP-155 id for the target chain. |
| recepientAddress | address | Address to recieve the payment to. |
| amount | uint256 | Amount to be recieved to the provided address. |

### TokenPaymentRequestInitiated

```solidity
event TokenPaymentRequestInitiated(uint256 requestId, uint256 chainId, address tokenAddress, address recepientAddress, uint256 amount)
```

Event for oracles to identify a ERC20 token payment request.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | Indexed uint256 unique identifier for the request. |
| chainId | uint256 | EIP-155 id for the target chain. |
| tokenAddress | address | Address of the contract for the token to recieve. |
| recepientAddress | address | Address to recieve the payment to. |
| amount | uint256 | Amount to be recieved to the provided address. |

### BalanceQueryRequestInitated

```solidity
event BalanceQueryRequestInitated(uint256 requestId, uint256 chainId, address queryAddress)
```

Event for oracles to identify a balance query request.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | Indexed uint256 unique identifier for the request. |
| chainId | uint256 | EIP-155 id for the target chain. |
| queryAddress | address | Address to query balance for. |

### RequestFulfilled

```solidity
event RequestFulfilled(uint256 requestId, bool isFulfillmentSuccessful, bool isCallbackSuccessful, bytes returnData)
```

Event emitted when a request is fullfilled.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | Indexed uint256 unique identifier for the request. |
| isFulfillmentSuccessful | bool | Indexed boolean to indicate success/failure of fulfillment. |
| isCallbackSuccessful | bool | Indexed boolean to indicate success/failure of callback. |
| returnData | bytes | Byte array of any data returned by comutation on target chain. |

### initiateContractReadRequest

```solidity
function initiateContractReadRequest(uint256 chainId, address targetContractAddress, bytes callData, address callbackAddress, string callbackSelector) external returns (uint256 requestId)
```

Initiates a read request, should come from the AugmintExternalContract contract.

_Initiates a read request and emits and event for oracles to listen to._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| chainId | uint256 | EIP-155 id for the target chain. |
| targetContractAddress | address | Address of the contract to interact with on the target chain. |
| callData | bytes | Byte array of encoded calldata which can be generated by using abi.encodeCall(functionSignature,...arguments). |
| callbackAddress | address | Address of the contract the callback is on. |
| callbackSelector | string | Selector of the callback function. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | A uint256 unique identifier for the request. |

### initiateContractWriteRequest

```solidity
function initiateContractWriteRequest(uint256 chainId, address targetContractAddress, bytes callData, address signer, address callbackAddress, string callbackSelector) external returns (uint256 requestId)
```

Initiates a write request, should come from the AugmintExternalContract contract.

_Initiates a write request and emits and event for oracles to listen to._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| chainId | uint256 | EIP-155 id for the target chain. |
| targetContractAddress | address | Address of the contract to interact with on the target chain. |
| callData | bytes | Byte array of encoded calldata which can be generated by using abi.encodeCall(functionSignature,...arguments). |
| signer | address | Address of the user that is supposed to sign the contract on target chain. |
| callbackAddress | address | Address of the contract the callback is on. |
| callbackSelector | string | Selector of the callback function. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | A uint256 unique identifier for the request. |

### initiateNativePaymentRequest

```solidity
function initiateNativePaymentRequest(uint256 chainId, address recepientAddress, uint256 amount, address callbackAddress, string callbackSelector) external returns (uint256 requestId)
```

### initiateTokenPaymentRequest

```solidity
function initiateTokenPaymentRequest(uint256 chainId, address tokenAddress, address recepientAddress, uint256 amount, address callbackAddress, string callbackSelector) external returns (uint256 requestId)
```

### fullfillRequest

```solidity
function fullfillRequest(uint256 requestId, bool isFulfillmentSuccess, bytes returnData) external
```

Once a request has been fullfilled off the chain, result is to be committed here.

_Validates the request being fulfilled and calls the provided callback address using provided callback selector._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | Id of the request being fulfilled. |
| isFulfillmentSuccess | bool | Boolean flag to indicate success/failure of the request. |
| returnData | bytes | Any data returned by the computation on target chain. |
