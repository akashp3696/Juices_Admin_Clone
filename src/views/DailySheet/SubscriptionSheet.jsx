import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/data";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Input,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import jsPDF from "jspdf";
import "jspdf-autotable";

const SubscriptionSheet = () => {
  const [sheet, setSheet] = useState({
    morning: [],
    evening: [],
  });
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState("Morning");
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    // Calculate the next date
    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + 1); // Adds 1 day to the current date

    setDate(nextDate.toISOString().split("T")[0]); // Set the next date in "YYYY-MM-DD" format
  }, []);

  // Flatten nested array into a single array
  const flattenSheetData = (data, slotType) => {
    return (
      data?.[slotType.toLowerCase()]?.flatMap((row) =>
        row.subscription.map((sub) => ({ ...sub, rowInfo: row }))
      ) || []
    );
  };

  const matchAndUpdateData = (firstArray, secondArray) => {
    const orderMap = new Map();
  secondArray.forEach((item, index) => {
    orderMap.set(item._id, index);
  });

  // Sort firstArray based on the index from orderMap
  return firstArray.sort((a, b) => {
    const indexA = orderMap.get(a._id);
    const indexB = orderMap.get(b._id);

    // If both _id's are present in the second array, sort by their index
    if (indexA !== undefined && indexB !== undefined) {
      return indexA - indexB;
    }
    // If only a is present in the second array, it should come first
    if (indexA !== undefined) {
      return -1;
    }
    // If only b is present in the second array, it should come first
    if (indexB !== undefined) {
      return 1;
    }
    // If neither is present, maintain the order
    return 0;
  });
  };

  const getData = async () => {
    if (!date) {
      return toast.error("Please Select Date.");
    }
    try {
      const res = await axios.get(
        `${baseUrl}/dailysheet/getsheet?date=${date}`
      );
      if (res?.status === 200) {
        // Flatten the sheet data here
        const flattenedData = {
          morning: flattenSheetData(res.data, "Morning"),
          evening: flattenSheetData(res.data, "Evening"),
        };
        // setSheet(flattenedData);
        const updatedSheet = {
          morning: matchAndUpdateData(
            flattenedData.morning,
            JSON.parse(localStorage.getItem("morning") || "[]"),
          ),
          evening: matchAndUpdateData(
            flattenedData.evening,
            JSON.parse(localStorage.getItem("evening") || "[]"),
          ),
        };

        setSheet(updatedSheet);

        // localStorage.setItem("morning", JSON.stringify(updatedSheet.morning));
        // localStorage.setItem("evening", JSON.stringify(updatedSheet.evening));
      }
    } catch (error) {
      toast.error("Failed to fetch data.");
    }
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSlotChange = (event) => {
    setSlot(event.target.value);
  };

  const handleClickOpen = (location) => {
    setSelectedLocation(location);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedLocation(null);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return; // Dropped outside the list

    const items = Array.from(sheet[slot.toLowerCase()]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSheet((prevSheet) => ({
      ...prevSheet,
      [slot.toLowerCase()]: items,
    }));
    console.log(items);
    localStorage.setItem(slot.toLowerCase(), JSON.stringify(items));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(
      `Subscription Sheet for ${new Date(
        sheet?.date
      ).toLocaleDateString()} (${slot})`,
      10,
      10
    );

    const subscriptions = sheet[slot.toLowerCase()] || [];

    if (subscriptions.length > 0) {
      doc.autoTable({
        startY: 20,
        head: [
          [
            "Subscription Id",
            "Name",
            "Sub Product",
            "Phone",
            "Delivery Address",
          ],
        ],
        body: subscriptions.map((sub) => [
          sub.subscriptionId?.subscriptionCode,
          sub.subscriptionId?.user?.name,
          sub.subProductId?.name,
          sub.subscriptionId?.user?.mobile,
          sub.subscriptionId?.deliveryAddress,
        ]),
      });
    } else {
      doc.text("No subscriptions found.", 10, 30);
    }

    doc.save("subscription_sheet.pdf");
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: "20px" }}>
          <Typography variant="h6">Select Date</Typography>
          <Input type="date" value={date} onChange={handleDateChange} />
          <Typography variant="h6">Select Slot</Typography>
          <Select value={slot} onChange={handleSlotChange}>
            <MenuItem value="Morning">Morning</MenuItem>
            <MenuItem value="Evening">Evening</MenuItem>
          </Select>
          <Button variant="contained" onClick={getData}>
            Get Sheet
          </Button>
        </Box>
        <Button variant="contained" onClick={generatePDF} disabled={!sheet}>
          Print Subscription Sheet
        </Button>
      </Box>
      <br />
      <br />
      <br />
      {sheet ? (
        <>
          <Typography variant="h6" gutterBottom>
            Subscription Sheet for {new Date(sheet?.date).toLocaleDateString()}{" "}
            ({slot})
          </Typography>
          <TableContainer component={Paper}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <Table {...provided.droppableProps} ref={provided.innerRef}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Subscription Id</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Sub Product</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Delivery Address</TableCell>
                        <TableCell>View Location</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sheet[slot.toLowerCase()]?.map((sub, index) => (
                        <Draggable
                          key={sub._id}
                          draggableId={sub._id}
                          index={index}
                        >
                          {(provided) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TableCell>
                                {sub.subscriptionId?.subscriptionCode}
                              </TableCell>
                              <TableCell>
                                {sub.subscriptionId?.user?.name}
                              </TableCell>
                              <TableCell>{sub.subProductId?.name}</TableCell>
                              <TableCell>
                                {sub.subscriptionId?.user?.mobile}
                              </TableCell>
                              <TableCell>
                                {sub.subscriptionId?.deliveryAddress}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    handleClickOpen(
                                      sub.subscriptionId?.deliveryLocation
                                    )
                                  }
                                >
                                  View Location
                                </Button>
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  </Table>
                )}
              </Droppable>
            </DragDropContext>
          </TableContainer>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Delivery Location</DialogTitle>
            <DialogContent>
              {selectedLocation && (
                <iframe
                  width="100%"
                  height="450"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}&hl=es;z=14&output=embed`}
                  allowFullScreen
                ></iframe>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Typography variant="body1">Please Call the Data...</Typography>
      )}
    </Box>
  );
};

export default SubscriptionSheet;
