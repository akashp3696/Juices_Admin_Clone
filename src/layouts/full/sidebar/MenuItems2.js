import {
    IconAperture, IconCopy, IconLayoutDashboard, IconLogin, IconMoodHappy, IconTypography, IconUserPlus
  } from '@tabler/icons';
  
  import { uniqueId } from 'lodash';
  
  const Menuitems = [  
    {
      id: uniqueId(),
      title: 'Pending Order',
      icon: IconAperture,
      href: '/sub/order',
    },
    {
      id: uniqueId(),
      title: 'Complete Order',
      icon: IconAperture,
      href: '/sub/complete-order',
    },
    // {
    //   id: uniqueId(),
    //   title: 'Login',
    //   icon: IconLogin,
    //   href: '/sub-auth/login',
    // },
  ];
  
  export default Menuitems;
  