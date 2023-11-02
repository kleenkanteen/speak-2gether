import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import App from './App'
import Create from './Create'
import Meeting from './Meeting'
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