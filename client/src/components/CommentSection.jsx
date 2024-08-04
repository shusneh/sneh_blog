import { useState } from "react"
import {useSelector} from 'react-redux'
import { Link } from "react-router-dom"
import { Button, Textarea, Alert } from "flowbite-react";
export default function CommentSection({postId}) {
    const {currentUser}  = useSelector(state=>state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] =useState('');
    const [commentSuccess, setCommentSuccess] =useState('');

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
    </div>
  )
}
