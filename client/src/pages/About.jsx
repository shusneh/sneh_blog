import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className='flex-row text-center min-h-screen min-w-full text-slate-400'>
      <div className='min-h-svh  text-wrap items-center text-center '>
      <h1 className='text-xl '>
      Hi There!
      </h1>
      <p>
        Myself Shubhanshu Sneh. Welcome to my blog page. This project is done solely by me.
        I am creating this website as my web-development project. 
      </p>
      </div>
     
      <hr />

     
      <p>
        Please share your valuable suggestions at 
        <Link to={'mailto:shubhanshusneh@gmail.com'} className='text-blue-400'>

        <p>shubhanshusneh@gmail.com</p>

</Link>
       
      </p>

    </div>
  )
}
