import { Route, Routes } from "react-router-dom"
import Layouts from "./admin/layouts/Layouts"
import Layout from "./customer/layouts/Layout"
import CreateMenu from "./admin/pages/CreateMenu"
import AdminHome from "./admin/pages/Home"
import UserHome from "./customer/pages/Home"
import AdminOrders from "./admin/pages/Orders"
import EditMenu from "./admin/pages/EditMenu"
import VireCart from "./customer/pages/VireCart"
import Checkout from "./customer/pages/Checkout"
import { Toaster } from "react-hot-toast";
import SingUp from "./auth/SingUp"
import { useUserRole } from "./hooks/useUserRole"
import PrivateRoute from "./routes/PrivateRoute"
import NoAccess from "./page/Noaccess"
import SignIn from "./auth/SignIn"

function App() {
  const { role, loading } = useUserRole();

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/auth/signup" element={<SingUp />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/admin/noallow" element={
          <PrivateRoute allowedRoles={["admin"]} userRole={role} loading={loading}>
            <Layouts />
          </PrivateRoute>
        }>
          <Route index element={<AdminHome />} />
          <Route path="menu/create" element={<CreateMenu />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="menu/edit/:id" element={<EditMenu />} />
        </Route>

        <Route path="/" element={
          <PrivateRoute allowedRoles={["user"]} userRole={role} loading={loading}>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<UserHome />} />
          <Route path="/view/cart" element={<VireCart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
        <Route path="/no-access" element={<NoAccess />} />
      </Routes>
    </>
  )
}

export default App
