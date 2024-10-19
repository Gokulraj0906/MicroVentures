import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { mailOutline, lockClosedOutline, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.scss';
import { auth } from '../Firebase'; // Reuse imported auth
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { value, id } = e.target;
    if (id === 'emailaddress') {
      setEmail(value);
    } else if (id === 'password') {
      setPass(value);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      if (!user.emailVerified) {
        alert('Please verify your email before logging in.');
        return;
      }
      // If successful, navigate to the home page
      navigate('/home');
    } catch (error) {
      // Show error message in a popup
      alert('Username Or Password Is Invalid correct it');
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <title>Login</title>
      <div className="screen-1">
        <svg className="logo" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" width="300" height="300" viewBox="0 0 640 480" xmlSpace="preserve">
          <g transform="matrix(3.31 0 0 3.31 320.4 240.4)">
            <circle style={{ stroke: 'rgb(0,0,0)', strokeWidth: 0, strokeDasharray: 'none', strokeLinecap: 'butt', strokeDashoffset: 0, strokeLinejoin: 'miter', strokeMiterlimit: 4, fill: 'rgb(61,71,133)', fillRule: 'nonzero', opacity: 1 }} cx="0" cy="0" r="40" />
          </g>
          <g transform="matrix(0.98 0 0 0.98 268.7 213.7)">
            <circle style={{ stroke: 'rgb(0,0,0)', strokeWidth: 0, strokeDasharray: 'none', strokeLinecap: 'butt', strokeDashoffset: 0, strokeLinejoin: 'miter', strokeMiterlimit: 4, fill: 'rgb(255,255,255)', fillRule: 'nonzero', opacity: 1 }} cx="0" cy="0" r="40" />
          </g>
          <g transform="matrix(1.01 0 0 1.01 362.9 210.9)">
            <circle style={{ stroke: 'rgb(0,0,0)', strokeWidth: 0, strokeDasharray: 'none', strokeLinecap: 'butt', strokeDashoffset: 0, strokeLinejoin: 'miter', strokeMiterlimit: 4, fill: 'rgb(255,255,255)', fillRule: 'nonzero', opacity: 1 }} cx="0" cy="0" r="40" />
          </g>
          <g transform="matrix(0.92 0 0 0.92 318.5 286.5)">
            <circle style={{ stroke: 'rgb(0,0,0)', strokeWidth: 0, strokeDasharray: 'none', strokeLinecap: 'butt', strokeDashoffset: 0, strokeLinejoin: 'miter', strokeMiterlimit: 4, fill: 'rgb(255,255,255)', fillRule: 'nonzero', opacity: 1 }} cx="0" cy="0" r="40" />
          </g>
          <g transform="matrix(0.16 -0.12 0.49 0.66 290.57 243.57)">
            <polygon style={{ stroke: 'rgb(0,0,0)', strokeWidth: 0, strokeDasharray: 'none', strokeLinecap: 'butt', strokeDashoffset: 0, strokeLinejoin: 'miter', strokeMiterlimit: 4, fill: 'rgb(255,255,255)', fillRule: 'nonzero', opacity: 1 }} points="-50,-50 -50,50 50,50 50,-50" />
          </g>
          <g transform="matrix(0.16 0.1 -0.44 0.69 342.03 248.34)">
            <polygon style={{ stroke: 'rgb(0,0,0)', strokeWidth: 0, strokeDasharray: 'none', strokeLinecap: 'butt', strokeDashoffset: 0, strokeLinejoin: 'miter', strokeMiterlimit: 4, fill: 'rgb(255,255,255)', fillRule: 'nonzero', opacity: 1 }} vectorEffect="non-scaling-stroke" points="-50,-50 -50,50 50,50 50,-50" />
          </g>
        </svg>

        <form onSubmit={handleLogin}>
          <div className="email">
            <label htmlFor="emailaddress">Email Address</label>
            <div className="sec-2">
              <IonIcon icon={mailOutline} />
              <input type="email" id="emailaddress" name="email" placeholder="Username@gmail.com" value={email} onChange={handleInputChange} />
            </div>
          </div>

          <div className="password">
            <label htmlFor="password">Password</label>
            <div className="sec-2">
              <IonIcon icon={lockClosedOutline} />
              <input type={showPassword ? 'text' : 'password'} id="password" placeholder="············" value={pass} onChange={handleInputChange} />
              <IonIcon className="show-hide" icon={showPassword ? eyeOffOutline : eyeOutline} onClick={togglePasswordVisibility} />
            </div>
          </div>

          <button type="submit" className="login">Login</button>
          <div className="footer">
          {/* <button onClick={signInWithGoogle} className="login">Sign in with Google</button> */}
            <span><a id='a' href="/signup">Sign up</a></span>
            <span><a id='a' href="/forget-password">Forgot Password?</a></span>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
