import { Alert, Button, FileInput, Select, TextInput, Modal, Textarea } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function CreatePost() {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [question, setQuestion] = useState(null);
  const [aiAns, setAiAns] = useState(null);
  const [loading, setLoading] = useState(false);
  const [publishSucces, setPublishSuccess] = useState(null);

  const navigate = useNavigate();

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) { 
        setPublishError(null);
        // console.log(data);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  const handleClick = async()=>{
    console.log(question);
    if(question===null){
      setShowModal(false);
      setTimeout(()=>{ setPublishError('Please enter a topic');},20);
      setTimeout(()=>{ setPublishError(null);},2000);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/post/useAi/${question}`)
      const data = await res.json();

      if (!res.ok) {
        setShowModal(false);
        setLoading(false);
        return;
      }
      if (res.ok) {
        setLoading(false);
        setShowModal(false);
        setAiAns(data);
        setFormData({ ...formData, content: data });
      }
      
    } catch (error) {
      setPublishError('Something went wrong');
    }
  }
  const copyToClip= function() {
    var copyText = document.getElementById("copy");
    copyText.select();
    copyText.setSelectionRange(0, 99999999); 
    navigator.clipboard.writeText(copyText.value);
    setPublishSuccess("Copied");
    setTimeout(()=>(setPublishSuccess(null)),1000);
  }
  console.log(aiAns);        
  return (    
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select> 
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <Textarea
        className='text-lg'
        id='copy'
        value={aiAns}
        placeholder='Ai-generated output will be reflected here !'
        />
        <Button
        onClick={()=>{copyToClip()}}
        >
          Copy
        </Button>
        {publishSucces && <Alert color='success'>{publishSucces}</Alert>}
        <ReactQuill
          theme='snow'
          placeholder="IF YOU ARE TAKING HELP THEN SIMPLY PUBLISH IT AFTER ASKING QUESTION. AND YOU CAN EDIT IT LATER ON"
          className='h-72 mb-12 text-slate-300 decoration-fuchsia-300'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>
        <Button onClick={()=>(setShowModal(true))} 
        disabled={loading}
        gradientDuoTone='purpleToPink'>
          {
            loading===true?("Wait..."):("Need help in writing?")
          }
          
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
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
              Please enter the topic you want me to write!
            </h3>
            <TextInput className='p-2' 
            onChange={(e)=>{setQuestion(e.target.value);}}/>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={()=>{handleClick()}} disabled={loading}>
              {
            loading===true?("Writing..."):("Go")
              }
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}