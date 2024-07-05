interface EventData {
  name: string;
  date: string;
  country: string;
  price: string;
  eventType: string;
  image: string;
}

export interface inputProps {
  text?: string;
  length: string;
  label?: string;
  name?: string;
  value?: any;
  type?: string;
  id?: any;
  onChange?: any;
  onClick?: any;
  reg: any;
}

import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    email: string;
    id: string; // Add the id field to the User interface
  }

  interface Session {
    user: User & DefaultSession['user'];
    token: {
      email: string;
      id: string;
      bio?: string;
      email_verified?: boolean;
      type?: string;
      user_wallets?: Array<{
        id: string;
        wallet_address: string;
        index?: number;
      }>;
    };
  }
  interface ExtendedUser extends User {
    username?: string;
    bio?: string;
    email_verified?: boolean;
    type?: string;
    user_wallets?: {
      id: string;
      user_id: string;
      wallet_address: string;
      index: number | null;
    }[];
  }

  // Extend the Session type to include additional user properties
  interface ExtendedSession extends Session {
    user: {
      id: string;
      name?: string;
      email: string;
      image?: string;
      username?: string;
      bio?: string;
      email_verified?: boolean;
      type?: string;
      user_wallets?: ExtendedJWT['user_wallets'];
    };
  }

  // Extend the JWT type to include your custom claims
  interface ExtendedJWT extends JWT {
    id?: string;
    username?: string;
    email?: string;
    bio?: string;
    email_verified?: boolean;
    type?: string;
    user_wallets?: Array<{
      id: string;
      wallet_address: string;
      index?: number;
    }>;
  }
}
