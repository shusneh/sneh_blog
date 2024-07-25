import { Sidebar } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';

import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';

export default function DashSidebar() {
    const dispatch = useDispatch();
    const location = useLocation();
    const [tab, setTab] = useState('');
    const handleSignout = async()=>{
      try {
        const res = await fetch('/api/user/signout', {
          method:"POST"
        });
        const data = res.json();
        if(!res.ok){
          console.log(data.message);
        }
        else{
          dispatch(signoutSuccess());
          console.log('signOut');
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if (tabFromUrl) {
        setTab(tabFromUrl);
      }
    }, [location.search]);

  
  return (
    <Sidebar className='w-full md:w-56 min-h-screen'>
    <Sidebar.Items>
      <Sidebar.ItemGroup className='flex flex-col gap-1'>
        <Link to={'/dashboard?tab=profile'}>
        <Sidebar.Item active={tab==='profile'}
        icon = {HiUser}
        label = {'User'}
        labelColor = {'dark'}
        as = 'div'
        >
            Profile
        </Sidebar.Item>
        </Link>
        <Sidebar.Item 
        icon = {HiArrowSmRight}
        onClick = {handleSignout}
       className ='cursor-pointer'
        >
            Sign Out
        </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar.Items>
  </Sidebar>
)
}