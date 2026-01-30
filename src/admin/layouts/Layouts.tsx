import { Outlet } from "react-router-dom"
import AdminNavbar from "../components/Navbar"
import AdminRealtimeListener from "../components/AdminRealtimeListener"

const Layouts = () => {
  return (
    <div>
       <AdminRealtimeListener />
        <AdminNavbar/>
        <div className="mt-15">
          <Outlet/>
        </div>
    </div>
  )
}

export default Layouts