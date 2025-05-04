
import { useState, useEffect } from 'react';

export const useStickyCart = () => {
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // If we've scrolled down past the initial view of the add to cart button
      if (scrollPosition > 300) {
        setShowStickyButton(true);
        
        // Hide the button when nearing the bottom of the page
        if (scrollPosition + windowHeight > documentHeight - 200) {
          setShowSticky(false);
        } else {
          setShowSticky(true);
        }
      } else {
        setShowStickyButton(false);
        setShowSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return { showStickyButton, showSticky };
};
