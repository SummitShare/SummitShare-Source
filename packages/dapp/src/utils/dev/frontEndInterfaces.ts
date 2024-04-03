/*
Category: Front End Components
Purpose: Types for React components for the front end 
*/
import { ReactNode } from "react";
import React from "react";
import { UseFormRegister } from "react-hook-form";

// auth-register/page.tsx
export interface authUserProps {
    userName: string;
    email: string;
    walletAddress: string;
    password: string;
};

// auth-sign-in/page.tsx
export interface authUserSignIn {
    email: string;
    password: string;
};

// (main)/event/ticket/[slug]/page.tsx
export interface EventData {
    name: string;
    date: string;
    country: string;
    price: string;
    eventType: string;
    image: string;
};

// (main)/notifications/page.tsx
export interface notificationProps {
    title: string;
    message: string;
    dateTime: string; 
};

// common/button
export interface buttonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    text: string;
    width: string;
    click?: () => void;
};

// functonal/contryFilter/countryFilter.tsx
export interface CountryFilterProps {
    onCountryChange: (country: string) => void; // Callback function when a country is selected
    uniqueCountries: string[]; // Array of unique country names
};

// functonal/datePicker/dateFilter.tsx
export interface DateFilterProps {
    activeTab: "today" | "week" | "month" | "year";
    onTabChange: (tab: "today" | "week" | "month" | "year") => void;
};

// functonal/pagination/pagination.tsx
export interface PaginationControlsProps {
    currentPage: number; // The current active page
    totalPages: number; // Total number of pages
    onPageChange: (page: number) => void; // Function to call when a new page is selected
};

  // functonal/selectType/selectType.tsx
export interface SelectComponentProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  first: string;
  type:
    | "eventType"
    | "eventCountryType"
    | "event_timezone"
    | "event_category"
    | "event_location";
};

// common/inputs/input/input.tsx
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    name: string;
    description?: string;
    message?: any;
    register: UseFormRegister<any>;
    need?: boolean; // Demonstrates an optional prop for additional validation or UI indication
};

// common/inputs/input/teaxtArea.tsx
export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name: string;
  description?: string;
  message?: string;
  register: UseFormRegister<any>;
};

// packages/dapp/src/app/components/common/inputs/mulitInput/mulitInput.tsx
export interface RequestProps {
    eventName: string;
    email: string; // For individual email input
};

// common/inputs/mulitInput/proposal/proposal.tsx
export interface IProposal {
    event_type: string;
    event_name?: string;
    event_category?: string;
    event_start_time?: Date;
    symbol?: string;
    event_timezone?: string;
    event_location?: string;
    description?: string;
    contract_address?: string;
    event_end_time?: Date;
    cost?: number;
    total_number_tickets?: number;
};

// common/productCards/productCard.tsx
export interface productCardsTypes {
    author: string;
    title: string;
    price: string;
    detailOne: string;
    detailTwo: string;
    valueOne: string;
    valueTwo: string;
    //image: string; //  uncommenting for dynamic image URLs
};

// common/select/select.tsx
export interface SelectComponentTypes {
    options: string[];
    placeholder?: string;
    width?: string;
    first: string;
};

// lib/useSearch.tsx
export interface Collection {
    id: string;
    baseURI: string;
    name: string;
    symbol: string;
    totalMinted: string;
};
  
export interface Exhibit {
    id: string;
    museumId: string;
};
  
export interface ExhibitCreated {
    name: string;
    location: string;
    details: string;
    ticketPrice: string;
    exhibit: Exhibit;
    collection: Collection;
};
  
export interface SearchData {
    exhibitCreateds: ExhibitCreated[];
};

// lib/useGetRecentExhibit 
export interface RecentExhibitsData {
    exhibitCreateds: ExhibitCreated[];
};

// useGetExhibitByID

