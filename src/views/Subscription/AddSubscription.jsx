import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../utils/data";
import { toast } from "react-toastify";

const AddSubscription = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [subProducts, setSubProducts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSubProducts, setSelectedSubProducts] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [slot, setSlot] = useState("");
  const [packageType, setPackageType] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [orderAmount, setOrderAmount] = useState("");
  const [packingAmount, setPackingAmount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [orderType, setOrderType] = useState("");
  const [customization, setCustomization] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user/all`);
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/product/all`);
      if(res.status==200){
        setProducts(res?.data?.data || []);
        const combinedSubProducts = res.data.data.flatMap(
          (product) => product.subProduct || []
        );
        setSubProducts(combinedSubProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  console.log(subProducts)

  useEffect(() => {
    fetchUserData();
    fetchProducts();
  }, []);
  //   console.log(selectedUser);

  const handleCustomizationChange = (e) => {
    const isCustomized = e.target.value === "yes";
    setCustomization(isCustomized);
    if (!isCustomized) {
      setSelectedSubProducts([]); // Clear selected subproducts if customization is "No"
    }
  };

  const handleSubmit = async () => {
    if (!selectedUser) return toast.error("Please User Select");
    if (!selectedProduct) return toast.error("Please Select Product.");
    if (!deliveryAddress) return toast.error("Please Select Delivery Address.");
    if (!deliveryLocation) return toast.error("Location not found..");
    if (!startDate) return toast.error("Select Start Date.");
    if (!slot) return toast.error("Select Slot.");
    if (!packageType) return toast.error("Select Package Type.");
    if (!orderType) return toast.error("Select Order Type.");
    if (!orderAmount || orderAmount == 0)
      return toast.error("Enter Order Amount.");
    if (customization) {
      const requiredLength = orderType === "trial" ? 6 : 26;
      if (selectedSubProducts.length !== requiredLength) {
        return toast.error(`Please select ${requiredLength} subproducts.`);
      }
    }
    // console.log(deliveryAddress);
    const selectedAddress = selectedUser.deliveryAddress.find(
      (addr) => addr._id == deliveryAddress
    );
    // console.log(selectedAddress);
    const payload = {
      userId: selectedUser._id,
      product: selectedProduct,
      startDate,
      deliveryAddress: `${selectedAddress.address} ${selectedAddress.pincode}`,
      slot,
      packageType,
      deliveryLocation,
      orderAmount,
      packingAmount,
      remain: orderType == "trial" ? 6 : 26,
      customization: customization,
      customizationSubProduct: customization ? selectedSubProducts : [],
    };

    if (
      payload.deliveryAddress == null ||
      payload.deliveryAddress == undefined ||
      !payload.deliveryAddress
    ) {
      return toast.error("Please Referse Page");
    }

    try {
      const response = await axios.post(
        `${baseUrl}/subscription/admin/createSubscription`,
        payload
      );
      if (response.status == 200) {
        toast.success("Subscription Added.");
      }
      console.log("Subscription created successfully:", response.data);
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Add Subscription
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <InputLabel>Order Type</InputLabel>
            <Select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
            >
              <MenuItem value="trial">Trial</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={users}
            getOptionLabel={(option) => `${option.name}-${option.mobile}`}
            onChange={(event, newValue) => setSelectedUser(newValue)}
            renderInput={(params) => <TextField {...params} label="User" />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Product</InputLabel>
            <Select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {products.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {selectedUser && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Delivery Address</InputLabel>
              <Select
                value={deliveryAddress}
                onChange={(e) => {
                  setDeliveryAddress(e.target.value);
                  const selectedAddress = selectedUser.deliveryAddress.find(
                    (addr) => addr._id === e.target.value
                  );
                  setDeliveryLocation(selectedAddress.location);
                }}
              >
                {selectedUser.deliveryAddress.map((address) => (
                  <MenuItem key={address._id} value={address._id}>
                    {address.address}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        {deliveryLocation && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Delivery Location"
              value={`Lat: ${deliveryLocation.lat}, Lng: ${deliveryLocation.lng}`}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Slot</InputLabel>
            <Select value={slot} onChange={(e) => setSlot(e.target.value)}>
              <MenuItem value="Morning">Morning</MenuItem>
              <MenuItem value="Evening">Evening</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Package Type</InputLabel>
            <Select
              value={packageType}
              onChange={(e) => setPackageType(e.target.value)}
            >
              <MenuItem value="onetimeuse">Plastic Bottle</MenuItem>
              <MenuItem value="resualbe">Glass Bottle</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Order Amount"
            value={orderAmount}
            onChange={(e) => setOrderAmount(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Packing Amount"
            value={packingAmount}
            onChange={(e) => setPackingAmount(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Customization</InputLabel>
            <Select
              value={customization ? "yes" : "no"}
              onChange={handleCustomizationChange}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {customization && (
          <Grid item xs={12} sm={12}>
            <Typography variant="h6">Select Subproducts</Typography>
            {Array.from({ length: orderType === "trial" ? 6 : 26 }).map((_, index) => (
              <FormControl fullWidth key={index} margin="normal">
                <InputLabel>{`Day ${index + 1}`}</InputLabel>
                <Select
                  value={selectedSubProducts[index] || ""}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const newSelectedSubProducts = [...selectedSubProducts];
                    newSelectedSubProducts[index] = selectedId
                    setSelectedSubProducts(newSelectedSubProducts);
                  }}
                >
                  {subProducts.map((subProduct) => (
                    <MenuItem key={subProduct._id} value={subProduct._id}>
                      {subProduct.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
          </Grid>
        )}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Add Subscription
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddSubscription;
