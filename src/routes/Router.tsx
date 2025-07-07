import { createBrowserRouter } from "react-router-dom";
import Form from "../pages/Form.tsx";
import Home from "../pages/Home.tsx";
import NotFound from "../pages/NotFound.tsx";
import FluxoDiagnostico from "../pages/FluxoDiagnostico.tsx";

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
  },
  {
    path: '/diagnostico/:id',
    element: <FluxoDiagnostico></FluxoDiagnostico>
  }
])

export default router;