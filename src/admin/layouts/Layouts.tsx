import { Outlet } from "react-router-dom"
import AdminNavbar from "../components/Navbar"

const Layouts = () => {
  return (
    <div>
        <AdminNavbar/>
        <div className="mt-10">
          <Outlet/>
        </div>
    </div>
  )
}

export default Layouts