import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoToRegister = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/register');
  }, [navigate]);

  return null;  // Render nothing, navigating away
}

export default GoToRegister;
