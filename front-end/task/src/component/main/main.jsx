import { Outlet } from "react-router-dom"
import { SideBar } from "./sidebar/sidebar"
import './main.css'
export const Main = () =>{
  return(
    <div className="main">
      <SideBar></SideBar>
      <Outlet></Outlet>
    </div>
  )
}