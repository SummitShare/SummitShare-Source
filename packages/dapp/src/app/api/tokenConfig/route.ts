import { NextRequest, NextResponse } from 'next/server';

interface TokenData {
  name: string;
  address: string;
  decimals: number;
}

// Sample token configuration data
const tokens: TokenData[] = [
  {
    name: 'Ether',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18,
  },
  {
    name: 'USDC',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
  },
  {
    name: 'DAI',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
  },
];

// Function to handle the GET request and respond with token configurations
export function GET(req: NextRequest) {
  try {
    // Generate a JSON response with token data and a 200 OK status
    const response = new NextResponse(JSON.stringify(tokens), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to retrieve tokens:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
