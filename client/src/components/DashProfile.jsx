import { useSelector } from "react-redux"
import {TextInput,Button} from 'flowbite-react'

export default function DashProfile() {
    const {currentUser} = useSelector(store=>store.user);
    console.log(currentUser);
  return (
    <div className="max-w-lg mx-auto w-full p-3 ">
        <h1 className="my-7 text-center font-semibold text-3xl">
            Profile
        </h1>
        <form className="flex flex-col gap-4">
            <div className="w-32 h-32 self-center cursor-pointer shadow-md rounded-full">
            <img src={currentUser.profilePicture} alt="User"
            className="rounded-full w-full h-full object-cover border-8" />
            </div>
            <TextInput type="text" id="username" placeholder="username" 
            defaultValue={currentUser.username}/>
             <TextInput type="text" id="email" placeholder="email" 
            defaultValue={currentUser.email}/>
             <TextInput type="password" id="password" placeholder="password" />
            
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>
              Update Password
            </Button>
        </form>
        <div className="text-red-500 justify-between mt-5">
          <span className="cursor-pointer">
            Delete Account
          </span>
          <span className="cursor-pointer">
            Sign Out
          </span>
        </div>
    </div>
  )
}
