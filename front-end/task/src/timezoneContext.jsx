import { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setTimezone } from './store/setting';
const TimezoneContext = createContext();

export const TimezoneProvider = ({ children }) => {
  const timezone=useSelector((state)=>state.setting.timezone)
  const dispatch = useDispatch();

  const changeTimezone = (tz) => {
    console.log(tz)
    dispatch(setTimezone(tz));
    localStorage.setItem('timezone', tz);
  };
  useEffect(() => {
    localStorage.setItem('timezone', timezone);
  }, [timezone]);

  return (
    <TimezoneContext.Provider value={{ timezone, changeTimezone }}>
      {children}
    </TimezoneContext.Provider>
  );
};

export const useTimezone = () => useContext(TimezoneContext);
