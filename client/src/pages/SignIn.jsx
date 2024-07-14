import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'


export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const handleChange = (e)=>{

    setFormData({...formData, [e.target.id]: e.target.value.trim()}); 
    //console.log(formData); 
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setErrorMessage(null);
    if(!formData.email||!formData.password){
      return setErrorMessage('Please fill all fields');
    }
    
    try { 
      setLoading(true);
      const res = await fetch('/api/auth/signin',{
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(formData) 
      });
      const data = await res.json();
      console.log(data);
      if(data.success==="false"){
        setErrorMessage(data.message);      
      }
      setLoading(false);
      if(data.success!=="false"){
        navigate('/');
      }
    } catch (error) {
      setErrorMessage(error);
      setLoading(false);
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
        <p className='text-sm p-1 font-thin'>SignUp here to become a member of the blog</p>
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
                ):'SignUp'
              }
            </Button> 
          </form>
          <div className=' flex gap-2 mt-5' >
            <span>Don't an account?</span>
            <Link to={'/sign-up'} className='text-blue-500'>
            Sign Up
            </Link> 
          </div>
          {
          errorMessage&&(
            <Alert className='mt-5 ' color='failure'>
              {errorMessage}
            </Alert>
          )
          }
        </div>
      </div>
    </div>
  )
} 
