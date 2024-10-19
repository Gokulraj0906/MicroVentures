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
        <MDBCard className="text-black m-3 p-2 p-md-4" style={{ borderRadius: '25px', maxWidth: '1000px', width: '100%' }}>
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
                      <td data-label="Name">{app.name}</td>
                      <td data-label="Email">{app.email}</td>
                      <td data-label="Phone">{app.phone}</td>
                      <td data-label="Address">{app.address}</td>
                      <td data-label="Loan Amount">{app.loanAmount}</td>
                      <td data-label="Loan Type">{app.loanType}</td>
                      <td data-label="Loan Purpose">{app.loanPurpose}</td>
                      <td data-label="Status">
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
        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          h1 {
            font-size: 1.2rem;
          }
          .m-5 {
            margin: 1rem !important;
          }

          /* Make table rows act like cards on small screens */
          .table-striped tbody tr {
            display: block;
            margin-bottom: 1rem;
            border-bottom: 1px solid #ddd;
            border-radius: 10px;
          }

          .table-striped tbody td {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem;
            font-size: 0.9rem;
          }

          .table-striped tbody td:before {
            content: attr(data-label);
            font-weight: bold;
            flex-basis: 40%;
            text-align: left;
          }

          /* Hide table headers on mobile */
          .table-striped thead {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default LoanApprovalPage;
