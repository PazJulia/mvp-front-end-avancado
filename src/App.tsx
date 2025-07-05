import './App.css'
import { RouterProvider } from "react-router-dom";
import router from "./Routes/Router.tsx";

export default function MyApp() {
  return <RouterProvider router={router}></RouterProvider>
}