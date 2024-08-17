import { useEffect, useState } from "react"
import {useSelector} from 'react-redux'
import { Link } from "react-router-dom"
import { Button, Textarea, Alert } from "flowbite-react";
import Comments from "./Comments";
export default function CommentSection({postId}) {
    const {currentUser}  = useSelector(state=>state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] =useState('');
    const [commentSuccess, setCommentSuccess] =useState('');
    const [comments, setComments] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {
          return;
        }
        try {
          const res = await fetch('/api/comment/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: comment,
              postId,
              userId: currentUser._id,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            setComment('');
            setTimeout(()=>{setCommentSuccess('Comment Posted')},10)
            setTimeout(()=>{setCommentSuccess(null)},1500)
            setCommentError(null);
          }
        } catch (error) {
          setCommentError(error.message);
        }
      };

      useEffect(()=>{
        const getPosts=async()=>{
            const res =await fetch(`/api/comment/getPostComments/${postId}`);
            const data = await res.json();
            setComments(data);
        }

        getPosts();
      },[postId])

      console.log(comments);
      
      const handleLike = async (commentId)=>{
        try {
          if(!currentUser) {
            setErrorMessage('Please login to like comment');
            return;
          }
          const res = await fetch(`/api/comment/likeComment/${commentId}`, {
            method: 'PUT',
          });
          if (res.ok) {
            const data = await res.json();
            setComments(
              comments.map((comment) =>
                comment._id === commentId
                  ? {
                      ...comment,
                      likes: data.likes,
                      numberOfLikes: data.likes.length,
                    }
                  : comment
              )
            );
          }

        } catch (error) {
          console.log(error.message);
          
        }
      }

  return (
    <div>
        {currentUser?
        (
            
            <div className="flex items-center gap-2">
                <p>
                    Signed in as : 
                </p>
                <img src={currentUser.profilePicture} className="w-5 h-5 rounded-full" alt=""/>
                <Link to={'/dashboard?tab=profile'} className="hover:underline text-xs text-teal-500">

                @{currentUser.username}
                </Link>

            </div>
        )
        :(
            <div>
                You must {" "}  
            <Link to={'/sign-in'} className="text-blue-500">
               signin  
            </Link>
            {" "}to comment
            </div>
        )    
    }
    {
        currentUser && (
            <form className="border border-teal-500 p-3 rounded-lg" onSubmit={handleSubmit}>
                <Textarea
                placeholder="Add a comment..."
                rows={3}
                maxLength={'200'}
                onChange={(e)=>setComment(e.target.value)}
                value={comment}
                />

                <div className="">
                    <p>Character remaining {200-comment.length}</p>
                    <Button gradientDuoTone={"purpleToBlue"} type="submit" className="">
                        Submit
                    </Button>
                </div>
                {commentError && (
            <Alert color='failure' className='mt-5'>
              {commentError}
            </Alert>
            
          )}
          {commentSuccess && (
            <Alert color='success' className='mt-5'>
              {commentSuccess}
            </Alert>
            
          )}
            </form>
        )
    }
    {
      comments.length===0?(
        <p>No comments yet</p>
      ):(
        <>
        
        <div className="flex gap-2 mt-5  items-center  ">
          <p >comments</p>
          <p className=" border border-gray-500  py-1 px-2">{comments.length}</p>
        </div>
        {
          comments.map((comment)=>(
           <Comments key={comment._id}
           comment={comment}
           onLike={handleLike}
           />
           ) )
        }
        </>
      )
    }
    </div>
  )
}
