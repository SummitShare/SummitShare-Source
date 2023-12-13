"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { gql } from "@apollo/client";
import { Card } from "@/components/ui/card";

interface Collection {
    id: string;
    baseURI: string;
    name: string;
    symbol: string;
    totalMinted: string;
}

interface Exhibit {
    id: string;
    museumId: string;
}


interface ExhibitCreated {
    name: string;
    location: string;
    details: string;
    ticketPrice: string;
    exhibit: Exhibit;
    collection: Collection;
}

interface SearchData {
    exhibitCreateds: ExhibitCreated[];
}

export const useSearch = () => {
    const searchResultsRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("...");
    const [searchResults, setSearchResults] = useState<ExhibitCreated[] | null>(null);


    const SEARCH_QUERY = gql`
    query GetExhibits($searchTerm: String!) {
        exhibitCreateds(where: { name_contains: $searchTerm }) {
          name
          location
          details
          ticketPrice
          exhibit {
            id
            museumId
          }
          collection {
            id
            baseURI
            name
            symbol
            totalMinted
          }
        }
      }
  `;

    const { data } = useSuspenseQuery<SearchData>(SEARCH_QUERY, { variables: { searchTerm } });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
                setSearchTerm("...");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (data && data.exhibitCreateds) {
            setSearchResults(data.exhibitCreateds);
        }
    }, [data]);

    const handleSearchChange = () => {
        const searchInput = document.getElementById('search') as HTMLInputElement;
        const searchValue = searchInput.value;
        setSearchTerm(searchValue);
    };

    return { data: searchResults, handleSearchChange, setSearchTerm, searchResultsRef };
};

// Component for displaying search results
interface SearchResultProps {
    data: any;
    searchResultsRef: React.RefObject<HTMLDivElement>;
}
import Link from 'next/link';


export const SearchResults: React.FC<SearchResultProps> = ({ data, searchResultsRef }) => (
    <div ref={searchResultsRef} className="absolute top-12 w-full bg-white shadow-lg rounded-md overflow-auto max-h-[200px]  ">
        {data.map((exhibit: any, index: any) => (
            <Link href={`/Profile/Exibition/${exhibit.exhibit.id}`} key={index}>

                <Card className="px-4 py-4  shadow-none border-0 rounded-none border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-sm font-semibold flex-grow">
                            {exhibit.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {exhibit.location}
                        </p>
                    </div>
                    <p className="text-xs text-gray-600">
                        {exhibit.details}
                    </p>
                </Card>

            </Link>
        ))}
    </div>
);