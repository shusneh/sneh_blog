import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"

export default function PrivateRoute() {
  const {currentUser} = useSelector(store=>store.user)
  return currentUser?<Outlet/> : <Navigate to='/sign-in'/> 
}
