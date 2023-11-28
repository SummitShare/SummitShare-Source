"use client";
import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";

interface Collection {
    name: string;
    symbol: string;
}

interface ExhibitDetail {
    baseURI: string;
    name: string;
    location: string;
    details: string;
    collection: Collection;
    ticketPrice: string;
}

interface Exhibit {
    id: string;
    totalMinted: string;
    exhibitDetails: ExhibitDetail[];
}

const useExhibit = (id: string): Exhibit | null => {
    const [exhibit, setExhibit] = useState<Exhibit | null>(null);

    const EXHIBIT_QUERY = gql`
        query GetExhibit($id: ID!) {
            exhibit(id: $id) {
                id
                totalMinted
                exhibitDetails {
                    baseURI
                    name
                    location
                    details
                    collection {
                        name
                        symbol
                    }
                    ticketPrice
                }
            }
        }
    `;

    const { data } = useQuery<{ exhibit: Exhibit }>(EXHIBIT_QUERY, {
        variables: { id },
    });

    useEffect(() => {
        if (data && data.exhibit) {
            setExhibit(data.exhibit);
        }
    }, [data]);

    return exhibit;
};

export default useExhibit;

/*
 * Usage:
 * 
 * import useExhibit from './useExhibit';
 * 
 * function MyComponent() {
 *   const id = '0x9da59e03c4512d6b47f84522452b53d1250459d8'; // The ID of the exhibit to fetch (Ticket NFT Contract)
 *   const exhibit = useExhibit(id);
 * 
 *   // The exhibit data can now be accessed through the `exhibit` variable
 *   console.log(exhibit);
 * }
 */