import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import AddProduct from 'src/views/product/AddProduct';
import AllProducts from 'src/views/product/AllProducts';
import EditProduct from 'src/views/product/EditProduct';
import AllCategories from 'src/views/category/AllCategories';
import AddCategory from 'src/views/category/AddCategory';
import EditCategory from 'src/views/category/EditCategory';
import OrderTable from 'src/views/order/OrderTable';
import CompleteOrder from 'src/views/order/CompleteOrder';
import UserManagementPage from 'src/views/order/UserManagementPage';
import Calendar from 'react-calendar';
import CalendarPage from 'src/views/order/CalendarPage';
import AllCoupon from 'src/views/Coupon/AllCoupon';
import AddCoupon from 'src/views/Coupon/AddCoupon';
import EditCoupon from 'src/views/Coupon/EditCoupon';
import SubAdminLayout from 'src/layouts/full/SubAdminLayout';
import { element } from 'prop-types';
import Login2 from 'src/views/authentication/SubLogin';
import SubProducts from 'src/views/product/SubProducts';
import UserSubscriptions from 'src/views/order/UserSubscriptions';
import SingleSubscription from 'src/views/order/SingleSubscription';
import ProductsWithSubProducts from 'src/views/product/ProductsWithSubProducts';
import Subscription from 'src/views/Subscription/Subscription';
import DailySheet from 'src/views/DailySheet/DailySheet';
import GetSheet from 'src/views/DailySheet/GetSheet';
import SubscriptionSheet from 'src/views/DailySheet/SubscriptionSheet';
import AddSubscription from 'src/views/Subscription/AddSubscription';
import AddUser from 'src/views/order/AddUser';
import UserAnalysis from 'src/views/Subscription/UserAnalysis';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const AllOpportunities = Loadable(lazy(() => import('../views/sample-page/AllOpportunities')))
const AllBusinesses = Loadable(lazy(() => import('../views/sample-page/AllBusinesses')))
const AllDonation = Loadable(lazy(() => import('../views/sample-page/AllDonation')))
const AllNgo = Loadable(lazy(() => import('../views/sample-page/AllNgo')))
const AllUser = Loadable(lazy(() => import('../views/sample-page/AllUser')))
const AllVolunteer = Loadable(lazy(() => import('../views/sample-page/AllVolunteer')))
const AllGallery = Loadable(lazy(() => import('../views/sample-page/AllGallery')))
const TopList = Loadable(lazy(() => import('../views/sample-page/TopList')))
const VerifyNgo = Loadable(lazy(() => import('../views/sample-page/VerifyNgo')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const BlogForm = Loadable(lazy(() => import('../views/sample-page/BlogForm')));
const WebinarForm = Loadable(lazy(() => import('../views/sample-page/AddWebinar')));
const CustomerLeads = Loadable(lazy(() => import('../views/Leads/CustomerLeads')));
const BusinessLeads = Loadable(lazy(() => import('../views/Leads/BusinessLeads')));



const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/auth/login" /> },
      { path: '/dashboard', exact: true, element: <AllProducts /> },
      { path: '/all-oppo', exact: true, element: <AllOpportunities /> },
      { path: '/product', exact: true, element: <AllProducts /> },
      { path: '/sub-product/:id', exact: true, element: <SubProducts /> },
      { path: '/add-product', exact: true, element: <AddProduct /> },
      { path: '/edit-product/:id', exact: true, element: <EditProduct /> },
      { path: '/category', exact: true, element: <AllCategories /> },
      { path: '/add-category', exact: true, element: <AddCategory /> },
      { path: '/edit-category/:id', exact: true, element: <EditCategory /> },
      { path: '/all-business', exact: true, element: <AllBusinesses /> },
      { path: '/all-donation', exact: true, element: <AllDonation /> },
      { path: '/order', exact: true, element: <OrderTable /> },
      { path: '/product-subproduct', exact: true, element: <ProductsWithSubProducts /> },
      { path: '/subscription', exact: true, element: <Subscription /> },
      { path: '/user-analysis', exact: true, element: <UserAnalysis /> },
      { path: '/add-subscription', exact: true, element: <AddSubscription /> },
      { path: '/user', exact: true, element: <UserManagementPage /> },
      { path: '/add-user', exact: true, element: <AddUser /> },
      { path: '/getsheet', exact: true, element: <GetSheet /> },
      { path: '/subscriptionsheet', exact: true, element: <SubscriptionSheet /> },
      { path: '/dailysheet', exact: true, element: <DailySheet /> },
      { path: '/user-subscription/:userId', exact: true, element: <UserSubscriptions /> },
      { path: '/single-subscription/:subscriptionId', exact: true, element: <SingleSubscription /> },
      { path: '/calendar/:id', exact: true, element: <CalendarPage /> },
      { path: '/complete-order', exact: true, element: <CompleteOrder /> },
      { path: '/all-ngo', exact: true, element: <AllNgo /> },
      { path: '/all-user', exact: true, element: <AllUser/> },
      { path: '/all-volu', exact: true, element: <AllVolunteer /> },
      { path: '/all-gallery', exact: true, element: <AllGallery /> },
      { path: '/all-coupon', exact: true, element: <AllCoupon /> },
      { path: '/add-coupon', exact: true, element: <AddCoupon /> },
      { path: '/customer-leads', exact: true, element: <CustomerLeads /> },
      { path: '/business-leads', exact: true, element: <BusinessLeads /> },
      { path: '/edit-coupon/:id', exact: true, element: <EditCoupon /> },
      { path: '/top-list', exact: true, element: <TopList /> },
      { path: '/verify-ngo', exact: true, element: <VerifyNgo /> },
      { path: '/blogform', exact: true, element: <BlogForm /> },
      { path: '/webinarform', exact: true, element: <WebinarForm /> },


      { path: '*', element: <Navigate to="/auth/404" /> },
   
    ],
  },
  // {
  //   path: '/sub',
  //   element: <SubAdminLayout />,
  //   children: [
  //     { path: '404', element:<Error /> },
  //     { path: '/sub/order', exact: true, element: <OrderTable /> },
  //     { path: '/sub/complete-order', exact: true, element: <CompleteOrder /> },
  //     { path: '/sub-auth/login', element: <Login2 /> },
  //   ]
  // },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  // {
  //   path: '/sub-auth',
  //   element: <BlankLayout />,
  //   children: [
  //     { path: '404', element: <Error /> },
  //     { path: '/sub-auth/login', element: <Login2 /> },
  //     { path: '*', element: <Navigate to="/auth/404" /> },
  //   ],
  // },
];

export default Router;
