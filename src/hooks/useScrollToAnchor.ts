import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToAnchor = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            // Use a timeout to ensure the element exists in the DOM after potential renders
            const timer = setTimeout(() => {
                const element = document.getElementById(hash.replace('#', ''));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);

            return () => clearTimeout(timer);
        } else {
            // Scroll to top if no hash, but checking if we are not maintaining scroll
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [pathname, hash]);
};

export default useScrollToAnchor;
