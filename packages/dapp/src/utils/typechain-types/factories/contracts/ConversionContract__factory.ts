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
import type {
  ConversionContract,
  ConversionContractInterface,
} from "../../contracts/ConversionContract";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_uniswapRouter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_controller",
        type: "address",
      },
      {
        internalType: "address",
        name: "_usdt",
        type: "address",
      },
      {
        internalType: "address",
        name: "_usdc",
        type: "address",
      },
      {
        internalType: "address",
        name: "_storageContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "storageContract",
        type: "address",
      },
    ],
    name: "Conversion",
    type: "event",
  },
  {
    inputs: [],
    name: "controller",
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
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountOutMinimum",
        type: "uint256",
      },
    ],
    name: "convertUSDTtoUSDC",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initialApprove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_swapRouter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_controller",
        type: "address",
      },
      {
        internalType: "address",
        name: "_usdt",
        type: "address",
      },
      {
        internalType: "address",
        name: "_usdc",
        type: "address",
      },
      {
        internalType: "address",
        name: "_storageContract",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_storageContract",
        type: "address",
      },
    ],
    name: "setStorageContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "storageContract",
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
    inputs: [],
    name: "swapRouter",
    outputs: [
      {
        internalType: "contract ISwapRouter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "usdc",
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
    inputs: [],
    name: "usdt",
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
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620013a7380380620013a78339818101604052810190620000379190620000ac565b505050505062000134565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620000748262000047565b9050919050565b620000868162000067565b81146200009257600080fd5b50565b600081519050620000a6816200007b565b92915050565b600080600080600060a08688031215620000cb57620000ca62000042565b5b6000620000db8882890162000095565b9550506020620000ee8882890162000095565b9450506040620001018882890162000095565b9350506060620001148882890162000095565b9250506080620001278882890162000095565b9150509295509295909350565b61126380620001446000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c80633e413bee116100665780633e413bee14610120578063495cd7221461013e578063c31c9c0714610148578063dc38b0a214610166578063f77c47911461018257610093565b80630d8503061461009857806311ce0267146100c85780631459457a146100e65780632f48ab7d14610102575b600080fd5b6100b260048036038101906100ad9190610a7a565b6101a0565b6040516100bf9190610ac9565b60405180910390f35b6100d061050f565b6040516100dd9190610b25565b60405180910390f35b61010060048036038101906100fb9190610b6c565b610535565b005b61010a610711565b6040516101179190610b25565b60405180910390f35b610128610737565b6040516101359190610b25565b60405180910390f35b61014661075d565b005b61015061085c565b60405161015d9190610c46565b60405180910390f35b610180600480360381019061017b9190610c61565b610880565b005b61018a6108c4565b6040516101979190610b25565b60405180910390f35b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610232576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161022990610d11565b60405180910390fd5b6000600267ffffffffffffffff81111561024f5761024e610d31565b5b60405190808252806020026020018201604052801561027d5781602001602082028036833780820191505090505b509050600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16816000815181106102b7576102b6610d60565b5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168160018151811061032857610327610d60565b5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250506000816040516020016103759190610e4d565b604051602081830303815290604052905060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663c04b8d596040518060a00160405280858152602001600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600f426104219190610e9e565b8152602001898152602001888152506040518263ffffffff1660e01b815260040161044c9190610fe7565b6020604051808303816000875af115801561046b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061048f919061101e565b9050600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167faaa4b2048061a375cf651aa7fc1f1dd79339417406b0b83d0722ad30d312b32787836040516104fb92919061104b565b60405180910390a280935050505092915050565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600073ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146105c6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105bd906110c0565b60405180910390fd5b846000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146107ed576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107e490610d11565b60405180910390fd5b61085a600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff167fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6108ea565b565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b80600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000808473ffffffffffffffffffffffffffffffffffffffff1663095ea7b360e01b858560405160240161091f9291906110e0565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040516109899190611145565b6000604051808303816000865af19150503d80600081146109c6576040519150601f19603f3d011682016040523d82523d6000602084013e6109cb565b606091505b50915091508180156109f957506000815114806109f85750808060200190518101906109f79190611194565b5b5b610a38576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a2f9061120d565b60405180910390fd5b5050505050565b600080fd5b6000819050919050565b610a5781610a44565b8114610a6257600080fd5b50565b600081359050610a7481610a4e565b92915050565b60008060408385031215610a9157610a90610a3f565b5b6000610a9f85828601610a65565b9250506020610ab085828601610a65565b9150509250929050565b610ac381610a44565b82525050565b6000602082019050610ade6000830184610aba565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610b0f82610ae4565b9050919050565b610b1f81610b04565b82525050565b6000602082019050610b3a6000830184610b16565b92915050565b610b4981610b04565b8114610b5457600080fd5b50565b600081359050610b6681610b40565b92915050565b600080600080600060a08688031215610b8857610b87610a3f565b5b6000610b9688828901610b57565b9550506020610ba788828901610b57565b9450506040610bb888828901610b57565b9350506060610bc988828901610b57565b9250506080610bda88828901610b57565b9150509295509295909350565b6000819050919050565b6000610c0c610c07610c0284610ae4565b610be7565b610ae4565b9050919050565b6000610c1e82610bf1565b9050919050565b6000610c3082610c13565b9050919050565b610c4081610c25565b82525050565b6000602082019050610c5b6000830184610c37565b92915050565b600060208284031215610c7757610c76610a3f565b5b6000610c8584828501610b57565b91505092915050565b600082825260208201905092915050565b7f4f6e6c792074686520636f6e74726f6c6c65722063616e20706572666f726d2060008201527f7468697320616374696f6e2e0000000000000000000000000000000000000000602082015250565b6000610cfb602c83610c8e565b9150610d0682610c9f565b604082019050919050565b60006020820190508181036000830152610d2a81610cee565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b610dc481610b04565b82525050565b6000610dd68383610dbb565b60208301905092915050565b6000602082019050919050565b6000610dfa82610d8f565b610e048185610d9a565b9350610e0f83610dab565b8060005b83811015610e40578151610e278882610dca565b9750610e3283610de2565b925050600181019050610e13565b5085935050505092915050565b60006020820190508181036000830152610e678184610def565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610ea982610a44565b9150610eb483610a44565b9250828201905080821115610ecc57610ecb610e6f565b5b92915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610f0c578082015181840152602081019050610ef1565b60008484015250505050565b6000601f19601f8301169050919050565b6000610f3482610ed2565b610f3e8185610edd565b9350610f4e818560208601610eee565b610f5781610f18565b840191505092915050565b610f6b81610a44565b82525050565b600060a0830160008301518482036000860152610f8e8282610f29565b9150506020830151610fa36020860182610dbb565b506040830151610fb66040860182610f62565b506060830151610fc96060860182610f62565b506080830151610fdc6080860182610f62565b508091505092915050565b600060208201905081810360008301526110018184610f71565b905092915050565b60008151905061101881610a4e565b92915050565b60006020828403121561103457611033610a3f565b5b600061104284828501611009565b91505092915050565b60006040820190506110606000830185610aba565b61106d6020830184610aba565b9392505050565b7f436f6e74726f6c6c65722068617320616c7265616479206265656e207365742e600082015250565b60006110aa602083610c8e565b91506110b582611074565b602082019050919050565b600060208201905081810360008301526110d98161109d565b9050919050565b60006040820190506110f56000830185610b16565b6111026020830184610aba565b9392505050565b600081905092915050565b600061111f82610ed2565b6111298185611109565b9350611139818560208601610eee565b80840191505092915050565b60006111518284611114565b915081905092915050565b60008115159050919050565b6111718161115c565b811461117c57600080fd5b50565b60008151905061118e81611168565b92915050565b6000602082840312156111aa576111a9610a3f565b5b60006111b88482850161117f565b91505092915050565b7f5341000000000000000000000000000000000000000000000000000000000000600082015250565b60006111f7600283610c8e565b9150611202826111c1565b602082019050919050565b60006020820190508181036000830152611226816111ea565b905091905056fea2646970667358221220bdf36883c42145e9a3bf5851cf7b285a135ab2ce0cfe0514c17ed249375b8a3e64736f6c63430008140033";

type ConversionContractConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ConversionContractConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ConversionContract__factory extends ContractFactory {
  constructor(...args: ConversionContractConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _uniswapRouter: AddressLike,
    _controller: AddressLike,
    _usdt: AddressLike,
    _usdc: AddressLike,
    _storageContract: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _uniswapRouter,
      _controller,
      _usdt,
      _usdc,
      _storageContract,
      overrides || {}
    );
  }
  override deploy(
    _uniswapRouter: AddressLike,
    _controller: AddressLike,
    _usdt: AddressLike,
    _usdc: AddressLike,
    _storageContract: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _uniswapRouter,
      _controller,
      _usdt,
      _usdc,
      _storageContract,
      overrides || {}
    ) as Promise<
      ConversionContract & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ConversionContract__factory {
    return super.connect(runner) as ConversionContract__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ConversionContractInterface {
    return new Interface(_abi) as ConversionContractInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ConversionContract {
    return new Contract(address, _abi, runner) as unknown as ConversionContract;
  }
}
