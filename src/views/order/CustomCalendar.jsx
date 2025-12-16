import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./Calendar.css";
import { Button } from '@mui/material';

const CustomCalendar = ({ dates, onClose, onSelectDates, selectMultiple, selectableDates, action, setAction }) => {
  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    if (selectedDates.length > 0) {
      onSelectDates(selectedDates);
    }else{
      setAction("")
    }
  }, [selectedDates]);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toDateString();

      if (selectedDates.includes(dateString)) {
        return 'selected-date';
      }
      if (dates.deliveryDates.includes(dateString)) {
        return 'delivery-date';
      }
      if (dates.pauseDates.includes(dateString)) {
        return 'pause-date';
      }
      if (dates.upcomingDeliveryDates.includes(dateString)) {
        return 'upcoming-delivery-date';
      }
    }
  };

  // const isSelectable = date => {
  //   const dateStr = date.toDateString();
  //   if (action === 'pause') {
  //     if (selectedDates.some(d => dates.pauseDates.includes(d))) {
  //       return dates.pauseDates.includes(dateStr);
  //     }
  //     return dates.upcomingDeliveryDates.includes(dateStr);
  //   } else if (action === 'resume') {
  //     if (selectedDates.some(d => dates.upcomingDeliveryDates.includes(d))) {
  //       return dates.upcomingDeliveryDates.includes(dateStr);
  //     }
  //     return dates.pauseDates.includes(dateStr);
  //   }
  //   return true;
  // };

  const handleDateClick = (value) => {
    // console.log(dates);
    // console.log(selectMultiple);
    // console.log(action);
    const dateStr = value.toDateString();
    if (selectMultiple) {
      console.log("hii", dateStr);
      if (action == 'pause' && !dates.upcomingDeliveryDates.includes(dateStr)) {
        return alert('You can only select upcoming delivery dates for pause.');
        
      }
      if (action == 'resume' && !dates.pauseDates.includes(dateStr)) {
        console.log('hii');
        return alert('You can only select paused dates for resume.');
      }
      setSelectedDates(prevDates => {
        if (prevDates.includes(dateStr)) {
          return prevDates.filter(date => date !== dateStr);
        } else {
          return [...prevDates, dateStr];
        }
      });
    } else {
      setSelectedDates([dateStr]);
    }
  };
  

  return (
    <div className="calendar-container">
      <Button  variant="contained" className='cal-close' onClick={onClose}>Close</Button>
      <Calendar
        tileClassName={tileClassName}
        selectRange={false}
        // tileDisabled={({ date }) => !isSelectable(date)}
        onClickDay={handleDateClick}
      />
    </div>
  );
};

export default CustomCalendar;
