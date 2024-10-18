import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import MyNavbar from './Navbar';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsList);
      } catch (error) {
        console.error('Error fetching events: ', error);
      }
    };

    const fetchNews = async () => {
      const params = {
        api_token: '5acjg8u0adYLaK96JXFOkHpE8UV2YtGZdV99jzYC',
        categories: 'business',
      };

      const esc = encodeURIComponent;
      const query = Object.keys(params)
        .map(k => `${esc(k)}=${esc(params[k])}`)
        .join('&');

      try {
        const response = await fetch(`https://api.thenewsapi.com/v1/news/all?${query}`);
        const data = await response.json();
        if (data && data.data) {
          setNews(data.data);
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error('Error fetching news: ', error);
      }
    };

    fetchEvents();
    fetchNews();
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', overflowY: 'auto', margin: 0 }}>
      <MDBContainer fluid style={{ padding: 0 }}>
        {/* Fixed Navbar */}
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
          <MyNavbar />
        </div>

        {/* Main content below the navbar */}
        <div style={{ marginTop: '40px', padding: '20px' }}>
          {/* Welcome Section */}
          <section className="text-center py-5 bg-light" style={{ minHeight: '100vh', backgroundImage: 'url("https://mega.com.vn/media/news/2007_background-3d-dep-cho-ppt11.jpg")', backgroundSize: 'cover', color: '#333' }}>
                  <div className="overlay" style={{ /*backgroundColor: 'rgba(255, 255, 255, 0.8)',*/ padding: '2rem',color :'white' }}>
                    <h1 className="display-4 font-weight-bold">Welcome to MicroVentures</h1>
                    <p className="lead mb-4">
                      Empowering entrepreneurs with the latest events and business insights.
                    </p>
                    <p className="mb-4">
                      At MicroVentures, we believe in the power of innovation and collaboration. Our platform serves as a hub for aspiring entrepreneurs, seasoned business owners, and industry professionals seeking to connect, learn, and grow. 
                    </p>
                    <p className="mb-4">
                      Join us for a curated selection of events designed to inspire creativity and foster networking opportunities, from engaging workshops to dynamic pitch competitions.
                    </p>
                    <p className="mb-4">
                      Stay updated with our comprehensive coverage of the latest business news, trends, and insights. Whether you're looking to refine your startup strategy or explore funding options, MicroVentures is here to support your journey.
                    </p>
                    <p className="mb-4">
                      Join our vibrant community of innovators who are passionate about driving change and making an impact in their respective fields. Together, we can turn ideas into reality!
                    </p>
                    <a href="#events" className="btn btn-primary btn-lg" style={{ padding: '10px 30px', fontSize: '1.2rem' }}>
                      Explore Events
                    </a>
                  </div>
                </section>
          <section className="py-5" style={{ minHeight: '100vh' }} id='events'>
            <h2 className="text-center mb-5">Upcoming Events</h2>
            <MDBRow className="g-4">
              {events.length > 0 ? (
                events.map(event => (
                  <MDBCol md="6" lg="4" key={event.id}>
                    <MDBCard className="w-100">
                      <MDBCardBody>
                        <MDBCardTitle>{event.eventName}</MDBCardTitle>
                        <MDBCardText>
                          <strong>Date:</strong> {new Date(event.eventDate).toDateString()}
                          <br />
                          <strong>Location:</strong> {event.eventLocation}
                          <br />
                          <strong>Description:</strong> {event.eventDescription}
                        </MDBCardText>
                        <MDBBtn href={event.eventRegistrationDetails} target="_blank" color="primary">
                          Learn More
                        </MDBBtn>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                ))
              ) : (
                <MDBCol>
                  <p className="text-center text-muted">No events available at the moment.</p>
                </MDBCol>
              )}
            </MDBRow>
          </section>
          <section className="py-5 bg-light" style={{ minHeight: '100vh' }}>
            <h2 className="text-center mb-5">Latest Business News</h2>
            <MDBRow className="g-4">
              {news.length > 0 ? (
                news.map((article, index) => (
                  <MDBCol md="6" lg="4" key={index}>
                    <MDBCard className="w-100">
                      <MDBCardBody>
                        <MDBCardTitle>{article.title}</MDBCardTitle>
                        <MDBCardText>
                          <strong>Source:</strong> {article.source}
                          <br />
                          <strong>Published At:</strong> {new Date(article.published_at).toDateString()}
                        </MDBCardText>
                        <MDBBtn href={article.url} target="_blank" color="success">
                          Read More
                        </MDBBtn>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                ))
              ) : (
                <MDBCol>
                  <p className="text-center text-muted">No news available at the moment.</p>
                </MDBCol>
              )}
            </MDBRow>
          </section>
          <footer className="text-center py-4 bg-dark text-white" style={{ position: 'relative' }}>
            <MDBContainer>
              <p>© {new Date().getFullYear()} MicroVentures. All Rights Reserved.</p>
              <p>Developed by <a href="https://www.linkedin.com/in/gokulraj0906/" target='_blank'>GokulRaj.S</a> at Youngdevs Pvt Ltd.</p>
            </MDBContainer>
          </footer>
        </div>
      </MDBContainer>
      <style>{`
        .bg-light {
          background-color: #f8f9fa;
        }

        .bg-dark {
          background-color: #343a40;
        }

        .text-white {
          color: #fff;
        }

        section {
          padding: 2rem 0;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 16px;
          }

          .content {
            margin-top: 70px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
