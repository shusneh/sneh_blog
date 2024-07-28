import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"

export default function onlyAdminPrivateRoute() {
  const {currentUser} = useSelector(store=>store.user)
  return currentUser.isAdmin?<Outlet/> : <Navigate to='/home'/>
}
