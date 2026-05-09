import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Todo from './pages/Todo';
import AddressBook from './pages/AddressBook';
import AccessibilityManager from './components/AccessibilityManager';
import ToastManager from './components/ToastManager';
import './App.css';

const Layout = () => (
  <div className="app-layout">
    <AccessibilityManager />
    <ToastManager />
    <Navbar />
    <main id="main-content">
      <Outlet />
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
        handle: { title: 'Home' }
      },
      {
        path: 'todo',
        element: <Todo />,
        handle: { title: 'Todo' }
      },
      {
        path: 'address-book',
        element: <AddressBook />,
        handle: { title: 'Address Book' }
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
