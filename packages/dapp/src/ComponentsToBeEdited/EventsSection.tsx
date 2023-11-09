"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import DateFilter from "@/app/(UserPages)/UserPagecomponents/Filters/DateFilter";
import CountryFilter from "@/app/(UserPages)/UserPagecomponents/Filters/CountryFilter";
import EventTypeFilter from "@/app/(UserPages)/UserPagecomponents/Filters/EventTypeFilter";
import PaginationControls from "@/app/(UserPages)/UserPagecomponents/Filters/Pagination";
import EventCard from "@/app/(UserPages)/UserPagecomponents/EventCard";

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

const dummyData: EventData[] = [
  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Lusaka museum",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1565876427310-0695a4ff03b7?q=80&w=2593&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1514195037031-83d60ed3b448?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGFydCUyMGdhbGxlcnl8ZW58MHx8MHx8fDA%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1698402926566-240a7adb1523?auto=format&fit=crop&q=80&w=2531&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1513038630932-13873b1a7f29?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },

  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1698402926566-240a7adb1523?auto=format&fit=crop&q=80&w=2531&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },

  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1698402926566-240a7adb1523?auto=format&fit=crop&q=80&w=2531&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1698402926566-240a7adb1523?auto=format&fit=crop&q=80&w=2531&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1698402926566-240a7adb1523?auto=format&fit=crop&q=80&w=2531&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1698402926566-240a7adb1523?auto=format&fit=crop&q=80&w=2531&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1698402926566-240a7adb1523?auto=format&fit=crop&q=80&w=2531&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1698402926566-240a7adb1523?auto=format&fit=crop&q=80&w=2531&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1698402926566-240a7adb1523?auto=format&fit=crop&q=80&w=2531&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1698402926566-240a7adb1523?auto=format&fit=crop&q=80&w=2531&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1698402926566-240a7adb1523?auto=format&fit=crop&q=80&w=2531&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "jamaca",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1698402926566-240a7adb1523?auto=format&fit=crop&q=80&w=2531&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },

  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1698402926566-240a7adb1523?auto=format&fit=crop&q=80&w=2531&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "b",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1698402926566-240a7adb1523?auto=format&fit=crop&q=80&w=2531&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
  {
    coverPhoto: "event-cover-1.jpg",
    accountName: "John Doe",
    adminPhoto: "admin-photo-1.jpg",
    adminName: "Admin 1",
    bio: "John Doe's bio",
    galleyImages: ["gallery-image-1.jpg", "gallery-image-2.jpg"],
    pastEvents: [
      {
        name: "Past Event 1",
        eventType: "Conference",
        eventDescription: "A previous conference by John Doe.",
        image: "past-event-image-1.jpg",
        price: "$80",
        eventTimeStart: "10:00 AM",
        eventTimeEnd: "04:00 PM",
      },
      {
        name: "Past Event 2",
        eventType: "Workshop",
        eventDescription: "A past workshop organized by John Doe.",
        image: "past-event-image-2.jpg",
        price: "$60",
        eventTimeStart: "11:30 AM",
        eventTimeEnd: "03:30 PM",
      },
    ],
    id: "1",
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "a",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1698402926566-240a7adb1523?auto=format&fit=crop&q=80&w=2531&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
];

const TicketsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "today" | "week" | "month" | "year"
  >("today");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedEventType, setSelectedEventType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>(dummyData);
  const recordsPerPage = 6;

  useEffect(() => {
    // Filter logic inside useEffect which will run when dependencies change
    const filtered = dummyData.filter((event) => {
      setCurrentPage(0);
      // Filtering by country
      if (selectedCountry && event.country !== selectedCountry) {
        return false;
      }
      // Filtering by event type
      if (selectedEventType && event.eventType !== selectedEventType) {
        return false;
      }
      // Filtering by activeTab (date logic)
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Clear time part for accurate comparison

      switch (activeTab) {
        case "today":
          return eventDate.toDateString() === today.toDateString();
        case "week": {
          let startOfWeek = new Date(today);
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Assuming the week starts on Sunday
          let endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(endOfWeek.getDate() + 6);
          return eventDate >= startOfWeek && eventDate <= endOfWeek;
        }
        case "month": {
          let startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          let endOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
          );
          return eventDate >= startOfMonth && eventDate <= endOfMonth;
        }
        case "year": {
          let startOfYear = new Date(today.getFullYear(), 0, 1);
          let endOfYear = new Date(today.getFullYear(), 11, 31);
          return eventDate >= startOfYear && eventDate <= endOfYear;
        }
        default:
          return true; // No date filter applied
      }
    });

    setFilteredEvents(filtered);
  }, [selectedCountry, selectedEventType, activeTab]);

  const startIndex = currentPage * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const totalPages = Math.ceil(filteredEvents.length / recordsPerPage);

  return (
    <div className="container mx-auto p-4 space-y-10">
      <div className="flex flex-row justify-between">
        <DateFilter activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex flex-row gap-2">
          <CountryFilter
            onCountryChange={setSelectedCountry}
            uniqueCountries={getUniqueCountries(dummyData)}
          />
          <EventTypeFilter
            onEventTypeChange={setSelectedEventType}
            uniqueEventTypes={getUniqueEventTypes(dummyData)}
          />
        </div>
      </div>

      <div className="relative flex flex-row gap-3 w-full group mt-6">
        {filteredEvents.slice(startIndex, endIndex).map((event) => (
          <EventCard event={event} />
        ))}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default TicketsList;

// Helper functions to extract unique countries and event types
function getUniqueCountries(events: EventData[]) {
  return Array.from(new Set(events.map((event) => event.country)));
}

function getUniqueEventTypes(events: EventData[]) {
  return Array.from(new Set(events.map((event) => event.eventType)));
}
