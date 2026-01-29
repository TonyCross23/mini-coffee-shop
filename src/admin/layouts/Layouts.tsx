import { Outlet } from "react-router-dom"
import AdminNavbar from "../components/Navbar"

const Layouts = () => {
  return (
    <div>
        <AdminNavbar/>
        <Outlet/>
    </div>
  )
}

export default Layouts