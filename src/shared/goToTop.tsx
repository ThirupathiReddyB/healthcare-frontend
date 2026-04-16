import  { useState, useEffect } from 'react';
import { Fab, Zoom } from '@mui/material';
import { LuArrowUpToLine } from "react-icons/lu";

const GoToTop = () => {
  const [visible, setVisible] = useState(false);

  // Check if the user has scrolled down the page
  const handleScroll = () => {
    if (window.scrollY > 95) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add event listener for scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Zoom in={visible}>
      <Fab
        color="primary"
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #EF7714 0%, #FEAF6D 100%)', // Applying gradient
          borderRadius: '30px', // Make it circular
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)', // Add a shadow effect
          width:"55px",
          height:"55px"
        }}
      >
        <LuArrowUpToLine style={{ fontSize: '35px', color: 'white' }} />
      </Fab>
    </Zoom>
  );
};

export default GoToTop;
