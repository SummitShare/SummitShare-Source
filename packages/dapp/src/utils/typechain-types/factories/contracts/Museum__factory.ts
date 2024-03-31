/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { Museum, MuseumInterface } from "../../contracts/Museum";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_usdcToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "museumAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "exhibitId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "exhibitAddress",
        type: "address",
      },
    ],
    name: "ExhibitCurated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "museumAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "ownerAddress",
        type: "address",
      },
    ],
    name: "MuseumCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "exhibit",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "TicketPurchased",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "exhibitId",
        type: "string",
      },
      {
        internalType: "contract ExhibitNFT",
        name: "exhibit",
        type: "address",
      },
    ],
    name: "curateExhibit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "exhibits",
    outputs: [
      {
        internalType: "contract ExhibitNFT",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "exhibitId",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "usdcAmount",
        type: "uint256",
      },
    ],
    name: "purchaseTicket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "usdcToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "exhibitId",
        type: "string",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "verifyTicketOwnership",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610a71380380610a7183398101604081905261002f91610133565b338061005557604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b61005e816100e3565b50600180546001600160a01b0319166001600160a01b0383169081179091557ff1a5446bc53b16ec57cd4774b1408bb92d439f3394291d387e1007275ac418a89030906100b36000546001600160a01b031690565b604080516001600160a01b039485168152928416602084015292168183015290519081900360600190a150610163565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60006020828403121561014557600080fd5b81516001600160a01b038116811461015c57600080fd5b9392505050565b6108ff806101726000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c80638da5cb5b1161005b5780638da5cb5b1461011e5780639c49601f1461012f578063f2fde38b14610142578063fbe7ae191461015557600080fd5b806311eac8551461008d578063715018a6146100bd5780637d41c689146100c757806387088625146100ea575b600080fd5b6001546100a0906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b6100c5610168565b005b6100da6100d53660046106ef565b61017c565b60405190151581526020016100b4565b6100a06100f8366004610741565b80516020818301810180516002825292820191909301209152546001600160a01b031681565b6000546001600160a01b03166100a0565b6100c561013d36600461077e565b610214565b6100c56101503660046107c3565b6104f6565b6100c56101633660046106ef565b610534565b6101706105ba565b61017a60006105e7565b565b60008060028460405161018f919061080b565b908152604051908190036020018120546370a0823160e01b82526001600160a01b03858116600484015216915060009082906370a0823190602401602060405180830381865afa1580156101e7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061020b9190610827565b11949350505050565b6000600283604051610226919061080b565b908152604051908190036020019020546001600160a01b03169050806102935760405162461bcd60e51b815260206004820152601760248201527f4578686962697420646f6573206e6f742065786973742e00000000000000000060448201526064015b60405180910390fd5b6000816001600160a01b0316631209b1f66040518163ffffffff1660e01b8152600401602060405180830381865afa1580156102d3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102f79190610827565b9050808310156103495760405162461bcd60e51b815260206004820152601760248201527f496e73756666696369656e7420555344432073656e742e000000000000000000604482015260640161028a565b6000826001600160a01b031663e2fdcc176040518163ffffffff1660e01b8152600401602060405180830381865afa158015610389573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103ad9190610840565b6001546040516323b872dd60e01b81523360048201526001600160a01b038084166024830152604482018690529293509116906323b872dd906064016020604051808303816000875af1158015610408573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061042c919061085d565b61043557600080fd5b604051630474de9360e11b81523360048201526000906001600160a01b038516906308e9bd26906024016020604051808303816000875af115801561047e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104a29190610827565b604080513381526001600160a01b03871660208201529081018290529091507f46c5a89a1e066b5bcda22269562318e5aa065997bf8b36af3a6b37b87852d8909060600160405180910390a1505050505050565b6104fe6105ba565b6001600160a01b03811661052857604051631e4fbdf760e01b81526000600482015260240161028a565b610531816105e7565b50565b61053c6105ba565b8060028360405161054d919061080b565b90815260405190819003602001812080546001600160a01b03939093166001600160a01b0319909316929092179091557fbc45f682a190f0a04152cffc883bbae27c155378327355d79c31b476dfc0e180906105ae9030908590859061087f565b60405180910390a15050565b6000546001600160a01b0316331461017a5760405163118cdaa760e01b815233600482015260240161028a565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261065e57600080fd5b813567ffffffffffffffff8082111561067957610679610637565b604051601f8301601f19908116603f011681019082821181831017156106a1576106a1610637565b816040528381528660208588010111156106ba57600080fd5b836020870160208301376000602085830101528094505050505092915050565b6001600160a01b038116811461053157600080fd5b6000806040838503121561070257600080fd5b823567ffffffffffffffff81111561071957600080fd5b6107258582860161064d565b9250506020830135610736816106da565b809150509250929050565b60006020828403121561075357600080fd5b813567ffffffffffffffff81111561076a57600080fd5b6107768482850161064d565b949350505050565b6000806040838503121561079157600080fd5b823567ffffffffffffffff8111156107a857600080fd5b6107b48582860161064d565b95602094909401359450505050565b6000602082840312156107d557600080fd5b81356107e0816106da565b9392505050565b60005b838110156108025781810151838201526020016107ea565b50506000910152565b6000825161081d8184602087016107e7565b9190910192915050565b60006020828403121561083957600080fd5b5051919050565b60006020828403121561085257600080fd5b81516107e0816106da565b60006020828403121561086f57600080fd5b815180151581146107e057600080fd5b600060018060a01b0380861683526060602084015284518060608501526108ad8160808601602089016107e7565b9316604083015250601f91909101601f1916016080019291505056fea264697066735822122053962e2b083dd21874c64c585a89e760a7d261d90d7cdbcf5af52ca261a3df7964736f6c63430008140033";

type MuseumConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MuseumConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Museum__factory extends ContractFactory {
  constructor(...args: MuseumConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _usdcToken: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_usdcToken, overrides || {});
  }
  override deploy(
    _usdcToken: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_usdcToken, overrides || {}) as Promise<
      Museum & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Museum__factory {
    return super.connect(runner) as Museum__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MuseumInterface {
    return new Interface(_abi) as MuseumInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Museum {
    return new Contract(address, _abi, runner) as unknown as Museum;
  }
}
