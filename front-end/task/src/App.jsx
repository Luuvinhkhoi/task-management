import { useState } from 'react'
import { SideBar } from './component/main/sidebar/sidebar'
import { Main } from './component/main/main'
import { Setting } from './component/main/set/setting'
import { Project } from './component/main/project/project'
import { Dashboard } from './component/main/dashboard/dashboard'
import './App.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'

function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route element={<Main></Main>}>
        <Route index element={<Dashboard></Dashboard>}></Route>
        <Route path='/project/:id' element={<Project></Project>}></Route>
        <Route path='/setting' element={<Setting></Setting>}></Route>
      </Route>
    </>
  ))
  return (
       <RouterProvider router={router}></RouterProvider>
  )
}

export default App
