import { useState } from 'react'
import { SideBar } from './component/main/sidebar/sidebar'
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
import './i18n'
import './App.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import { TimezoneProvider } from './timezoneContext.jsx';
function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route element={<Main></Main>}>
        <Route index element={<Dashboard></Dashboard>}></Route>
        <Route path='/todayTask' element={<TodayTask></TodayTask>}></Route>
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
