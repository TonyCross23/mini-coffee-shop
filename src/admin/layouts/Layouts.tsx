import { Outlet } from "react-router-dom"
import AdminNavbar from "../components/Navbar"
import AdminRealtimeListener from "../components/AdminRealtimeListener"
import InstallButton from "../components/InstallBtn"

const Layouts = () => {
  return (
    <div>
       <AdminRealtimeListener />
       <InstallButton />
        <AdminNavbar/>
        <div className="mt-15">
          <Outlet/>
        </div>
    </div>
  )
}

export default Layouts