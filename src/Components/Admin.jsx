import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
import { useAuth } from '../Contexts/AuthContext';
import { db } from '../Firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

function AdminPanel() {
  const { currentUser } = useAuth();
  const [loanApplications, setLoanApplications] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.admin) {
      const fetchData = async () => {
        const loanAppsSnapshot = await getDocs(collection(db, 'loanApplications'));
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        
        setLoanApplications(loanAppsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setEvents(eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      
      fetchData();
    }
  }, [currentUser]);

  const deleteLoanApplication = async (id) => {
    await deleteDoc(doc(db, 'loanApplications', id));
    setLoanApplications(loanApplications.filter(app => app.id !== id));
  };

  const deleteEvent = async (id) => {
    await deleteDoc(doc(db, 'events', id));
    setEvents(events.filter(event => event.id !== id));
  };

  if (!currentUser || !currentUser.admin) {
    return <h1>Access Denied</h1>;
  }

  return (
    <MDBContainer fluid className="d-flex flex-column align-items-center vh-100">
      <MDBCard className='text-black m-5' style={{ borderRadius: '25px', maxWidth: '1200px' }}>
        <MDBCardHeader className='text-center' style={{ borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}>
          <h1 className="fw-bold mb-4">Admin Panel</h1>
        </MDBCardHeader>
        <MDBCardBody>
          <MDBRow className="mb-4">
            <MDBCol md='12'>
              <h2>Loan Applications</h2>
              <MDBTable>
                <MDBTableHead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Loan Amount</th>
                    <th>Loan Purpose</th>
                    <th>Actions</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {loanApplications.map(app => (
                    <tr key={app.id}>
                      <td>{app.name}</td>
                      <td>{app.email}</td>
                      <td>{app.phone}</td>
                      <td>{app.address}</td>
                      <td>{app.loanAmount}</td>
                      <td>{app.loanPurpose}</td>
                      <td>
                        <MDBBtn color="danger" onClick={() => deleteLoanApplication(app.id)}>Delete</MDBBtn>
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md='12'>
              <h2>Events</h2>
              <MDBTable>
                <MDBTableHead>
                  <tr>
                    <th>Event Name</th>
                    <th>Event Date</th>
                    <th>Event Location</th>
                    <th>Event Description</th>
                    <th>Actions</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {events.map(event => (
                    <tr key={event.id}>
                      <td>{event.eventName}</td>
                      <td>{event.eventDate}</td>
                      <td>{event.eventLocation}</td>
                      <td>{event.eventDescription}</td>
                      <td>
                        <MDBBtn color="danger" onClick={() => deleteEvent(event.id)}>Delete</MDBBtn>
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default AdminPanel;
