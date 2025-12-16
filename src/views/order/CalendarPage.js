import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { baseUrl } from '../../utils/data';
import { useNavigate, useParams } from 'react-router';
import { Button } from '@mui/material';
import './CalendarPage.css'; // Import your custom CSS file
// import styled from 'styled-components';

const CalendarPage = () => {
    const { id: userId } = useParams()
    const [date, setDate] = useState(new Date());
    const [subscriptionData, setSubscriptionData] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        fetchSubscriptionData();
    }, []);

    const fetchSubscriptionData = async () => {
        try {
            const response = await axios.get(`${baseUrl}/subscription/byuser/${userId}`);
            setSubscriptionData(response.data.data);
        } catch (error) {
            console.error('Error fetching subscription data:', error);
        }
    };

    const getProductNamesForDate = (date) => {
        const products = subscriptionData.filter(subscription => {
            const deliveryDates = subscription.deliveryDates.map(deliveryDate => new Date(deliveryDate).toDateString());
            const selectedDate = date.toDateString();
            return deliveryDates.includes(selectedDate);
        }).map(subscription => subscription?.product?.name || "xyz");
        return products.join(', ');
    };
    

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Button variant='contained' onClick={() => navigate(-1)} style={{ width: "120px" }}>Back</Button>
            <h2>Calendar</h2>
            <div className='custom-calendar'>
                <Calendar
                    onChange={setDate}
                    value={date}
                    showNeighboringMonth={false}
                    tileContent={({ date, view }) => {
                        if (view === 'month') {
                            const productNames = getProductNamesForDate(date);
                            return <p>{productNames}</p>;
                        }
                        return null;
                    }}
                />
            </div>
        </div>
    );
};

export default CalendarPage;
