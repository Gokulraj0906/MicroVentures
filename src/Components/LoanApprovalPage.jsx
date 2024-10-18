import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../Firebase';
import MyNavbar from './Navbar';
import { useAuth } from '../Contexts/AuthContext';

function LoanApprovalPage() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      const fetchApplications = async () => {
        try {
          const q = query(collection(db, 'loanApplications'), where('email', '==', currentUser.email));
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            status: doc.data().status || 'On Progress',
          }));
          setApplications(data);
        } catch (error) {
          setError('Error fetching applications: ' + error.message);
        }
      };

      fetchApplications();
    }
  }, [currentUser]);

  if (!currentUser) {
    return <h1>Access Denied</h1>;
  }

  return (
    <>
      <MyNavbar />
      <MDBContainer fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <MDBCard className="text-black m-5" style={{ borderRadius: '25px', maxWidth: '1000px', width: '100%' }}>
          <MDBCardBody>
            <h1 className="text-center mb-4">Loan Applications</h1>
            {error && <p className="text-danger">{error}</p>}

            <div className="table-responsive">
              <MDBTable hover className="table-striped">
                <MDBTableHead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Loan Amount</th>
                    <th>Loan Type</th>
                    <th>Loan Purpose</th>
                    <th>Status</th>
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
                      <td>{app.loanType}</td>
                      <td>{app.loanPurpose}</td>
                      <td>
                        <span
                          className={`badge ${
                            app.status === 'Approved'
                              ? 'bg-success'
                              : app.status === 'Rejected'
                              ? 'bg-danger'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>

      {/* Custom CSS */}
      <style jsx>{`
        @media (max-width: 768px) {
          h1 {
            font-size: 1.5rem;
          }
          .table-responsive {
            overflow-x: auto;
          }
        }

        @media (max-width: 576px) {
          h1 {
            font-size: 1.2rem;
          }
          .m-5 {
            margin: 1rem !important;
          }
        }
      `}</style>
    </>
  );
}

export default LoanApprovalPage;