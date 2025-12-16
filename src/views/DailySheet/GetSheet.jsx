import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../utils/data';
import { toast } from 'react-toastify';
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
} from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router';

const GetSheet = () => {
  const [sheet, setSheet] = useState(null);
  const [date, setDate] = useState(null);
  const [morningCounts, setMorningCounts] = useState({});
  const [eveningCounts, setEveningCounts] = useState({});
  const navigate = useNavigate()

  const getData = async () => {
    if (!date) {
      return toast.error('Please Select Date.');
    }
    try {
      const res = await axios.get(`${baseUrl}/dailysheet/getsheet?date=${date}`);
      if (res?.status === 200) {
        const data = res?.data;
        setSheet(data);
        calculateCounts(data.morning, setMorningCounts);
        calculateCounts(data.evening, setEveningCounts);
      }
    } catch (error) {
      toast.error('Failed to fetch data.');
    }
  };

  useEffect(() => {
    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + 1); // Adds 1 day to the current date

    setDate(nextDate.toISOString().split("T")[0]); // Set the next date in "YYYY-MM-DD" format
  }, []);

  const calculateCounts = (dataArray, setCountState) => {
    const counts = {};
    dataArray.forEach((row) => {
      row.subscription.forEach((ele)=>{
        const subProductName = ele.subProductId.name;
        if (!counts[subProductName]) {
          counts[subProductName] = 0;
        }
        counts[subProductName] += 1;
      })
    });
    setCountState(counts);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Daily Sheet for ' + new Date(sheet?.date).toLocaleDateString(), 10, 10);

    if (sheet?.morning?.length > 0) {
      doc.text('Morning', 10, 20);
      doc.autoTable({
        startY: 25,
        head: [['Sub Product', 'Quantity']],
        body: Object.keys(morningCounts).map((subProduct) => [
          subProduct,
          morningCounts[subProduct],
        ]),
      });
    }

    if (sheet?.evening?.length > 0) {
      doc.text('Evening', 10, doc.autoTable.previous.finalY + 10);
      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 15,
        head: [['Sub Product', 'Quantity']],
        body: Object.keys(eveningCounts).map((subProduct) => [
          subProduct,
          eveningCounts[subProduct],
        ]),
      });
    }

    doc.save('daily_sheet.pdf');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: '20px' }}>
          <Typography variant="h6">Select Date</Typography>
          <Input type="date" value={date} onChange={handleDateChange} />
          <Button variant="contained" onClick={getData}>
            Get Sheet
          </Button>
        </Box>
        <Button variant="contained" onClick={generatePDF} disabled={!sheet}>
          Print Detail Sheet
        </Button>
      </Box>
      <br />
      <br />
      <br />
      {sheet ? (
        <>
          <Typography variant="h6" gutterBottom>
            Daily Sheet for {new Date(sheet?.date).toLocaleDateString()}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Morning
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
              <TableRow>
                  <TableCell>Sub Product</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(morningCounts).map((subProduct) => (
                  <TableRow key={subProduct}>
                    <TableCell>{subProduct}</TableCell>
                    <TableCell>{morningCounts[subProduct]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h5" gutterBottom>
            Evening
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
              <TableRow>
                  <TableCell>Sub Product</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(eveningCounts).map((subProduct) => (
                  <TableRow key={subProduct}>
                    <TableCell>{subProduct}</TableCell>
                    <TableCell>{eveningCounts[subProduct]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography variant="body1">Please Call the Data...</Typography>
      )}
      <br /><br /><br />
      <Button variant='contained' onClick={()=>navigate('/subscriptionsheet')}>Print All Order</Button>
    </Box>
  );
};

export default GetSheet;
