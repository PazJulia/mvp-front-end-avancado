import { createBrowserRouter } from "react-router-dom";
import Form from "../Pages/Form.tsx";
import Home from "../Pages/Home.tsx";
import NotFound from "../Pages/NotFound.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home></Home>,
    errorElement: <NotFound></NotFound>,
  },
  {
    path: '/form',
    element: <Form></Form>,
    children: [
      { path: '/form/:id', element: <Form></Form> }
    ]
  }
])

export default router;