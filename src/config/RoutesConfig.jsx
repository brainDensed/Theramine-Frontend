import { createBrowserRouter } from 'react-router';
import App from '../App';
import PrivateRoute from '../components/PrivateRoute';
import Therapists from '../ui/Therapists';
import ChatRoom from '../ui/ChatRoom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/therapists',
    element: (
      <PrivateRoute>
        <Therapists />
      </PrivateRoute>
    ),
  },
  {
    path: '/chat/:therapistId',
    element: (
      <PrivateRoute>
        <ChatRoom />
      </PrivateRoute>
    ),
  },
]);