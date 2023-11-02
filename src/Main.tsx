import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import App from './app'
import Create from './create'
import Meeting from './meeting'
import Join from './Join'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/meeting",
    element: <Meeting />,
  },
  {
    path: "/create-room",
    element: <Create />
  },
  {
    path: "/join-room",
    element: <Join />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)