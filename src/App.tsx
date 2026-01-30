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

function App() {

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/admin/noallow" element={<Layouts />}>
          <Route index element={<AdminHome />} />
          <Route path="menu/create" element={<CreateMenu />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="menu/edit/:id" element={<EditMenu />} />
        </Route>

        <Route path="/" element={<Layout />}>
          <Route index element={<UserHome />} />
          <Route path="/view/cart" element={<VireCart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
