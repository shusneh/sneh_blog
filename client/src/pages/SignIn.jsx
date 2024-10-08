import { Alert, Button, Label, Spinner, TextInput, Modal } from 'flowbite-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function SignIn() {
  
  const [showModal, setShowModal] = useState(false);
  const [guestId, setGuestId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const {isLoading, error: errorMessage} =useSelector(state=>state.user);
  const [guestErrorMessage, setGuestErrorMessage] = useState("")
  const handleChange = (e)=>{

    setFormData({...formData, [e.target.id]: e.target.value.trim()}); 
    //console.log(formData); 
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!formData.email||!formData.password){
      return dispatch(signInFailure('Please fill all fields'));
    }
    
    try { 
      dispatch(signInStart());
      
      const res = await fetch('/api/auth/signin',{
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(formData) 
      });
      const data = await res.json();
      console.log(data);
      if(data.success==="false"){
        dispatch(signInFailure(data.message));     
      }
      if(data.success!=="false"){
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    } 
  }

  const handleClick = async()=>{
    if(guestId.toLowerCase()!=="btech1051421"){
      setShowModal(false);
      setGuestErrorMessage('Wrong Id');
      setTimeout(() => {
        setGuestErrorMessage("");
      }, 2000);
      return;
    }
    setFormData({"email":'shubhanshusneh@gmail.com',"password":"Sriram@12"});
    if(!formData.email||!formData.password){
      return dispatch(signInFailure('Please fill all fields'));
    }
    
    try { 
      dispatch(signInStart());
      
      const res = await fetch('/api/auth/signin',{
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(formData) 
      });
      const data = await res.json();
      console.log(data);
      if(data.success==="false"){
        dispatch(signInFailure(data.message));     
      }
      if(data.success!=="false"){
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    } 
    
  }
  return (
    <div className='min-h-screen mt-20 '>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row gap-5'>
        {/* left */}
        <div className='flex-1'>
        <Link
        to='/'
        className=' font-bold dark:text-white text-4xl'
        >
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500  via-violet-700  to-pink-500 rounded-lg text-white'>
          Sneh's
        </span>
        Blog
        <p className='text-sm mt-2 font-thin'>SignUp here to become a member of the blog</p>
      </Link>
        </div>

        {/* Right */}

        <div className='flex-1'>
          <form className=' flex flex-col gap-4' onSubmit={handleSubmit}>
           
            <div className=''>
              <Label value='Your email'/>
              <TextInput type='email' placeholder='Email' id='email' onChange={handleChange}/> 
            </div>
            <div className=''>
              <Label value='Your password'/>
              <TextInput type='password' placeholder='Password' id='password' onChange={handleChange}/>         

          
            </div>
            <Button gradientDuoTone={'purpleToPink'} type='submit' disabled={isLoading}>
              {
                isLoading? (
                  <>
                    <Spinner size='sm'/ >
                      <span className='pl-3'>Loading...</span>
                    
                  </>
                ):'SignIn'
              }
            </Button> 
            <OAuth/>
            <Button outline gradientDuoTone={'greenToBlue'} onClick={()=>setShowModal(true)}  disabled={isLoading}>
              {
                isLoading? (
                  <>
                    <Spinner size='sm'/ >
                      <span className='pl-3'>Loading...</span>
                    
                  </>
                ):'Enter as a guest'
              }
            </Button> 
          </form>
          <div className=' flex gap-2 mt-5' >
            <span>Don't have an account?</span>
            <Link to={'/sign-up'} className='text-blue-500'>
            Sign Up
            </Link> 
          </div>
          {
          (!setShowModal)&& errorMessage&&(
            <Alert className='mt-5 ' color='failure'>
              {errorMessage}
            </Alert>
          )
        }
         
        {
          guestErrorMessage&&(
            <Alert className='mt-5 ' color='failure'>
              {guestErrorMessage}
            </Alert>
          )
        }
        </div>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center justify-around' >
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Please enter your guestID !
            </h3>
            <TextInput className='p-2' 
            onChange={(e)=>{setGuestId(e.target.value);   }}/>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleClick}>
                Go
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
} 
