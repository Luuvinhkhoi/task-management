import { Outlet } from "react-router-dom"
import { SideBar } from "./sidebar/sidebar"
import { Header } from "./header/header"
import './main.css'
export const Main = () =>{
  return(
    <div className="main">
      <SideBar></SideBar>
      <div style={{height:'100%'}}>
        <Header></Header>
        <Outlet></Outlet>
      </div>
    </div>
  )
}