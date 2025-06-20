import Layout from '@/components/Layout'
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router';
import { UserContext } from '@/context';
import { resolve } from 'styled-jsx/css';
import { FaCameraRetro, FaS } from "react-icons/fa6";

const update = () => {
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);
    const [name, setName] = useState('');
    const [username, setUserName] = useState('');
    const [about, setAbout] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [state, setState] = useContext(UserContext);
    const router = useRouter();

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

    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { data } = await axios.put(`/profile-update`, {
                name,
                username,
                image,
                about,
                email,
                password,
                answer
            });
            setLoading(false);
            toast.success("Profile Updated Successfully");
            // await new Promise(resolve => setTimeout(resolve, 1500));
            // router.push("/login");
        } catch (error) {
            toast.error(error?.response?.data?.error || "Update Failed.");
        }
    };

    useEffect(() => {
        if (state?.user) {
            setUserName(state.user.username || '');
            setAbout(state.user.about || '');
            setEmail(state.user.email || '');
            setName(state.user.name || '');
            setAnswer(state.user.answer || '');
            setImage(state.user.image || '');
        }
    }, [state]);

    return (
        <Layout>
            <div className='row d-flex align-items-center justify-content-center mb-4'>
                <div className='col-md-8'>
                    <h1 className='p-3 text-center'>Profile Details</h1>
                    <form onSubmit={handleSubmit}>
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

                        <div className=''>
                            <label htmlFor='image' className='ms-4 mt-2'>
                                {
                                    image && image.url ?
                                        (<img src={image.url} height={250} width={250} className='m-2' />)
                                        : uploading ?
                                            (
                                                <>
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </>
                                            ) : (<FaCameraRetro size={30} style={{ cursor: "pointer" }} />)
                                }
                                <input type='file'
                                    accept='images/*'
                                    onChange={handleImage}
                                    name='image' id='image' hidden />
                            </label>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
                            <input type="text" value={username} onChange={(e) => setUserName(e.target.value)} className="form-control" id="exampleInputName1" aria-describedby="emailHelp" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">About</label>
                            <input placeholder="Enter your bio" type="text" value={about} onChange={(e) => setAbout(e.target.value)} className="form-control" id="exampleInputName1" aria-describedby="emailHelp" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="exampleInputName1" aria-describedby="emailHelp" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input disabled type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" />
                        </div>

                        <select className="form-select" defaultValue={"DEFAULT"} aria-label="Default select example">
                            <option value="DEFAULT">Security Question</option>
                            <option value={1}>Enter your best friend name?</option>
                            <option value={2}>Enter your favourite food?</option>
                            <option value={3}>Enter your favourite sports?</option>
                        </select>

                        <div className="mb-3">
                            <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Answer Here" className="form-control" id="exampleInputName1" aria-describedby="emailHelp" />
                        </div>

                        <div className='d-flex flex-row'>
                            <button type="submit" className="btn btn-primary btn-lg">
                                {loading ? (
                                    <>
                                        <span>loading &nbsp;</span>
                                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                    </>
                                ) : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default update;