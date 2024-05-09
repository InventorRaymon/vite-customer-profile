import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from '../../baseUrl';
import BackgroundImg from '../assets/backgroundImg.png';
import Logo from '../assets/img_logogo.png'
import ReactLoading from 'react-loading';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        username: "",
        userpass: "",
    });
    const [passwordType, setPasswordType] = useState('password');
    const [showHide, setShowHide] = useState("SHOW");
    const [errorHandler, setErrorHandler] = useState('hidden');
    const [loadingDone, setLoadingDone] = useState(undefined);
    const [submitClick, setSubmitClick] = useState(false);
    const [screenWidth, setScreenWidth] = useState(false);
    const { username, userpass } = inputValue;
    let width, height;

    const handleOnChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };

    const handleShowPass = () => {
        if (passwordType === 'password') {
            setShowHide("HIDE");
            setPasswordType('text')
        } else {
            setShowHide("SHOW")
            setPasswordType('password')
        }
    }

    useEffect(() => {

        window.onresize = window.onload = function () {
            width = this.innerWidth;
            height = this.innerHeight;
            setScreenWidth(width);
        }
    }, [width])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitClick(true);
        setErrorHandler('hidden');
        try {
            const { data } = await axios.post(
                `${base_url}/api/mobileapi/Postlogin`,
                {
                    ...inputValue,
                },
                { withCredentials: true },
            );

            const { ReturnMsg, UserInfo } = data;
            console.log(data)
            if (ReturnMsg === "Success") {
                localStorage.setItem("token", UserInfo.UserPass);
                localStorage.setItem("userType", UserInfo.UserType);
                setTimeout(() => {
                    setLoadingDone(true);
                    navigate("/landing",
                        {
                            state: {
                                UserInfo
                            }
                        }
                    );
                }, 2000);
            } else if (ReturnMsg === "Invalid Username or Password") {
                setSubmitClick(false);
                setErrorHandler('block');
            }
        } catch (error) {
            console.log(error);
        }
        setInputValue({
            ...inputValue,
            username: "",
            userpass: "",
        });
    };

    return (
        <section id="content" >
            <img src={BackgroundImg} alt="" className='max-sm:object-none columns-12 z-0 absolute h-full w-full' />
            <div className="z-10 relative min-h-screen flex flex-col items-center justify-center">
                <img src={Logo} alt="" className='h-[35px] relative right-[80px] bottom-[10px]' />
                <div className="w-[320px] max-w-md">
                    <div className="bg-white shadow-xl rounded-lg">
                        <div className="px-4 py-8">
                            <div className="text-center">
                                <h1 className="text-lg font-bold">Account Login</h1>
                                <p className='text-sm'>Sign In to your account</p>
                            </div>


                            <div className="flex justify-center">
                                <form onSubmit={handleSubmit} className="max-w-[280px] mx-auto">
                                    <div className={`${errorHandler === 'hidden'? 'border-neutral-500':'border-red-500'} rounded-md flex gap-3 px-2 py-2 mt-12 max-w-full text-base leading-7 whitespace-nowrap bg-white border border-solid text-neutral-700 w-[300px] max-md:mt-10 shadow-lg`}>
                                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/978da9f7d3913ce0456832f58efe5674d1114328f451a4700571e5971dd0038c?apiKey=966c510a434d496c8209492887da4d0c&" alt="username icon" className="shrink-0 w-6 aspect-square" />
                                        <label htmlFor="username" className="sr-only">username</label>
                                        <input autoComplete='off' className="text-sm flex-auto my-auto bg-transparent border-none focus:outline-none" type="username" id="username" name="username" value={username} required onChange={handleOnChange} placeholder="username" />
                                    </div>
                                    <p className={errorHandler + ' text-xs flex flex-row-reverse text-red-400'}>Incorrect username or password</p>
                                        <div className={`${errorHandler === 'hidden'? 'border-neutral-500':'border-red-500'} rounded-md flex justify-between px-2 py-2 mt-5 max-w-full whitespace-nowrap bg-white border border-solid w-[300px] shadow-lg`}>
                                            <div className="flex gap-3 text-base leading-7 text-neutral-700">
                                                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/9686404333324d9d51b219ae370cc2836d4b29ecd3df9f89d290521db2946d53?apiKey=966c510a434d496c8209492887da4d0c&" alt="userpass icon" className="shrink-0 w-6 aspect-square" />
                                                <label htmlFor="userpass" className="sr-only">userpass</label>
                                                <input className="text-sm flex-auto my-auto bg-transparent border-none focus:outline-none" type={passwordType} id="userpass" name="userpass" placeholder="*********" value={userpass} required onChange={handleOnChange} />
                                            </div>
                                            <motion.div whileTap={{ scale: 0.5 }} whileHover={{ scale: 1.2 }} className="my-auto text-xs leading-6 text-right text-neutral-400">
                                                <a className="font-bold text-neutral-800">
                                                    <label className="cursor-pointer" onClick={handleShowPass} htmlFor="check">{showHide}</label>
                                                </a>
                                            </motion.div>
                                        </div>
                                        <p className={errorHandler + ' mb-2 text-xs flex flex-row-reverse text-red-400'}>Incorrect username or password</p>
                                    <motion.button type="submit"  whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.05 }} className="rounded-md flex px-2 py-2 mt-8 max-w-full text-base text-white bg-slate-800 w-[300px]">
                                        <span className="flex-auto my-auto ml-8">Sign In</span>
                                        {
                                            !loadingDone ? submitClick ? <ReactLoading type="spin" color="#94a3b8" height={30} width={30} />
                                                :
                                                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e9f0ba8961bab4a6601d301bf79dfca9b8ed0f7647684e6050b380c7df8b9e03?apiKey=966c510a434d496c8209492887da4d0c&" alt="SignIn icon" className="shrink-0 w-8 aspect-square" />
                                                :
                                                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e9f0ba8961bab4a6601d301bf79dfca9b8ed0f7647684e6050b380c7df8b9e03?apiKey=966c510a434d496c8209492887da4d0c&" alt="SignIn icon" className="shrink-0 w-8 aspect-square" />
                                        }
                                    </motion.button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


    )
}

export default LoginPage