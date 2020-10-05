import React from 'react';

import {
  Link,
  useParams
} from "react-router-dom";

const getQueryParams = () => window.location.search.replace('?', '').split('&').reduce((r,e) => (r[e.split('=')[0]] = decodeURIComponent(e.split('=')[1]), r), {});

export default class Properties extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hotelId: getQueryParams().hotelId,
      bookings: []
    };

    
  }

  getBookings = async () => {
    let response = await fetch(`http://localhost:3000/api/properties/${this.state.hotelId}/bookings`)
    let bookings = await response.json()
    this.setState({bookings: bookings})
  }

  componentDidMount() {
    this.getBookings()
  }

  render() {
    return (
      <div style={{padding: '35px'}}>
        <div>
          <Link to={"/"}>&#8592; Go Back</Link>
        </div>
        <div style={{marginTop: '20px'}}>
          <table style={{width: '100%', tableLayout: 'fixed'}}>
            <tr>
              <th>Booking ID</th>
              <th>Customer E-Mail</th>
              <th>Hotel ID</th>
            </tr>
            
          {this.state.bookings.map(booking => (
            <tr>
              <td>{booking.id}</td>
              <td>{booking.userEmail}</td>
              <td>{booking.hotelId}</td>
            </tr>
          ))}
          </table>
        </div>
        
      </div>
    );
  }
}