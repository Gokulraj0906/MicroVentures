import React, { useState, useEffect } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import logo from './logo.png'; // Import the logo image here

const MyNavbar = () => {
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  const [userData, setUserData] = useState({ email: '', username: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            email: data.Emailid || '',
            username: data.UserName || ''
          });
        }
      }
    };
    fetchUserData();
  }, []);

  // Toggle Navbar visibility
  const toggleNavbarVisibility = () => {
    setIsNavbarExpanded(!isNavbarExpanded);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <header id="navbar">
        <nav className="navbar-container container">
          <a href="/home" className="home-link">
            <img src={logo} alt="MicroVentures Logo" className="navbar-logo" />
            MicroVentures
          </a>
          <button
            type="button"
            id="navbar-toggle"
            aria-controls="navbar-menu"
            aria-label="Toggle menu"
            aria-expanded={isNavbarExpanded}
            onClick={toggleNavbarVisibility}
          >
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <div
            id="navbar-menu"
            aria-labelledby="navbar-toggle"
            className={isNavbarExpanded ? 'expanded' : ''}
          >
            <ul className="navbar-links">
              <li className="navbar-item">
                <a className="navbar-link" href="/home">Home</a>
              </li>
              <li className="navbar-item">
                <a className="navbar-link" href="/host-event">Host Event</a>
              </li>
              <li className="navbar-item">
                <a className="navbar-link" href="/loan-application">Apply Loan</a>
              </li>
              <li className="navbar-item">
                <a className="navbar-link" href="/loan-approval">Loan Status</a>
              </li>
              <li className="navbar-item">
                <a className="navbar-link" href="/Learn-About-Business">Learn About Business</a>
              </li>
              <Nav className="ml-auto">
                <NavDropdown title={userData.username || "User Account"} id="user-account-dropdown">
                  <NavDropdown.Item as={Link} to="/profile">{userData.email}</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as="button" onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </ul>
          </div>
        </nav>
      </header>

      <style>
        {`
          :root {
            --navbar-bg-color: hsl(0, 0%, 15%);
            --navbar-text-color: hsl(0, 0%, 85%);
            --navbar-text-color-focus: white;
            --navbar-bg-contrast: hsl(0, 0%, 25%);
          }

          body {
            height: 100vh;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            gap: 1.4rem;
           
          }

          .container {
            max-width: 1000px;
            padding-left: 1.4rem;
            padding-right: 1.4rem;
            margin-left: auto;
            margin-right: auto;
          }

          #navbar {
            --navbar-height: 64px;
            position: fixed;
            height: var(--navbar-height);
            background-color: var(--navbar-bg-color);
            left: 0;
            right: 0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
            z-index: 100;
          }

          .navbar-container {
            display: flex;
            justify-content: space-between;
            height: 100%;
            align-items: center;
          }

          .navbar-item {
            margin: 0.4em;
          }

          .home-link,
          .navbar-link {
            color: var(--navbar-text-color);
            text-decoration: none;
            display: flex;
            font-weight: 400;
            align-items: center;
          }

          .home-link:is(:focus, :hover),
          .navbar-link:is(:focus, :hover) {
            color: var(--navbar-text-color-focus);
            background-color: var(--navbar-bg-contrast);
          }

          .navbar-logo {
            width: 40px; /* Adjust the logo size */
            height: 40px;
            margin-right: 0.5em;
          }

          #navbar-toggle {
            cursor: pointer;
            border: none;
            background-color: transparent;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          }

          .icon-bar {
            display: block;
            width: 25px;
            height: 4px;
            margin: 2px;
            background-color: var(--navbar-text-color);
          }

          #navbar-toggle:is(:focus, :hover) .icon-bar {
            background-color: var(--navbar-text-color-focus);
          }

          #navbar-toggle[aria-expanded="true"] .icon-bar:is(:first-child, :last-child) {
            position: absolute;
            margin: 0;
            width: 30px;
          }

          #navbar-toggle[aria-expanded="true"] .icon-bar:first-child {
            transform: rotate(45deg);
          }

          #navbar-toggle[aria-expanded="true"] .icon-bar:nth-child(2) {
            opacity: 0;
          }

          #navbar-toggle[aria-expanded="true"] .icon-bar:last-child {
            transform: rotate(-45deg);
          }

          #navbar-menu {
            position: fixed;
            top: var(--navbar-height);
            bottom: 0;
            opacity: 0;
            visibility: hidden;
            left: 0;
            right: 0;
            z-index: 101;
          }

          #navbar-menu.expanded {
            background-color: rgba(0, 0, 0, 0.4);
            opacity: 1;
            visibility: visible;
          }

          .navbar-links {
            list-style: none;
            background-color: var(--navbar-bg-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            left: 0;
            right: 0;
            margin: 1.4rem;
            border-radius: 5px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
          }

          @media screen and (min-width: 700px) {
            #navbar-toggle {
              display: none;
            }

            #navbar-menu {
              visibility: visible;
              opacity: 1;
              position: static;
              display: block;
              z-index: 0;
            }

            .navbar-links {
              flex-direction: row;
              width: 100%;
              height: 100%;
            }
          }
        `}
      </style>
    </>
  );
};

export default MyNavbar;
