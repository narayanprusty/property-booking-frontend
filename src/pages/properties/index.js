import React from 'react';
import GoogleMapReact from 'google-map-react';

import home from './icons/home.svg'
import active from './icons/active.svg'
import ReactHtmlParser from 'react-html-parser'

class Marker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  book = async () => {
    let hotelId = this.props.hotelId
    let userEmail = prompt("Please enter email for booking")

    let response = await fetch('http://localhost:3000/api/bookings', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hotelId,
        userEmail
      })
    })

    if(response.status !== 200) {
      alert('An error occured')
    } else {
      alert('Booked successfully')
    }
  }

  render() {
    return (
      <div>
        <img src={this.props.active ? active : home} onClick={() => {
          this.props.changeActive(this.props.hotelId)
        }} />
        {this.props.active &&
          <div style={{
            backgroundColor: 'white',
            padding: '5px',
            borderColor: 'black',
            borderRadius: '10px',
            width: '250px',
            position: 'relative',
            left: '-105px',
            height: 'auto',
            display: 'block',
            zIndex: '1000000000'
          }}>
              <br></br>
              <b>{this.props.title}</b> <br></br>
              <p>
                {ReactHtmlParser(this.props.vicinity)}
              </p>
              <p>
                <a href="">View Bookings</a> &nbsp;&nbsp;&nbsp;&nbsp; <a href="javascript:void()" onClick={this.book}>Book</a>
              </p>
          </div>
        }
      </div>
      
    )
  }
}

export default class Properties extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hotels: {},
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      this.setState({
        lat: position.coords.latitude,
        long: position.coords.longitude
      })

      await this.getHotels(position.coords.latitude, position.coords.longitude)
    });
  }

  getHotels = async (lat, long) => {
    let response = await fetch(`http://localhost:3000/api/properties?at=${lat},${long}`)
    let hotels = await response.json()

    let hotelsState = {}

    hotels.forEach(element => {
      element.active = false

      hotelsState[element.id] = element
    });

    this.setState({hotels: hotelsState})
  }

  changeActive = async (hotelId) => {
    let hotels = this.state.hotels

    let alreadyActive = false

    if(hotels[hotelId].active) {
      alreadyActive = true
    }

    Object.keys(hotels).forEach((hotelId) => {
      hotels[hotelId].active = false
    })

    if(alreadyActive) {
      hotels[hotelId].active = false
    } else {
      hotels[hotelId].active = true
    }

    this.setState({
      hotels
    })
  }

  render() {
    return (
       <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          ref={this.refMap}
          bootstrapURLKeys={{ key: 'AIzaSyCPgppP4zLzciUsphjMDr9QP3_WIdNdPNo' }}
          center={{ lat: this.state.lat, lng: this.state.long }}
          zoom={11}
        >
          {Object.keys(this.state.hotels).map(hotelId => (
            <Marker
              vicinity={this.state.hotels[hotelId].vicinity}
              title={this.state.hotels[hotelId].title}
              active={this.state.hotels[hotelId].active}
              changeActive={this.changeActive}
              hotelId={hotelId}
              lat={this.state.hotels[hotelId].position[0]}
              lng={this.state.hotels[hotelId].position[1]}
            />
          ))}
          
        </GoogleMapReact>
      </div>
    );
  }
}