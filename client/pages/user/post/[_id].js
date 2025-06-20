import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import axios from 'axios';
import { UserContext } from '@/context'
import UserRoute from '@/components/routes/UserRoute'
import CreatePost from '@/components/Post/CreatePost'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const PostEdit = () => {
    const [post, setPost] = useState({});
    const router = useRouter();
    const {_id} = router.query;
    const [content, setContent] = useState("");
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);
    const [state] = useContext(UserContext);
    

    //UseState for Post data
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const {data} = await axios.get(`/user-post/${_id}`)
                setContent(data.content);
                setImage(data.image)
                setPost(data);     
            } catch (error) {
                console.log(error);      
            }
        }
        if(_id) {
            fetchPost();
        }    
    }, [])

    // handle Image Upload
  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData()
    formData.append("image", file);
    console.log([...formData]);
    setUploading(true);
    try {
      const { data } = await axios.post("/upload-image", formData)
      // console.log(data);
      setUploading(false);
      setImage({
        url: data.url,
        public_id: data.public_id
      })
    } catch (error) {
      console.log(error);
    }
  }

   // Post Handler
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    // console.log("update data", content, image);
    try {
        const {data} = await axios.put(`/update-post/${_id}`, {content, image})
        if (data.error) {
            toast.error(data.error);
        } else {
            toast.success("Updated Successfully");
            setTimeout(() => {
                router.push("/user/dashboard");
            }, 1500); 
        }
    } catch (error) {
        console.log(error); 
    }
  };


  return (
    <Layout>
      <UserRoute>
        <div className='row'>
          <div className='col-md-10'>
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <CreatePost
              content={content}
              setContent={setContent}
              handlePostSubmit={handlePostSubmit}
              handleImage={handleImage}
              uploading={uploading}
              image={image} />
          </div>
        </div>
      </UserRoute>
    </Layout>
  )
}

export default PostEdit;