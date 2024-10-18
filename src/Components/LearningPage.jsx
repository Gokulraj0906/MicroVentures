import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBTable, MDBTableHead, MDBTableBody, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import MyNavbar from './Navbar';
import { useAuth } from '../Contexts/AuthContext';

function LearningPage() {
  const { currentUser } = useAuth();
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      const fetchVideos = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'learningVideos'));
          const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setVideos(data);
        } catch (error) {
          setError('Error fetching videos: ' + error.message);
        }
      };

      fetchVideos();
    }
  }, [currentUser]);

  if (!currentUser) {
    return <h1 className="text-center mt-5">Access Denied</h1>;
  }

  return (
    <>
      <MyNavbar />
      <MDBContainer fluid className="d-flex flex-column align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <MDBCard
          className="text-black m-5 p-3"
          style={{
            borderRadius: '25px',
            maxWidth: '1000px',
            width: '100%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
            height: '80vh',  // Set max height to ensure the card scrolls when needed
          }}
        >
          <MDBCardBody style={{ overflowY: 'auto', scrollBehavior: 'smooth' }}>
            <h1 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#333' }}>Learning Videos</h1>
            {error && <p className="text-danger text-center">{error}</p>}

            <MDBTable responsive="sm" className="table-hover">
              <MDBTableHead>
                <tr className="table-primary">
                  <th className="text-center" style={{ width: '50%' }}>Video Title</th>
                  <th className="text-center" style={{ width: '50%' }}>Video</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {videos.map((video) => (
                  <tr key={video.id}>
                    <td className="align-middle text-center" style={{ fontWeight: '500', fontSize: '1.1rem' }}>{video.name}</td>
                    <td className="align-middle text-center">
                      <div className="embed-responsive embed-responsive-16by9" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <iframe
                          className="embed-responsive-item"
                          src={video.url}
                          title={video.name}
                          width="100vw"
                          height="auto"
                          style={{ borderRadius: '10px',width:'400px',height:'250px' }}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </td>
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

export default LearningPage;
