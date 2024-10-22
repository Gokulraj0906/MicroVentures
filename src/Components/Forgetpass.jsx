import React, { useState, useEffect } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { MDBContainer, MDBInput, MDBBtn, MDBIcon, MDBTypography } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(10); // Initialize seconds countdown
  const navigate = useNavigate(); // Initialize useNavigate

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
      setError('');
      setSeconds(10); // Reset countdown to 10 seconds
    } catch (error) {
      console.error('Error sending password reset email: ', error);
      setError('Error sending password reset email. Please check the email address.');
      setMessage('');
    }
  };

  // Effect for redirecting to the login page and showing countdown
  useEffect(() => {
    if (message) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1); // Decrease countdown every second
      }, 1000);

      const redirectTimer = setTimeout(() => {
        navigate('/'); // Redirect to login page after countdown reaches 0
      }, 10000); // 10000 milliseconds = 10 seconds

      return () => {
        clearInterval(timer); // Clear interval for countdown
        clearTimeout(redirectTimer); // Clear redirect timeout if the component unmounts
      };
    }
  }, [message, navigate]);

  return (
    <MDBContainer className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="forgot-password-container">
        <h2 className="mb-4 text-center">Reset Your Password</h2>
        <form onSubmit={handlePasswordReset}>
          <MDBInput
            label="Email Address"
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleInputChange}
            required
            className="mb-4"
            icon="envelope"
          />
          <MDBBtn type="submit" color="primary" className="w-100 mb-2">
            <MDBIcon fas icon="envelope" className="me-2" /> Send Reset Link
          </MDBBtn>
        </form>

        {/* Success Message */}
        {message && (
          <MDBTypography note noteColor="success" className="mt-4">
            {message} <br />
            You will be redirected to the login page in {seconds} seconds... 
            if not <a href="/">click here..</a> to redirect
          </MDBTypography>
        )}

        {/* Error Message */}
        {error && (
          <MDBTypography note noteColor="danger" className="mt-4">
            {error}
          </MDBTypography>
        )}
      </div>
    </MDBContainer>
  );
}

export default ForgotPassword;
