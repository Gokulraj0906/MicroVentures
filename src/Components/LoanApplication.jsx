import React, { useState } from 'react';
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
  MDBCardHeader
} from 'mdb-react-ui-kit';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../Firebase';
// import Navbar from './Navbar';
import MyNavbar from './Navbar';
function LoanApplicationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    loanAmount: '',
    loanPurpose: '',
    termsAccepted: false
  });
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleCheckboxChange = () => {
    setFormData(prevState => ({
      ...prevState,
      termsAccepted: !prevState.termsAccepted
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      setError("Please agree to the terms and conditions");
      return;
    }

    try {
      await setDoc(doc(db, "loanApplications", formData.email), formData);
      setIsSubmitted(true);
      setError('');
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        loanAmount: '',
        loanPurpose: '',
        termsAccepted: false
      });
    } catch (error) {
      setError("Error submitting form: " + error.message);
    }
  };

  return (
    <>
    <MyNavbar/>
      <MDBContainer fluid className="d-flex justify-content-center align-items-center vh-100">
        <MDBCard className='text-black m-5' style={{ borderRadius: '25px', maxWidth: '800px' }}>
          <MDBCardHeader className='text-center' style={{ borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}>
            <h1 className="fw-bold mb-4">Loan Application Form</h1>
          </MDBCardHeader>
          <form onSubmit={handleSubmit}>
            <MDBCardBody>
              {error && <p className="text-danger">{error}</p>}
              {isSubmitted && <p className="text-success">Application submitted successfully!</p>}

              <MDBRow className="mb-4">
                <MDBCol md='6'>
                  <MDBInput label='Your Name' id='name' type='text' value={formData.name} onChange={handleChange} />
                </MDBCol>
                <MDBCol md='6'>
                  <MDBInput label='Your Email' id='email' type='email' value={formData.email} onChange={handleChange} />
                </MDBCol>
              </MDBRow>

              <MDBRow className="mb-4">
                <MDBCol md='6'>
                  <MDBInput label='Your Phone' id='phone' type='text' value={formData.phone} onChange={handleChange} />
                </MDBCol>
                <MDBCol md='6'>
                  <MDBInput label='Your Address' id='address' type='text' value={formData.address} onChange={handleChange} />
                </MDBCol>
              </MDBRow>

              <MDBRow className="mb-4">
                <MDBCol md='6'>
                  <MDBInput label='Loan Amount' id='loanAmount' type='text' value={formData.loanAmount} onChange={handleChange} />
                </MDBCol>
                <MDBCol md='6'>
                  <MDBInput label='Loan Purpose' id='loanPurpose' type='text' value={formData.loanPurpose} onChange={handleChange} />
                </MDBCol>
              </MDBRow>

              <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I agree to the terms and conditions' checked={formData.termsAccepted} onChange={handleCheckboxChange} />
              
              <MDBBtn className='mt-4' size='lg' type="submit">Apply</MDBBtn>
            </MDBCardBody>
          </form>
        </MDBCard>
      </MDBContainer>
    </>
  );
}

export default LoanApplicationForm;
