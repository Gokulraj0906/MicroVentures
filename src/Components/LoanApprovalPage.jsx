import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import MyNavbar from './Navbar';
function LoanApprovalPage() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "loanApplications"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(data);
      } catch (error) {
        setError("Error fetching applications: " + error.message);
      }
    };

    fetchApplications();
  }, []);

  return (
    <>
    <MyNavbar/>
    <MDBContainer fluid className="d-flex justify-content-center align-items-center vh-100">
      <MDBCard className='text-black m-5' style={{ borderRadius: '25px', maxWidth: '1000px' }}>
        <MDBCardBody>
          <h1 className="text-center mb-4">Loan Applications</h1>
          {error && <p className="text-danger">{error}</p>}

          <MDBTable>
            <MDBTableHead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Loan Amount</th>
                <th>Loan Purpose</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.name}</td>
                  <td>{app.email}</td>
                  <td>{app.phone}</td>
                  <td>{app.address}</td>
                  <td>{app.loanAmount}</td>
                  <td>{app.loanPurpose}</td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
    </>
  );
}

export default LoanApprovalPage;
