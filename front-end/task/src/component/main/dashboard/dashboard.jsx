import './dashboard.css'
import { useEffect } from 'react';
import { useDispatch , useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getAllSetting } from '../../../store/setting';
import { Task } from './task/minitask';
import { Progress } from './progress/progress';
import { MiniUpcoming } from './upcoming/miniUpcoming';
import {  Distribution } from './distribution/distribution';
export const Dashboard = () =>{
  const dispatch=useDispatch()
  const { i18n } = useTranslation();
  const darkMode = useSelector((state) => state.setting.darkMode);
  const language = useSelector(state => state.setting.language);
  useEffect(() => {
      if (language) {
        i18n.changeLanguage(language);
      }
    }, [language]);
    useEffect(() => {
      document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);
  useEffect(()=>{
      function getUserSetting(){
        try{
          dispatch(getAllSetting())
        } catch(error){
          console.log(error)
        }
      }
      getUserSetting()
  }, [dispatch])
  return(
    <div className='dashboard'>
        <div id='row1'>
          <Task></Task>
          <Distribution></Distribution>
        </div>
        <div id='row2'>
          <Progress></Progress>
          <MiniUpcoming></MiniUpcoming>
        </div>
    </div>
  )
}