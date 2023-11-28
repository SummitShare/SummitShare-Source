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
  }

  interface Session {
    user: User & {
      Email: string;
    };
    token: {
      Email: string;
    };
  }
}
