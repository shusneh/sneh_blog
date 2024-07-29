import { useEffect, useState } from "react"
import {useLocation} from 'react-router-dom'
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";


export default function Dashboard() {
  const location =useLocation();
  const [tab,setTab] = useState('');
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get('tab');
    if(tabFormUrl){
      setTab(tabFormUrl);
    }
  },[location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div >
      {/* Sidebar */}
      <DashSidebar/>
      </div>
      <div>
        {/* Profile */}
        {
          (tab==='profile')&&<DashProfile/>          
        }
        
      </div>
      <div>
      {
          (tab==='posts')&&<DashPosts/>          
        }
      </div>
      Dashboard
    </div>
  )
}
