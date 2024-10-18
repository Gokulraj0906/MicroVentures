import React, { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { db } from '../Firebase';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import MyNavbar from './Navbar';

function AdminPanel() {
  const { currentUser } = useAuth();
  const [loanApplications, setLoanApplications] = useState([]);
  const [events, setEvents] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoURL, setVideoURL] = useState('');
  const [videoName, setVideoName] = useState('');
  const [videoDescription, setVideoDescription] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.email === 'gokulsenthil0906@gmail.com') {
      const fetchData = async () => {
        const loanAppsSnapshot = await getDocs(collection(db, 'loanApplications'));
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        const videosSnapshot = await getDocs(collection(db, 'learningVideos'));

        setLoanApplications(loanAppsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setEvents(eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setVideos(videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };

      fetchData();
    }
  }, [currentUser]);

  const updateLoanApplicationStatus = async (id, status) => {
    await updateDoc(doc(db, 'loanApplications', id), { status });
    setLoanApplications(loanApplications.map(app => app.id === id ? { ...app, status } : app));
  };

  const updateEventStatus = async (id, status) => {
    await updateDoc(doc(db, 'events', id), { status });
    setEvents(events.map(event => event.id === id ? { ...event, status } : event));
  };

  const deleteLoanApplication = async (id) => {
    await deleteDoc(doc(db, 'loanApplications', id));
    setLoanApplications(loanApplications.filter(app => app.id !== id));
  };

  const deleteEvent = async (id) => {
    await deleteDoc(doc(db, 'events', id));
    setEvents(events.filter(event => event.id !== id));
  };

  const deleteVideo = async (id) => {
    await deleteDoc(doc(db, 'learningVideos', id));
    setVideos(videos.filter(video => video.id !== id));
  };

  const handleAddVideo = async () => {
    if (videoURL && videoName && videoDescription) {
      await addDoc(collection(db, 'learningVideos'), { 
        url: videoURL, 
        name: videoName, 
        description: videoDescription 
      });
      setVideoURL('');
      setVideoName('');
      setVideoDescription('');
      
      const videoCollection = collection(db, 'learningVideos');
      const videoSnapshot = await getDocs(videoCollection);
      const videoList = videoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVideos(videoList);
    }
  };

  if (!currentUser || currentUser.email !== 'gokulsenthil0906@gmail.com') {
    return <h1>Access Denied</h1>;
  }

  return (
    <>
      <MyNavbar />
      <div className="container">
        <MDBContainer fluid className="d-flex flex-column align-items-center vh-100">
          <MDBCard className="text-black m-5" style={{ borderRadius: '25px', maxWidth: '1200px', height: '80vh' }}>
            <MDBCardHeader className="text-center" style={{ borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}>
              <h1 className="fw-bold mb-4">Admin Panel</h1>
            </MDBCardHeader>
            <MDBCardBody style={{ overflowY: 'auto' }}>
              <MDBRow className="mb-10">
                {/* Loan Applications */}
                <MDBCol md="12">
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
                        <th>Type</th>
                        <th>Status</th>
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
                          <td>{app.loanType}</td>
                          <td>{app.status || 'Pending'}</td>
                          <td>
                            <MDBBtn color="success" onClick={() => updateLoanApplicationStatus(app.id, 'Approved')}>Approve</MDBBtn>
                            <MDBBtn color="danger" onClick={() => updateLoanApplicationStatus(app.id, 'Declined')}>Decline</MDBBtn>
                            <MDBBtn color="danger" onClick={() => deleteLoanApplication(app.id)}>Delete</MDBBtn>
                          </td>
                        </tr>
                      ))}
                    </MDBTableBody>
                  </MDBTable>
                </MDBCol>
              </MDBRow>

              {/* Events */}
              <MDBRow className="mb-4">
                <MDBCol md="12">
                  <h2>Events</h2>
                  <MDBTable>
                    <MDBTableHead>
                      <tr>
                        <th>Event Name</th>
                        <th>Event Date</th>
                        <th>Event Location</th>
                        <th>Event Description</th>
                        <th>Status</th>
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
                          <td>{event.status || 'Pending'}</td>
                          <td>
                            <MDBBtn color="success" onClick={() => updateEventStatus(event.id, 'Approved')}>Approve</MDBBtn>
                            <MDBBtn color="danger" onClick={() => updateEventStatus(event.id, 'Declined')}>Decline</MDBBtn>
                            <MDBBtn color="danger" onClick={() => deleteEvent(event.id)}>Delete</MDBBtn>
                          </td>
                        </tr>
                      ))}
                    </MDBTableBody>
                  </MDBTable>
                </MDBCol>
              </MDBRow>

              {/* Learning Videos */}
              <MDBRow className="mb-4">
                <MDBCol md="12">
                  <h2>Learning Videos</h2>
                  <MDBTable>
                    <MDBTableHead>
                      <tr>
                        <th>Video Name</th>
                        <th>Video Description</th>
                        <th>Video</th>
                        <th>Actions</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {videos.map(video => (
                        <tr key={video.id}>
                          <td>{video.name}</td>
                          <td>{video.description}</td>
                          <td>
                            <div className="embed-responsive embed-responsive-16by9">
                              <iframe className="embed-responsive-item" src={video.url} allowFullScreen></iframe>
                            </div>
                          </td>
                          <td>
                            <MDBBtn color="danger" onClick={() => deleteVideo(video.id)}>Delete</MDBBtn>
                          </td>
                        </tr>
                      ))}
                    </MDBTableBody>
                  </MDBTable>

                  {/* Add New Video Form */}
                  <div className="mt-4">
                    <input
                      type="url"
                      value={videoURL}
                      onChange={(e) => setVideoURL(e.target.value)}
                      placeholder="Enter video URL"
                      className="form-control mb-2"
                    />
                    <input
                      type="text"
                      value={videoName}
                      onChange={(e) => setVideoName(e.target.value)}
                      placeholder="Enter video name"
                      className="form-control mb-2"
                    />
                    <textarea
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      placeholder="Enter video description"
                      className="form-control mb-2"
                    />
                    <MDBBtn onClick={handleAddVideo}>Add Video</MDBBtn>
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
      </div>
    </>
  );
}

export default AdminPanel;
