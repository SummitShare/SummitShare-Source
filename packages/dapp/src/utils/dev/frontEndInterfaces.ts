/*
Category: Front End Components
Purpose: Types for React components for the front end 
*/
import { ReactNode } from 'react';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { EmailArray } from './typeInit';
import { ethers } from 'ethers';

// auth-register/page.tsx
export interface authUserProps {
   userName: string;
   email: string;
   walletAddress: string;
   password: string;
}

// auth-sign-in/page.tsx
export interface authUserSignIn {
   email: string;
   password: string;
}

// (main)/event/ticket/[slug]/page.tsx
export interface EventData {
   name: string;
   date: string;
   country: string;
   price: string;
   eventType: string;
   image: string;
}

// (main)/notifications/page.tsx
export interface notificationProps {
   title: string;
   message: string;
   dateTime: string;
}

// common/button
export interface buttonProps
   extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   children: ReactNode;
   text: string;
   width: string;
   click?: () => void;
}

// functonal/contryFilter/countryFilter.tsx
export interface CountryFilterProps {
   onCountryChange: (country: string) => void; // Callback function when a country is selected
   uniqueCountries: string[]; // Array of unique country names
}

// functonal/datePicker/dateFilter.tsx
export interface DateFilterProps {
   activeTab: 'today' | 'week' | 'month' | 'year';
   onTabChange: (tab: 'today' | 'week' | 'month' | 'year') => void;
}

// functonal/pagination/pagination.tsx
export interface PaginationControlsProps {
   currentPage: number; // The current active page
   totalPages: number; // Total number of pages
   onPageChange: (page: number) => void; // Function to call when a new page is selected
}

// functonal/selectType/selectType.tsx
export interface SelectComponentProps
   extends React.SelectHTMLAttributes<HTMLSelectElement> {
   options: string[];
   first: string;
   type:
      | 'eventType'
      | 'eventCountryType'
      | 'event_timezone'
      | 'event_category'
      | 'event_location'
      | 'event_type';
}

// common/inputs/input/input.tsx
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   label?: string;
   name: string;
   description?: string;
   message?: any;
   register: UseFormRegister<any>;
   need?: boolean; // Demonstrates an optional prop for additional validation or UI indication
   showPassword?: boolean;
}

// common/inputs/input/teaxtArea.tsx
export interface TextAreaProps
   extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
   label?: string;
   name: string;
   description?: string;
   message?: string;
   register: UseFormRegister<any>;
}

// packages/dapp/src/app/components/common/inputs/mulitInput/mulitInput.tsx
export interface RequestProps {
   user_id: string;
   proposal: IProposal;
   emails: EmailArray; // For individual email input
}

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
}

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
}

// common/select/select.tsx
export interface SelectComponentTypes {
   options: string[];
   placeholder?: string;
   width?: string;
   first: string;
}

// lib/useSearch.tsx
export interface Collection {
   id: string;
   baseURI: string;
   name: string;
   symbol: string;
   totalMinted: string;
}

export interface Exhibit {
   id: string;
   museumId: string;
}

export interface ExhibitCreated {
   name: string;
   location: string;
   details: string;
   ticketPrice: string;
   exhibit: Exhibit;
   collection: Collection;
}

export interface SearchData {
   exhibitCreateds: ExhibitCreated[];
}

// lib/useGetRecentExhibit
export interface RecentExhibitsData {
   exhibitCreateds: ExhibitCreated[];
}

// useGetExhibitByID
export interface ExhibitDetail {
   baseURI: string;
   name: string;
   location: string;
   details: string;
   collection: Collection;
   ticketPrice: string;
}

// blog usage for notes props
export interface BlogProps {
   notes: Note[];
}

export interface NoteProps {
   title: string;
   content: string; // Defining the type for the props of the Note component
}

export interface Note {
   id: string;
   title: string;
   tags: string[];
   createdAt: number;
   titleUpdatedAt: number;
   tagsUpdatedAt: number | null;
   publishType: string;
   publishedAt: number;
   permalink: string | null;
   publishLink: string;
   shortId: string;
   content: string;
   lastChangedAt: number;
   lastChangeUser: {
      name: string;
      photo: string;
      biography: string;
      userPath: string;
   };
   userPath: string;
   teamPath: string | null;
   readPermission: string;
   writePermission: string;
}

// Create ticket component

export interface createTicketProps {
   user_id: string;
   eventLink: string;
   userAddress: string;
   exhbitId: string;
}

// exhibit details slug
export interface ObjectDescription {
   title: string;
   object_URL?: string | ReactNode;
   object_name: string;
   Object_description: string[][];
   Figure_artifact_details: string;
   figure_images_URLs: string[];
   figure_details: string[][];
   figure_biography: string[][];
   figure_references: string[][];
}

// Help pages steps
// Define an interface for the step
export interface Step {
   id: number;
   title: string;
   description: React.ReactNode; // Since description contains JSX, we use React.ReactNode
}

// Define an interface for the StepCard props
export interface StepCardProps {
   step: Step;
   isActive: boolean;
   isCompleted: boolean;
   onClick: () => void; // Function that takes no arguments and returns nothing
}

export interface ButtonConfig {
   text: string;
   action: () => void;
   type: 'primary' | 'secondary';
}

export interface TicketPurchaseUIProps {
   // User and Authentication
   userAddress: string;
   setHasTicket: (hasTicket: boolean) => void;
   hasTicket: boolean;

   // Button States and Controls
   buttonType: 'primary' | 'secondary' | 'tartary' | 'subTartary';
   setButtonType: (
      type: 'primary' | 'secondary' | 'tartary' | 'subTartary'
   ) => void;
   buttonText: string;
   buttonConfig: ButtonConfig;
   isProcessing: boolean;

   // Status and Messages
   status: string;
   isVisible: boolean;
   showSuccessMessage: boolean;
   closeSuccessMessage: () => void;

   // Purchase State
   purchaseSuccessful: boolean;
   isCountdownOver: boolean;

   // Popup and Interaction States
   isPopupVisible: boolean;
   togglePopup: () => void;
   isHovering: boolean;
   setIsHovering: (isHovering: boolean) => void;

   // Price and Gas Information
   estimatedGasFees: string;
   isEstimating: boolean;
   ticketPriceWithToken: string;
   ticketPriceFormatted: string;
   calculateTotalPrice: () => string;

   // Core Functions
   purchaseTicket: () => void;
}

// Additional shared types
export interface TransactionDetails {
   hash: string;
   from: string;
   to: string;
   value: string;
}

export interface PurchaseResult {
   success: boolean;
   transactionHash?: string;
   error?: string;
}

// Optional: Add validation helper
export const validateTicketPurchaseProps = (
   props: Partial<TicketPurchaseUIProps>
): props is TicketPurchaseUIProps => {
   const requiredProps: (keyof TicketPurchaseUIProps)[] = [
      'userAddress',
      'setHasTicket',
      'buttonType',
      'setButtonType',
      'buttonText',
      'status',
      'purchaseSuccessful',
      'isCountdownOver',
      'showSuccessMessage',
      'togglePopup',
      'purchaseTicket',
      'buttonConfig',
      'isVisible',
      'isPopupVisible',
      'estimatedGasFees',
      'isEstimating',
      'isProcessing',
      'closeSuccessMessage',
      'hasTicket',
      'ticketPriceWithToken',
      'calculateTotalPrice',
      'ticketPriceFormatted',
      'isHovering',
      'setIsHovering',
   ];

   return requiredProps.every((prop) => prop in props);
};

// utils/ticketPurchaseLogic

export interface PurchaseHandlerProps {
   provider: ethers.providers.Web3Provider | null;
   ticketPrice: string;
   eventId: string;
   user_id: string;
   setStatus: (status: string) => void;
   setIsProcessing: (isProcessing: boolean) => void;
   setButtonText: (text: string) => void;
   setPurchaseSuccessful: (success: boolean) => void;
   setShowSuccessMessage: (show: boolean) => void;
}
