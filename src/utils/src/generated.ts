//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Controller
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const controllerABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      {
        name: '_swapRouter',
        internalType: 'contract ISwapRouter',
        type: 'address',
      },
      { name: '_usdt', internalType: 'address', type: 'address' },
      { name: '_usdc', internalType: 'address', type: 'address' },
      { name: '_rs2', internalType: 'address', type: 'address' },
      { name: '_rs3', internalType: 'address', type: 'address' },
      { name: '_ps', internalType: 'uint128', type: 'uint128' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'contractName',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'contractAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ContractDeployed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ContractFunded',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'conversionContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'deployContracts',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [],
    name: 'fundContract',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'revenueSharingContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'storageContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'swapRouter',
    outputs: [
      { name: '', internalType: 'contract ISwapRouter', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'ticketPurchaseContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
] as const
