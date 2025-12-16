import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { toast } from 'react-toastify';
import { baseUrl } from '../../utils/data';

const googleMapsApiKey = 'AIzaSyD8qT43Pj2CBQnepwSN3jahcczBeWsyM2k'; // Replace with your actual Google Maps API key
const baseLocation = { lat: 17.45287804553729, lng: 78.38900685310364 };
const radiusInMeters = 9000;

const AddUser = () => {
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [openMapDialog, setOpenMapDialog] = useState(false);
  const mapRef = useRef(null);

  const handleSubmit = async () => {
    if (!mobile) return toast.error('Please enter a mobile number.');
    if (!address) return toast.error('Please enter an address.');
    if (!pincode) return toast.error('Please enter a pincode.');
    if (!location.lat || !location.lng) return toast.error('Please enter a valid location.');
    if (!email) return toast.error('Please enter an email.');
    if (!name) return toast.error('Please enter a name.');

    const payload = {
      mobile,
      address,
      pincode,
      location,
      email,
      name,
    };

    try {
      const response = await axios.post(`${baseUrl}/user/admin/create`, payload);
      if (response.status === 200) {
        toast.success('User created successfully.');
        // Clear the form after successful submission
        setMobile('');
        setAddress('');
        setPincode('');
        setLocation({ lat: '', lng: '' });
        setEmail('');
        setName('');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error?.response?.data?.message || 'Error creating user.');
    }
  };

  const fetchAddressFromLocation = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`,
      );
      const result = response.data.results[0];
      if (result) {
        const addressComponents = result.address_components;
        const pincode = addressComponents.find((component) =>
          component.types.includes("postal_code")
        ).long_name;
        setAddress(result.formatted_address);
        setPincode(pincode)
      } else {
        toast.error('No address found for this location.');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      toast.error('Error fetching address.');
    }
  };

  const handleMapClick = (event) => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (window.google && window.google.maps && window.google.maps.geometry) {
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(baseLocation.lat, baseLocation.lng),
        new window.google.maps.LatLng(lat, lng),
      );
      console.log(distance);
      if (distance <= radiusInMeters) {
        setLocation({ lat, lng });
        fetchAddressFromLocation(lat, lng);
      } else {
        toast.error('Selected location is outside the 9 km radius');
      }
    } else {
      toast.error('Google Maps Geometry library failed to load.');
    }
  };

  const handleFetchButtonClick = () => {
    setOpenMapDialog(true);
  };

  const handleCloseMapDialog = () => {
    setOpenMapDialog(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Add User
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Latitude"
            value={location.lat}
            onChange={(e) => setLocation({ ...location, lat: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Longitude"
            value={location.lng}
            onChange={(e) => setLocation({ ...location, lng: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Add User
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" onClick={handleFetchButtonClick}>
            Fetch Location
          </Button>
        </Grid>
      </Grid>

      <Dialog open={openMapDialog} onClose={handleCloseMapDialog} maxWidth="md" fullWidth>
        <DialogTitle>Select Location (within 9 km radius)</DialogTitle>
        <DialogContent>
          <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={['geometry']}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={baseLocation}
              zoom={12}
              onClick={handleMapClick}
              onLoad={(map) => (mapRef.current = map)}
              options={{
                mapTypeControl: false,
                zoomControl: true,
                streetViewControl: true,
                fullscreenControl: true,
              }}
            >
              <Marker
                position={baseLocation}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', // Green marker for base location
                }}
              />
              {location && (
                <Marker
                  position={location}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Blue marker for new location
                  }}
                />
              )}
              {/* <Circle
                  center={baseLocation}
                  radius={0}
                  options={{
                    fillColor: "green",
                    fillOpacity: 0.2,
                    strokeColor: "green",
                    strokeOpacity: 0.5,
                  }}
                /> */}
            </GoogleMap>
          </LoadScript>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMapDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddUser;
