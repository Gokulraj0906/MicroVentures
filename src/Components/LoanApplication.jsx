import React, { useState, useEffect } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBCheckbox,
  MDBCardHeader,
} from 'mdb-react-ui-kit';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { auth } from '../Firebase';
import MyNavbar from './Navbar';

function LoanApplicationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    loanAmount: '',
    loanPurpose: '',
    loanType: '',
    termsAccepted: false,
  });
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prevState) => ({
      ...prevState,
      termsAccepted: !prevState.termsAccepted,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      setError('Please agree to the terms and conditions');
      return;
    }

    try {
      await setDoc(doc(db, 'loanApplications', formData.email), formData);
      setIsSubmitted(true);
      setError('');
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        loanAmount: '',
        loanPurpose: '',
        loanType: '',
        termsAccepted: false,
      });
    } catch (error) {
      setError('Error submitting form: ' + error.message);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData((prevState) => ({
            ...prevState,
            name: data.UserName || '',
            email: data.Emailid || '',
          }));
        }
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      <MyNavbar />
      <MDBContainer fluid className="d-flex justify-content-center align-items-center vh-100">
        <MDBCard className="text-black m-5" style={{ borderRadius: '25px', maxWidth: '800px' }}>
          <MDBCardHeader className="text-center" style={{ borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}>
            <h1 className="fw-bold mb-4">Loan Application Form</h1>
          </MDBCardHeader>
          <form onSubmit={handleSubmit}>
            <MDBCardBody>
              {error && <p className="text-danger">{error}</p>}
              {isSubmitted && <p className="text-success">Application submitted successfully!</p>}

              <MDBRow className="mb-4">
                <MDBCol md="6">
                  <MDBInput label="Your Name" id="name" type="text" value={formData.name} onChange={handleChange} readOnly required />
                </MDBCol>
                <MDBCol md="6">
                  <MDBInput label="Your Email" id="email" type="email" value={formData.email} onChange={handleChange} readOnly required />
                </MDBCol>
              </MDBRow>

              <MDBRow className="mb-4">
                <MDBCol md="6">
                  <MDBInput label="Your Phone" id="phone" type="number" value={formData.phone} onChange={handleChange} required />
                </MDBCol>
                <MDBCol md="6">
                  <MDBInput label="Your Address" id="address" type="text" value={formData.address} onChange={handleChange} required />
                </MDBCol>
              </MDBRow>

              <MDBRow className="mb-4">
                <MDBCol md="6">
                  <MDBInput label="Loan Amount" id="loanAmount" type="number" value={formData.loanAmount} onChange={handleChange} required />
                </MDBCol>
                <MDBCol md="6">
                  <MDBInput label="Loan Purpose" id="loanPurpose" type="text" value={formData.loanPurpose} onChange={handleChange} required />
                </MDBCol>
              </MDBRow>

              {/* Loan Type Dropdown */}
              <MDBRow className="mb-4">
                <MDBCol md="12">
                  <select className="form-select" id="loanType" value={formData.loanType} onChange={handleChange} required>
                    <option value="" disabled>
                      Select Loan Type
                    </option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="Car Loan">Car Loan</option>
                    <option value="Education Loan">Education Loan</option>
                    <option value="Business Loan">Business Loan</option>
                  </select>
                </MDBCol>
              </MDBRow>

              <MDBIcon animate="shake" />
              <MDBCheckbox name="flexCheck" id="flexCheckDefault" label="I agree to the terms and conditions" checked={formData.termsAccepted} onChange={handleCheckboxChange} required />

              <MDBBtn className="mt-4" size="lg" type="submit">
                Apply
              </MDBBtn>
            </MDBCardBody>
          </form>
        </MDBCard>
      </MDBContainer>
    </>
  );
}

export default LoanApplicationForm;
