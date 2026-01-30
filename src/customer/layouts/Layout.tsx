import { Outlet } from "react-router-dom"
import NavBar from "../components/Navbar"

const Layout = () => {
  return (
    <div>
        <NavBar/>
        <div className="mt-15">
            <Outlet/>
        </div>
    </div>
  )
}

export default Layout