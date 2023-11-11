interface EventData {
  coverPhoto: string;
  accountName: string;
  adminPhoto: string;
  adminName: string;
  bio: string;
  galleyImages: string[];
  pastEvents: {}[];
  id: string;
  name: string;
  date: string;
  country: string;
  eventType: string;
  eventDescription: string;
  image: string;
  price: string;
  eventTimeStart: string;
  eventTimeEnd: string;
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
