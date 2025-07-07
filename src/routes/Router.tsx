import { createBrowserRouter } from "react-router-dom";
import Form from "../pages/Form.tsx";
import Home from "../pages/Home.tsx";
import NotFound from "../pages/NotFound.tsx";
import FluxoDiagnosticoDengue from "../pages/FluxoDiagnosticoDengue.tsx";

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
    element: <FluxoDiagnosticoDengue></FluxoDiagnosticoDengue>
  }
])

export default router;