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

import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    Email: string;
    id: string; // Add the id field to the User interface
  }

  interface Session {
    user: User & DefaultSession["user"];
    token: {
      Email: string;
      id: string; // If you are also adding id to the token, include it here
    };
  }
}

