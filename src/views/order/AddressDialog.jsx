import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";
import { baseUrl } from "../../utils/data";

// const allowedPincodes = ['500081', '500032', '500084', '500072', '500034', '500033'];
const baseLocation = { lat: 17.45287804553729, lng: 78.38900685310364 };
const radiusInMeters = 8000;

const AddressDialog = ({
  open,
  handleClose,
  fetchAddresses,
  addresses,
  userId
}) => {
  const [mode, setMode] = useState("select");
  const [houseNumber, setHouseNumber] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPincode, setNewPincode] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newLocation, setNewLocation] = useState(null);
  const mapRef = useRef(null);

  const handleAddAddress = async () => {
    // if (!allowedPincodes.includes(newPincode.trim())) {
    //   toast.error('Only these pincodes are allowed: 500081, 500032, 500084, 500072, 500034, 500033');
    //   return;
    // }

    if (!newLocation?.lat || !newLocation?.lng) {
      return toast.error("Please select Location on Map");
    }
    if(!userId){
        return toast.error("User Id not Found.")
    }

    if (!houseNumber) return toast.error("Please Enter House Number.");
    if (!newAddress) return toast.error("Please Enter Address.");
    if (!newPincode) return toast.error("Please Enter Pincode.");

    let addup = houseNumber.trim() + " " + newAddress.trim();
    try {
      await axios.put(
        `${baseUrl}/user/admin/address/add/${userId}`,
        { address: addup, pincode: newPincode, location: newLocation },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Address added successfully");
      fetchAddresses();
      setHouseNumber("");
      setNewAddress("");
      setNewPincode("");
      setMode("select")
      setNewLocation(null);
      handleClose()
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if(!userId){
        return toast.error("User Id not Found.")
    }
    try {
      await axios.put(
        `${baseUrl}/user/admin/address/remove/${userId}`,
        { addressId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Address deleted successfully");
      fetchAddresses();
      handleClose()
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  useEffect(() => {
    if (open) {
      fetchAddresses();
    }
  }, [open]);

  const handleMapClick = useCallback((event) => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();

    if (window.google && window.google.maps && window.google.maps.geometry) {
      const distance =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          new window.google.maps.LatLng(baseLocation.lat, baseLocation.lng),
          new window.google.maps.LatLng(lat, lng)
        );
      console.log(distance);
      if (distance <= radiusInMeters) {
        setNewLocation({ lat, lng });

        // Fetch address and pincode using Geocoding API
        fetchAddressFromLatLng(lat, lng);
      } else {
        toast.error("Selected location is outside the 13 km radius");
      }
    }
  }, []);
  console.log(newLocation);

  const fetchAddressFromLatLng = async (lat, lng) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    const data = await response.json();
    if (data.status === "OK") {
      const addressComponents = data.results[0].address_components;
      const formattedAddress = data.results[0].formatted_address;
      const pincode = addressComponents.find((component) =>
        component.types.includes("postal_code")
      ).long_name;

      setNewAddress(formattedAddress);
      setNewPincode(pincode);
    } else {
      toast.error("Failed to fetch address details");
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
        if (permissionStatus.state === 'denied') {
          toast.error("Please Allow Loaction First.");
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log(position);
              const currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              const distance =
                window.google.maps.geometry.spherical.computeDistanceBetween(
                  new window.google.maps.LatLng(baseLocation.lat, baseLocation.lng),
                  new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng)
                );
  
              if (distance <= radiusInMeters) {
                setNewLocation(currentLocation);
                mapRef.current.panTo(currentLocation);
                fetchAddressFromLatLng(currentLocation.lat, currentLocation.lng);
              } else {
                toast.error("Current location is outside the 13 km radius");
              }
            },
            (error) => {
              if (error.code === error.PERMISSION_DENIED) {
                toast.error("Please Allow Loaction First.");
              } else {
                toast.error("Unable to retrieve your location.");
              }
            }
          );
        }
      });
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {mode === "select" ? "All Delivery Address" : "Add New Address"}
      </DialogTitle>
      <DialogContent>
        {mode === "select" ? (
          <>
            <FormControl component="fieldset">
              <RadioGroup
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
              >
                {addresses.map((address) => (
                  <>
                  <div
                    key={address._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <FormControlLabel
                      value={address._id}
                      control={<Radio />}
                      label={`${address.address}, ${address.pincode}`}
                    />
                    <Button
                      onClick={() => handleDeleteAddress(address._id)}
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </div>
                  <br />
                  <hr />
                  <br />
                  </>
                ))}
              </RadioGroup>
            </FormControl>
            <br />
            <Button
              onClick={() => setMode("add")}
              color="primary"
              variant="contained"
            >
              Add New Address
            </Button>
          </>
        ) : (
          <>
            <LoadScript
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              libraries={["geometry"]}
            >
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "400px" }}
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
                    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // Green marker for base location
                  }}
                />
                {newLocation && (
                  <Marker
                    position={newLocation}
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Blue marker for new location
                    }}
                  />
                )}
                <Circle
                  center={baseLocation}
                  radius={0}
                  options={{
                    fillColor: "green",
                    fillOpacity: 0.2,
                    strokeColor: "green",
                    strokeOpacity: 0.5,
                  }}
                />
              </GoogleMap>
            </LoadScript>
            <Typography sx={{color:"red"}}>Please Allow Location to Add Address.</Typography>
            <Button
              onClick={handleGeolocation}
              color="primary"
              variant="contained"
            >
              Tag My Location
            </Button>
            <TextField
              margin="dense"
              label="House No & Flat"
              fullWidth
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
            />
            <TextField
              margin="dense"
              label="New Address"
              fullWidth
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Pincode"
              fullWidth
              value={newPincode}
              onChange={(e) => setNewPincode(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        {mode === "select" ? (
          <>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            {/* <Button
            //   onClick={() => handleSelectAddress(selectedAddress)}
              color="primary"
              variant="contained"
            >
              Select
            </Button> */}
          </>
        ) : (
          <>
            <Button onClick={() => setMode("select")} color="primary">
              Close
            </Button>
            <Button
              onClick={handleAddAddress}
              color="primary"
              variant="contained"
            >
              Add Address
            </Button>
          </>
        )}

      </DialogActions>
    </Dialog>
  );
};

export default AddressDialog;
