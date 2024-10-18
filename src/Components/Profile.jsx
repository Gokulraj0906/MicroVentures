import React, { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { db, auth } from '../Firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'react-bootstrap';
import MyNavbar from './Navbar';

function Profile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ email: '', username: '' });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfile(userSnap.data());
        } else {
          if (!profile.email) {
            await setDoc(userRef, { ...profile, email: currentUser.email });
          }
        }
      }
    };

    fetchProfile();
  }, [currentUser, profile]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setSuccessMessage(''); // Reset message on save
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, profile);
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile: ', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <h1>Please log in to access your profile.</h1>;
  }

  return (
    <>
      <MyNavbar/>
      <div>
        <MDBContainer className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <MDBCard style={{ maxWidth: '600px', width: '100%', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', backgroundColor: '#f9f9f9' }}>
            <MDBCardBody>
              <h2 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#333' }}>Welcome, {userData.username || 'User'}!</h2>
              
              {successMessage && (
                <div style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>
                  {successMessage}
                </div>
              )}
              
              <MDBRow>
                <MDBCol md="12">
                  <label htmlFor="MDBRow">Email</label>
                  <MDBInput
                    label="  "
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    readOnly
                    icon={<FontAwesomeIcon icon={faEnvelope} />}
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol md="12">
                  <label htmlFor="MDBRow">Phone Number</label>
                  <MDBInput
                    label=" "
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    icon={<FontAwesomeIcon icon={faPhone} />}
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol md="12">
                  <label htmlFor="MDBRow">Address</label>
                  <MDBInput
                    label=" "
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    icon={<FontAwesomeIcon icon={faMapMarkerAlt} />}
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow className="mt-4">
                <MDBCol md="12" className="text-center">
                  <MDBBtn onClick={handleSaveProfile} disabled={loading} color="primary" style={{ fontSize: '1.1rem', padding: '10px', height: '50px' }}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Save Profile'}
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
      </div>
    </>
  );
}

export default Profile;
