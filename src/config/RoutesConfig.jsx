import { createBrowserRouter } from 'react-router';
import App from '../App';
import PrivateRoute from '../components/PrivateRoute';
import Therapists from '../ui/Therapists';
import ChatComponent from '../components/ChatRoom';
import Layout from '../ui/Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,   // 👈 parent layout route
    children: [
      { path: "/", element: <App /> },
      { path: "/therapists", element: <PrivateRoute><Therapists /></PrivateRoute> },
      { path: "/chat/:therapistId", element: <PrivateRoute><ChatComponent /></PrivateRoute> },
    ],
  },
]);
