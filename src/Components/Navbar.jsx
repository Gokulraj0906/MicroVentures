import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { auth, db } from '../Firebase'; // Ensure this path is correct
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const MyNavbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
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

  const handleToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to home after logging out
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="navbar-custom">
        <Container className="justify-content-center">
          <Navbar.Brand as={Link} to="/home">Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle} />
          <Navbar.Collapse id="basic-navbar-nav" className={`collapse ${isNavOpen ? 'show' : ''}`}>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/host-event">Add Events</Nav.Link>
              <Nav.Link as={Link} to="/loan-application">Loan Applicatiion</Nav.Link>
              <Nav.Link as={Link} to="/loan-approval">Loan Status</Nav.Link>
            </Nav>
            <Nav className="ml-auto">
              <NavDropdown title={userData.username || "User Account"} id="user-account-dropdown">
                <NavDropdown.Item as={Link} to="/profile">{userData.email}</NavDropdown.Item>
                {/* <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item> */}
                <NavDropdown.Divider />
                <NavDropdown.Item as="button" onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            {isNavOpen && (
              <Button
                variant="link"
                className="close-btn position-absolute top-0 end-0 mt-2 me-2"
                onClick={handleToggle}
              >
                <FaTimes color="white" size={20} />
              </Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <style>{`
        /* Custom CSS */
        .navbar-custom {
          position: fixed;
          width: 100%;
          top: 0;
          left: 0;
          z-index: 1050;
        }

        .navbar-custom .navbar-collapse {
          display: flex;
          justify-content: center;
        }

        .navbar-custom .navbar-nav {
          display: flex;
          justify-content: center;
        }

        .close-btn {
          z-index: 1060;
        }

        @media (max-width: 992px) {
          .navbar-custom .collapse.show {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default MyNavbar;
