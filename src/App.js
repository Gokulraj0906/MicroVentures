import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Components/Home';
import LoanApplicationForm from './Components/LoanApplication';
import EventHostingPage from './Components/EventHostingPage';
import Admin from './Components/Admin';
import LoanApprovalPage from './Components/LoanApprovalPage';
import Login from './Components/Login';
import LearningPage from './Components/LearningPage';
import Signup from './Components/Signup';
import Profile from './Components/Profile';
import ForgotPassword from './Components/Forgetpass';
import { AuthProvider, useAuth } from './Contexts/AuthContext';
import { MDBContainer } from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';


function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <MDBContainer>
          <Router>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/home" element={<Navigate to="/home" />} />
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forget-password" element={<ForgotPassword />} />
              <Route path="/loan-application" element={<PrivateRoute><LoanApplicationForm /></PrivateRoute>} />
              <Route path="/host-event" element={<PrivateRoute><EventHostingPage /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
              <Route path="/loan-approval" element={<PrivateRoute><LoanApprovalPage /></PrivateRoute>} />
              <Route path="/loan-approval" element={<PrivateRoute><LoanApprovalPage /></PrivateRoute>} />
              <Route path="/Learn-About-Business" element={<PrivateRoute><LearningPage /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>} />

            </Routes>
          </Router>
        </MDBContainer>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
