import React, { useEffect, useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';

const SalesOverview = ({ subscriptions }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [monthlyPrices, setMonthlyPrices] = useState([]);

    const theme = useTheme();
    const primary = theme.palette.primary.main;

    useEffect(() => {
        if (subscriptions?.length > 0) {
            aggregateMonthlyPrices();
        }
    }, [selectedYear, subscriptions]);

    const handleChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const aggregateMonthlyPrices = () => {
        const monthlyPricesMap = new Map();

        subscriptions?.forEach(subscription => {
            const startDate = new Date(subscription?.startDate);
            if (startDate.getFullYear().toString() == selectedYear) {
                const monthYearKey = `${startDate.getMonth() + 1}/${startDate.getFullYear()}`;
                const price = subscription.product ? subscription?.product?.price : 0;
                monthlyPricesMap.set(monthYearKey, (monthlyPricesMap.get(monthYearKey) || 0) + price);
            }
        });
        const aggregatedMonthlyPrices = Array.from(monthlyPricesMap).map(([key, value]) => ({
            monthYear: key,
            price: value,
        }));
        setMonthlyPrices(aggregatedMonthlyPrices);
    };

    // console.log(monthlyPrices);

    const options = {
        chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
            },
            height: 370,
        },
        colors: [primary],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '42%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },
        stroke: {
            show: true,
            width: 5,
            lineCap: "butt",
            colors: ["transparent"],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        yaxis: {
            tickAmount: 4,
        },
        xaxis: {
            categories: monthlyPrices.map(item => item.monthYear),
            axisBorder: {
                show: false,
            },
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
        },
    };

    const series = [
        {
            name: 'Total Price',
            data: monthlyPrices.map(item => item.price),
        }
    ];

    return (
        <DashboardCard title="Sales Overview" action={
            <Select
                labelId="year-dd"
                id="year-dd"
                value={selectedYear}
                size="small"
                onChange={handleChange}
            >
                <MenuItem value={(new Date().getFullYear() - 1).toString()}>{new Date().getFullYear() - 1}</MenuItem>
                <MenuItem value={new Date().getFullYear().toString()}>{new Date().getFullYear()}</MenuItem>
                <MenuItem value={(new Date().getFullYear() + 1).toString()}>{new Date().getFullYear() + 1}</MenuItem>
            </Select>
        }>
            <Chart
                options={options}
                series={series}
                type="bar"
                height="370px"
            />
        </DashboardCard>
    );
};

export default SalesOverview;
