import './setting.css';
import { useState, useEffect } from "react";
import task from '../../../util/task.js';
import { useTranslation } from 'react-i18next';
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { useTimezone } from '../../../timezoneContext.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode, setLanguage } from '../../../store/setting.js';
export const Setting = () => {
  const { i18n } = useTranslation();
  const {t}=useTranslation()
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.setting.darkMode);
  const changeLang = (event) => {
    const lang = event.target.value;
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang))
    localStorage.setItem('lang', lang);
  };
  const { timezone, changeTimezone } = useTimezone();
  const timezones = [
    'Asia/Tokyo',
    'Asia/Saigon',
    'Europe/London',
    'America/New_York',
    'UTC',
  ];
  async function handleSubmit(e){
    try{
      e.preventDefault()
      await task.updateUserSetting({language:i18n.language, theme:darkMode?'dark':'light', timezone:timezone})
    } catch(error){
      throw new Error(`${error}`)
    }
  }

// Khi component mount lần đầu
  
  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 82,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(44px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff',
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: '#aab4be',
          ...theme.applyStyles('dark', {
            backgroundColor: '#8796A5',
          }),
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: '#001e3c',
      width: 32,
      height: 32,
      '&::before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
      ...theme.applyStyles('dark', {
        backgroundColor: '#003892',
      }),
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: '#aab4be',
      borderRadius: 20 / 2,
      ...theme.applyStyles('dark', {
        backgroundColor: '#8796A5',
      }),
    },
  }));
  return (
    <div className='setting-parent'>
      <form onSubmit={handleSubmit} id='setting'>
        <div className='language'>
          <h2>{t('setting.language')}</h2>
          <select id="language-select" onChange={changeLang} value={i18n.language}>
            <option value="en">{t('setting.en')}</option>
            <option value="vi">{t('setting.vn')}</option>
          </select>
        </div>
        <div className='darkMode'>
          <h2>{t('setting.Darkmode')}</h2>
          <FormControlLabel
            control={<MaterialUISwitch 
              checked={darkMode}
              onClick={() => {
                dispatch(toggleDarkMode());
              }}            
              sx={{ m: 1 }}   />}
          />
        </div>
        <div className='timezone'>
          <h2>{t('setting.Timezone')}</h2>
          <select value={timezone} onChange={(e) => changeTimezone(e.target.value)}>
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
        <button style={{color:'#fff',marginLeft:'5rem', backgroundColor:'#007bff'}}>{t("setting.save")}</button>
      </form>
    </div>
  );
};
