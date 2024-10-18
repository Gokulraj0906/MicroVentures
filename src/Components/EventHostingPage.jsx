import React, { useState } from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { db } from '../Firebase'; // Make sure this is the correct path
import { collection, addDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import MyNavbar from './Navbar';
function EventHostingPage() {
  const [eventDetails, setEventDetails] = useState({
    eventName: '',
    eventDate: '',
    eventLocation: '',
    eventDescription: '',
    eventRegistrationDetails:''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEventDetails(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save event details to Firestore
      await addDoc(collection(db, 'events'), eventDetails);
      setSuccessMessage('Event hosted successfully!');
      setEventDetails({
        eventName: '',
        eventDate: '',
        eventLocation: '',
        eventDescription: ''
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <>
    <MyNavbar/>
    <MDBContainer fluid className="d-flex justify-content-center align-items-center vh-100">
      <MDBCard className='text-black m-5' style={{ borderRadius: '25px', maxWidth: '800px' }}>
        <MDBCardBody>
          <h1 className="text-center mb-4">Host an Event</h1>
          {successMessage && <p className="text-success">{successMessage}</p>}
          
          <form onSubmit={handleSubmit}>
            <MDBRow className="mb-4">
              <MDBCol md='12'>
                <MDBInput label='Event Name' id='eventName' type='text' value={eventDetails.eventName} onChange={handleChange} required />
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-4">
              <MDBCol md='6'>
                <MDBInput label='Event Date' id='eventDate' type='date' value={eventDetails.eventDate} onChange={handleChange} required />
              </MDBCol>
              <MDBCol md='6'>
                <MDBInput label='Event Location' id='eventLocation' type='text' value={eventDetails.eventLocation} onChange={handleChange} required />
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-4">
              <MDBCol md='12'>
                <MDBInput label='Event Description and Links' id='eventDescription' type='textarea' value={eventDetails.eventDescription} onChange={handleChange} required />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md='16'>
                <MDBInput label='Event Registeration Link' id ='eventRegistrationDetails' type='url' value={eventDetails.eventRegistrationDetails} onChange={handleChange} required />
              </MDBCol>
            </MDBRow>
            <MDBBtn className='mt-4' size='lg' type="submit">Submit</MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
    </>
  );
}
export default EventHostingPage;
