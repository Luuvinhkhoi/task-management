// settingSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import task from '../util/task';

const initialTheme = localStorage.getItem('theme') === 'dark';
const userTimezone=Intl.DateTimeFormat().resolvedOptions().timeZone;
const theme=localStorage.getItem('theme')
const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    language:'English',
    darkMode: initialTheme,
    timezone:userTimezone
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
    setSetting:(state, action)=>{
      if(theme!==action.payload.darkMode){
        console.log(theme)
        state.darkMode=!state.darkMode;
      }else{
        console.log(theme)
      }
      console.log(action.payload )
      state.language=action.payload.language
      action.payload.timeZone!==state.timezone ? state.timezone=action.payload.timezone : state.timezone
    },
    setTimezone:(state,action)=>{
      state.timezone=action.payload
    },
    setLanguage:(state,action)=>{
      state.language=action.payload
    }

  },
});
export const getAllSetting=createAsyncThunk(
  'setting/getSetting',
  async(_,thunkAPI)=>{
    const result=await task.getSetting()
    await thunkAPI.dispatch(setSetting({
      darkMode:result.theme,
      language:result.language,
      timezone:result.timezone
    }))
  }
)
export const { toggleDarkMode, setDarkMode, setSetting, setTimezone, setLanguage } = settingSlice.actions;
export default settingSlice.reducer;
