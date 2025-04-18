import { useState } from 'react'
import { SideBar } from './component/main/sidebar/sidebar'
import { useEffect } from 'react';
import { useDispatch , useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getAllSetting } from '../src/store/setting.js';
import { Main } from './component/main/main'
import { Setting } from './component/main/set/setting'
import { Project } from './component/main/project/project'
import { Dashboard } from './component/main/dashboard/dashboard'
import { List } from './component/main/project/list/list.jsx'
import { Kanban } from './component/main/project/kanban/kanban.jsx'
import { SignUp } from './component/main/sign-up/sign-up.jsx'
import { SignIn } from './component/main/sign-in/sign-in.jsx'
import { TodayTask } from './component/main/dashboard/task/task.jsx'
import { Profile } from './component/main/profile/profile.jsx'
import { Upcoming } from './component/main/dashboard/upcoming/upcoming.jsx'
import './i18n'
import './App.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import { TimezoneProvider } from './timezoneContext.jsx';
function App() {
  const dispatch=useDispatch()
  const { i18n } = useTranslation();
  const darkMode = useSelector((state) => state.setting.darkMode);
  const language = useSelector(state => state.setting.language);
  const user=useSelector(state=>state.userProfile.email)
  useEffect(() => {
      if (language) {
        i18n.changeLanguage(language);
      }
  }, [language]);
  useEffect(() => {
      document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
      localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route element={<Main></Main>}>
        <Route index element={<Dashboard></Dashboard>}></Route>
        <Route path='/today-task' element={<TodayTask></TodayTask>}></Route>
        <Route path='/upcoming-task' element={<Upcoming></Upcoming>}></Route>
        <Route path='/project/:id' element={<Project></Project>}>
          <Route index element={<Kanban></Kanban>}></Route>
          <Route path='/project/:id/list' element={<List></List>}></Route>
        </Route>
        <Route path='/setting' element={<Setting></Setting>}></Route>
        <Route path='/profile' element={<Profile></Profile>}></Route>
      </Route>
      <Route path='/sign-up' element={<SignUp></SignUp>}></Route>
      <Route path='/sign-in' element={<SignIn></SignIn>}></Route>
    </>
  ))
  return (
    <TimezoneProvider>
        <RouterProvider router={router}></RouterProvider>
    </TimezoneProvider>
  )
}

export default App
