import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

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
    baseURI: string;
    exhibit: Exhibit;
    collection: Collection;
}

interface RecentExhibitsData {
    exhibitCreateds: ExhibitCreated[];
}

/**
 * Custom hook for fetching the 5 most recent exhibits
 * @returns An array of the 5 most recent exhibits or null if no data is fetched
 */
const useRecentExhibits = (): ExhibitCreated[] | null => {
    const [recentExhibits, setRecentExhibits] = useState<ExhibitCreated[] | null>(null);

    const RECENT_EXHIBITS_QUERY = gql`
        query GetRecentExhibits {
            exhibitCreateds(orderBy: blockTimestamp, first: 5) {
                name
                location
                details
                ticketPrice
                baseURI
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

    const { data } = useQuery<RecentExhibitsData>(RECENT_EXHIBITS_QUERY);

    useEffect(() => {
        if (data && data.exhibitCreateds) {
            setRecentExhibits(data.exhibitCreateds);
        }
    }, [data]);

    return recentExhibits;
};

export default useRecentExhibits;

/*
 * Usage:
 * 
 * import useRecentExhibits from './useRecentExhibits';
 * 
 * function MyComponent() {
 *   const recentExhibits = useRecentExhibits();
 * 
 *   // The recent exhibits data can now be accessed through the `recentExhibits` variable
 *   console.log(recentExhibits);
 * }
 */