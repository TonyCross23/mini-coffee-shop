import { Outlet } from "react-router-dom"
import NavBar from "../components/Navbar"
import InstallButton from "../../admin/components/InstallBtn"

const Layout = () => {
  return (
    <div>
        <NavBar/>
          <InstallButton />
        <div className="mt-15">
            <Outlet/>
        </div>
    </div>
  )
}

export default Layout