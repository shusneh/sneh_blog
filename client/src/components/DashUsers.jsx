import { Button, Table, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {FaCheck, FaTimes} from  'react-icons/fa'

import { HiOutlineExclamationCircle } from 'react-icons/hi';



export default function DashUsers() {
    const { currentUser } = useSelector((store) => store.user);
    const [user, setUser] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    useEffect(()=>{
        const fetchPost = async()=>{
            try {
                const res= await fetch(`/api/user/getusers`);
                const data = await res.json();
                if(res.ok){
                    setUser(data.users)
                    if(data.users.length < 9){
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        if(currentUser.isAdmin){
            fetchPost();
        }
        
    },[currentUser._id])

    const handleShowMore = async()=>{
        const startIndex= user.length;
        try {
            const res = await fetch(`/api/user/getusers&startIndex=${startIndex}`);
            const data = await res.json();

            if(res.ok){
                setUser((prev)=>[...prev,...data.users]);
                if(data.users.length<9){
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleDeleteUser = async () => {
      setShowModal(false);
     
    };
  
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && user.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Admin</span>
              </Table.HeadCell>        
            </Table.Head>
            {user.map((user) => (
              <Table.Body className='divide-y' key={user._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                   
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className='w-20 h-10 object-cover bg-gray-500'
                      />
                    
                  </Table.Cell>
                      <Table.Cell>
                    {user.username}
                  </Table.Cell>
                  <Table.Cell>
                    {user.email}
                  </Table.Cell>
                 
                  <Table.Cell>
                    {user.isAdmin?(<FaCheck className='text-green-300'/>):(<FaTimes className='text-pink-600'/>)}
                  </Table.Cell>
                  <Table.Cell>
                    <span onClick={()=>{setShowModal(true);setUserIdToDelete(user._id);}} className='font-medium text-red-500 hover:underline cursor-pointer'>
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
              showMore &&  (
              <Button className='text-teal-500 w-full self-centre text-sm py-3 mt-5'
              onClick={handleShowMore}
              >
              Show more
              </Button>)
  
          }
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
       <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
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
