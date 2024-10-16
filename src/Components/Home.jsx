import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import { Link } from 'react-router-dom';
import MyNavbar from './Navbar';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsList);
        console.log('Fetched events:', eventsList);
      } catch (error) {
        console.error('Error fetching events: ', error);
      }
    };

    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=business&apiKey=ff584fc7ecb5403bae2447536da830cc`
        );
        const data = await response.json();
        setNews(data.articles);
        console.log('Fetched news:', data.articles);
      } catch (error) {
        console.error('Error fetching news: ', error);
      }
    };

    fetchEvents();
    fetchNews();
  }, []);

  return (
    <>
      <MDBContainer>
        <MyNavbar />
        <MDBContainer className='my-5'>
          <h2 className='text-center mb-4'>Upcoming Events</h2>
          <div className="scrollable-container" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
            <MDBRow>
              {events.length > 0 ? (
                events.map(event => (
                  <MDBCol md='4' key={event.id} className='mb-4'>
                    <MDBCard>
                      <MDBCardBody>
                        <MDBCardTitle>{event.eventName}</MDBCardTitle>
                        <MDBCardText>
                          <strong>Date:</strong> {new Date(event.eventDate).toDateString()}
                          <br />
                          <strong>Location:</strong> {event.eventLocation}
                          <br />
                          <strong>Description:</strong> {event.eventDescription}
                        </MDBCardText>
                        <Link to={`/event/${event.id}`}>
                          <MDBBtn>More Details</MDBBtn>
                        </Link>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                ))
              ) : (
                <MDBCol>
                  <p>No events available at the moment.</p>
                </MDBCol>
              )}
            </MDBRow>
          </div>
        </MDBContainer>
        <MDBContainer className='my-5'>
          <h2 className='text-center mb-4'>Business News</h2>
          <div className="scrollable-container">
            <MDBRow>
              {news.length > 0 ? (
                news.map((article, index) => (
                  <MDBCol md='4' key={index} className='mb-4'>
                    <MDBCard>
                      <MDBCardBody>
                        <MDBCardTitle>{article.title}</MDBCardTitle>
                        <MDBCardText>
                          <strong>Source:</strong> {article.source.name}
                          <br />
                          <strong>Published At:</strong> {new Date(article.publishedAt).toDateString()}
                          <br />
                          <strong>Description:</strong> {article.description}
                        </MDBCardText>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          <MDBBtn>Read More</MDBBtn>
                        </a>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                ))
              ) : (
                <MDBCol>
                  <p>No news available at the moment.</p>
                </MDBCol>
              )}
            </MDBRow>
          </div>
        </MDBContainer>
      </MDBContainer>
      <style>{`
        .scrollable-container {
         
          max-height: 300px; /* Adjust the height as needed */
          overflow: scroll;
        }

        .scrollable-container::-webkit-scrollbar {
          width: 12px;
        }

        .scrollable-container::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 10px;
        }

        .scrollable-container::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }
      `}</style>
    </>
  );
};

export default Home;
