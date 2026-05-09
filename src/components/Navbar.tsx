import { NavLink } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar" aria-label="Main Navigation">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="navbar-logo">
        <span className="logo-text">Lab12</span>
      </div>
      <div className="navbar-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          aria-label="Home page"
        >
          Home
        </NavLink>
        <NavLink 
          to="/todo" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          aria-label="Todo list page"
        >
          Todo
        </NavLink>
        <NavLink 
          to="/address-book" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          aria-label="Address book page"
        >
          Address Book
        </NavLink>
        <ThemeSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;
