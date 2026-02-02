import { Route, Routes } from "react-router-dom"
import Layouts from "./admin/layouts/Layouts"
import Layout from "./customer/layouts/Layout"
import { Toaster } from "react-hot-toast";
// import SingUp from "./auth/SingUp"
import { useUserRole } from "./hooks/useUserRole"
import PrivateRoute from "./routes/PrivateRoute"
import NoAccess from "./page/Noaccess"
import SignIn from "./auth/SignIn"
import React, { Suspense } from "react"

const AdminHome = React.lazy(() => import("./admin/pages/Home"));
const CreateMenu = React.lazy(() => import("./admin/pages/CreateMenu"));
const EditMenu = React.lazy(() => import("./admin/pages/EditMenu"));
const AdminOrders = React.lazy(() => import("./admin/pages/Orders"));
const UserHome = React.lazy(() => import("./customer/pages/Home"));
const VireCart = React.lazy(() => import("./customer/pages/VireCart"));
const Checkout = React.lazy(() => import("./customer/pages/Checkout"));


function App() {
  const { role, loading } = useUserRole();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* <Route path="/auth/signup" element={<SingUp />} /> */}
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
            <PrivateRoute allowedRoles={["user", "admin"]} userRole={role} loading={loading}>
              <Layout />
            </PrivateRoute>
        }>
          <Route index element={<UserHome />} />
          <Route path="/view/cart" element={<VireCart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
        <Route path="/no-access" element={<NoAccess />} />
      </Routes>
    </Suspense>
  )
}

export default App
