//kovan address
export function getLoanContractAddress(networkVersion) {
  switch (networkVersion) {
    case 'local':
      return '0x2B922547600E3822F1f8f893274B7ECD4A75a54D'
    case '42':
      return '0x6Cd759C10578c8835df450f2AA21C620d16b57fB'
    case '1':
      return ''
    default:
      return '0x2B922547600E3822F1f8f893274B7ECD4A75a54D'
  }
}

export const loanAbi = [
  {
    constant: true,
    inputs: [],
    name: 'DAIContractAddress',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: 'loansByBorrower',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: 'loansByLender',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalLoanCount',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: 'loans',
    outputs: [
      {
        name: 'lender',
        type: 'address',
      },
      {
        name: 'borrower',
        type: 'address',
      },
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
      {
        name: 'dueDate',
        type: 'uint256',
      },
      {
        name: 'status',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: false,
        name: 'lender',
        type: 'address',
      },
      {
        indexed: false,
        name: 'name',
        type: 'string',
      },
      {
        indexed: false,
        name: 'dueDate',
        type: 'uint256',
      },
    ],
    name: 'LoanRequested',
    type: 'event',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_erc20Address',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'lender',
        type: 'address',
      },
    ],
    name: 'loanCountByLender',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'borrower',
        type: 'address',
      },
    ],
    name: 'loanCountByBorrower',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'lender',
        type: 'address',
      },
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
      {
        name: 'dueDate',
        type: 'uint256',
      },
    ],
    name: 'requestLoan',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'approveLoan',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'payDebt',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
