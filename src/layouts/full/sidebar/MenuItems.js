import {
  IconAperture, IconCopy, IconLayoutDashboard, IconLogin, IconMoodHappy, IconTypography, IconUserPlus
} from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [
  // {
  //   navlabel: true,
  //   subheader: 'Home',
  // },

  // {
  //   id: uniqueId(),
  //   title: 'Dashboard',
  //   icon: IconLayoutDashboard,
  //   href: '/dashboard',
  // },
  
 
  {
    navlabel: true,
    subheader: 'Product',
  },
  {
    id: uniqueId(),
    title: 'All Products',
    icon: IconAperture,
    href: '/product',
  },
  {
    id: uniqueId(),
    title: 'Add Product',
    icon: IconAperture,
    href: '/add-product',
  },
  {
    navlabel: true,
    subheader: 'Category',
  },
  {
    id: uniqueId(),
    title: 'All Category',
    icon: IconAperture,
    href: '/category',
  },
  {
    id: uniqueId(),
    title: 'Add Category',
    icon: IconAperture,
    href: '/add-category',
  },
  // {
  //   navlabel: true,
  //   subheader: 'Order',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Pending Order',
  //   icon: IconAperture,
  //   href: '/order',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Complete Order',
  //   icon: IconAperture,
  //   href: '/complete-order',
  // },
  {
    navlabel: true,
    subheader: 'Pages',
  },
  // {
  //   id: uniqueId(),
  //   title: 'User',
  //   icon: IconAperture,
  //   href: '/user',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'All Businesses',
  //   icon: IconAperture,
  //   href: '/all-business',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'All Inquiry',
  //   icon: IconAperture,
  //   href: '/all-donation',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Blogs',
  //   icon: IconAperture,
  //   href: '/all-ngo',
  // },
 
  // {
  //   id: uniqueId(),
  //   title: 'All User',
  //   icon: IconAperture,
  //   href: '/all-user',
  // },
  {
    id: uniqueId(),
    title: 'User Mangement',
    icon: IconAperture,
    href: '/user',
  },
  {
    id: uniqueId(),
    title: 'User Analysis',
    icon: IconAperture,
    href: '/user-analysis',
  },
  {
    id: uniqueId(),
    title: 'Product Mangement',
    icon: IconAperture,
    href: '/product-subproduct',
  },
  {
    id: uniqueId(),
    title: 'Subscription Mangement',
    icon: IconAperture,
    href: '/subscription',
  },
  {
    id: uniqueId(),
    title: 'DailySheet Mangement',
    icon: IconAperture,
    href: '/dailysheet',
  },
  {
    id: uniqueId(),
    title: 'Production Mangement',
    icon: IconAperture,
    href: '/getsheet',
  },
  {
    id: uniqueId(),
    title: 'Delivery Mangement',
    icon: IconAperture,
    href: '/subscriptionsheet',
  },
  // {
  //   id: uniqueId(),
  //   title: 'All Memberships',
  //   icon: IconAperture,
  //   href: '/all-volu',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Verify Ngo',
  //   icon: IconAperture,
  //   href: '/verify-ngo',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Top List',
  //   icon: IconAperture,
  //   href: '/top-list',
  // },
  {
    id: uniqueId(),
    title: 'All Coupon',
    icon: IconAperture,
    href: '/all-coupon',
  },
  {
    id: uniqueId(),
    title: 'Add Coupon',
    icon: IconAperture,
    href: '/add-coupon',
  },
  {
    navlabel: true,
    subheader: 'Leads',
  },
  {
    id: uniqueId(),
    title: 'Customer Leads',
    icon: IconAperture,
    href: '/customer-leads',
  },
  {
    id: uniqueId(),
    title: 'Business Leads',
    icon: IconAperture,
    href: '/business-leads',
  },
  {
    navlabel: true,
    subheader: 'Auth',
  },
  {
    id: uniqueId(),
    title: 'Login',
    icon: IconLogin,
    href: '/auth/login',
  },
  {
    id: uniqueId(),
    title: 'Register',
    icon: IconUserPlus,
    href: '/auth/register',
  },
  
];

export default Menuitems;
