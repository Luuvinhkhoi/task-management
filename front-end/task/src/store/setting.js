// settingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialTheme = localStorage.getItem('theme') === 'dark';

const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    darkMode: initialTheme,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('theme', action.payload ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', action.payload ? 'dark' : 'light');
    },
  },
});

export const { toggleDarkMode, setDarkMode } = settingSlice.actions;
export default settingSlice.reducer;
