import { createContext, useContext, useState, useEffect } from 'react';

const TimezoneContext = createContext();

export const TimezoneProvider = ({ children }) => {
  const [timezone, setTimezone] = useState(localStorage.getItem('timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone);

  useEffect(() => {
    localStorage.setItem('timezone', timezone);
  }, [timezone]);

  return (
    <TimezoneContext.Provider value={{ timezone, setTimezone }}>
      {children}
    </TimezoneContext.Provider>
  );
};

export const useTimezone = () => useContext(TimezoneContext);
