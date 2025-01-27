import { useEffect, useState } from 'react';

const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState<boolean>(false);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        const updateMatches = (event: MediaQueryListEvent) => setMatches(event.matches);

        // Set the initial state
        setMatches(mediaQueryList.matches);

        // Add event listener
        mediaQueryList.addEventListener('change', updateMatches);

        // Cleanup listener on unmount
        return () => {
            mediaQueryList.removeEventListener('change', updateMatches);
        };
    }, [query]);

    return matches;
};

export default useMediaQuery;