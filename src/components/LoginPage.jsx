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

    function Header() {
        return (
            <header className="flex gap-5 self-stretch w-full text-sm text-center max-md:flex-wrap max-md:max-w-full">
                <div className="flex-auto self-start mt-3 underline text-neutral-800">
                    <span className="text-neutral-700">Not a member yet?</span>
                    <a href="/signup" className="font-bold underline text-neutral-800">
                        {" "}
                        JOIN NOW
                    </a>
                </div>
            </header>
        );
    }

    function Footer() {
        return (
            <footer className="flex gap-5 self-stretch mt-56 w-full text-sm leading-6 max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
                <div className="flex-auto tracking-tight text-neutral-400">
                    Copyright 2024 Cosmotech Inc. All rights Reserved
                </div>
                <div className="flex gap-2.5 text-neutral-700">
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/1606a9b395bcfb2c9ab560494928bb93fc3031a591f7034d0c130aaf79a5f671?apiKey=966c510a434d496c8209492887da4d0c&" alt="Help icon" className="shrink-0 aspect-square w-[18px]" />
                    <div>Need help?</div>
                </div>
            </footer>
        );
    }

    // const myStyle = {
    //     backgroundImage: `url(${BackgroundImg})`,
    //     // height: "100vh",
    //     // backgroundSize: "cover",
    //     // backgroundRepeat: "no-repeat",
    // };
    return (
        // <div className="font-sans text-[#333] bg-gray-50 p-4">
        //     <div className="max-w-full mx-auto">
        //         <div className="flex md:flex-row md:space-x-5">
        //             <div className="md:w-1/2">
        //                 <div className="px-px w-full text-center">
        //                     <div className="flex overflow-hidden relative flex-col w-full max-md:px-5 max-md:max-w-full bg-gradient-to-r from-slate-900 via-slate-500 via-50% to-slate-900 to 90% h-[300px] sm:h-[4vh] md:h-[580px] lg:h-[570px] xl:h-[560px]">
        //                         <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d95a1b51139ebb63c90dd07fe1c74cb68c608f487830ce20a96be3c54ebc6034?apiKey=966c510a434d496c8209492887da4d0c&" alt="Partnership for Business Growth logo" className="self-center mt-14 max-w-full aspect-[4.35] w-[232px] max-md:mt-10" />
        //                         <div className="flex-auto my-auto">
        //                             <span className="font-bold text-3xl text-white max-md:mt-10">COSMOHUB</span>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div className="md:w-1/2">
        //                 <main className="flex flex-col items-center justify-center mt-10">
        //                     {/* <Header /> */}
        //                     <h2 className=" text-2xl font-black leading-10 text-center text-neutral-800">
        //                         WELCOME BACK EXCLUSIVE MEMBER
        //                     </h2>
        //                     <p className="mt-8 text-base leading-7 text-center uppercase text-neutral-700">
        //                         LOG IN TO CONTINUE
        //                     </p>

        //                     <form onSubmit={handleSubmit} className="max-w-[420px] mx-auto">
        //                         <div className={`${errorHandler} mt-2 bg-red-100 text-red-800 w-[380px] p-4 rounded-md relative`} role="alert">
        //                             <strong className="font-bold text-base">Invalid Login!</strong>
        //                             <span className="block text-sm sm:inline max-sm:mt-1 max-sm:ml-0 mx-4">Incorrect username or password.</span>
        //                         </div>
        //                         <div className="flex gap-3 px-5 py-6 mt-12 max-w-full text-base leading-7 whitespace-nowrap bg-white border border-solid border-neutral-500 text-neutral-700 w-[380px] max-md:mt-10">
        //                             <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/978da9f7d3913ce0456832f58efe5674d1114328f451a4700571e5971dd0038c?apiKey=966c510a434d496c8209492887da4d0c&" alt="username icon" className="shrink-0 w-6 aspect-square" />
        //                             <label for="username" className="sr-only">username</label>
        //                             <input className="flex-auto my-auto bg-transparent border-none focus:outline-none" type="username" id="username" name="username" value={username} required onChange={handleOnChange} placeholder="username" />
        //                         </div>
        //                         <div className="border-color red">
        //                             <div className="flex gap-5 justify-between px-5 py-6 mt-5 max-w-full whitespace-nowrap bg-white border border-solid border-neutral-500 w-[380px]">
        //                                 <div className="flex gap-3 text-base leading-7 text-neutral-700">
        //                                     <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/9686404333324d9d51b219ae370cc2836d4b29ecd3df9f89d290521db2946d53?apiKey=966c510a434d496c8209492887da4d0c&" alt="userpass icon" className="shrink-0 w-6 aspect-square" />
        //                                     <label for="userpass" className="sr-only">userpass</label>
        //                                     <input className="flex-auto my-auto bg-transparent border-none focus:outline-none" type={passwordType} id="userpass" name="userpass" placeholder="*********" value={userpass} required onChange={handleOnChange} />
        //                                 </div>
        //                                 <div className="my-auto text-xs leading-6 text-right text-neutral-400">
        //                                     <a className="font-bold text-neutral-800">
        //                                         <label className="cursor-pointer" onClick={handleShowPass} for="check">{showHide}</label>
        //                                     </a>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <button type="submit" className="flex gap-5 px-9 py-5 mt-5 max-w-full text-base leading-7 text-white bg-slate-800 w-[380px] max-md:px-5">
        //                             <span className="flex-auto my-auto">Proceed to my Account</span>
        //                             <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e9f0ba8961bab4a6601d301bf79dfca9b8ed0f7647684e6050b380c7df8b9e03?apiKey=966c510a434d496c8209492887da4d0c&" alt="Proceed icon" className="shrink-0 w-8 aspect-square" />
        //                         </button>
        //                     </form>
        //                     {/* <div className="mt-12 text-sm leading-6 text-right text-black cursor-pointer">
        //                 Having Issues with your Account?
        //             </div> */}
        //                 </main>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <section id="content" >
            <img src={BackgroundImg} alt="" className='columns-12 shrink-0 z-0 absolute h-full w-full' />
            {/* <img src={BackgroundImg1} alt="" className='blur-[2px] z-0 absolute h-full w-full max-sm:object-scale-down' /> */}

            <div className="z-10 relative min-h-screen flex flex-col items-center justify-center">

                {/* <div className="ml-24 min-h-screen relative flex flex-col items-start justify-center"> */}

                {/* <img src={Logo} alt="" className='h-[35px] relative'/> */}
                <img src={Logo} alt="" className='h-[35px] relative right-[80px] bottom-[10px]' />
                <div className="w-[320px] max-w-md">
                    <div className="bg-white shadow-xl rounded-lg">
                        <div className="px-4 py-8">
                            <div className="text-center">
                                <h1 className="text-lg font-bold">Account Login</h1>
                                <p className='text-sm'>Sign In to your account</p>
                            </div>

                            {/* <form className="mt-4" action="index.html">

                                <div className="mb-4">
                                    <input type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-slate-500" placeholder="Username" autofocus />
                                </div>
                                <div className="border-color red">
                                     <div className="flex gap-5 justify-between px-6 py-2 mt-5 max-w-full whitespace-nowrap bg-white border border-solid border-neutral-500 w-[420px]">
                                         <div className="flex gap-3 text-base leading-7 text-neutral-700">
                                            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/9686404333324d9d51b219ae370cc2836d4b29ecd3df9f89d290521db2946d53?apiKey=966c510a434d496c8209492887da4d0c&" alt="userpass icon" className="shrink-0 w-6 aspect-square" />
                                             <label for="userpass" className="sr-only">userpass</label>
                                             <input className="flex-auto my-auto bg-transparent border-none focus:outline-none" type={passwordType} id="userpass" name="userpass" placeholder="*********" value={userpass} required onChange={handleOnChange} />
                                         </div>
                                         <div className="my-auto text-xs leading-6 text-right text-neutral-400">
                                            <a className="font-bold text-neutral-800">
                                                 <label className="cursor-pointer" onClick={handleShowPass} for="check">{showHide}</label>
                                            </a>
                                        </div>
                                     </div>
                                </div>

                                <div className="mb-4">
                                    <input type="password" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-slate-500" placeholder="Password" />
                                </div>

                                <div className="flex items-center mb-4">
                                    <input id="_dm-loginCheck" className="form-checkbox rounded" type="checkbox" />
                                    <label for="_dm-loginCheck" className="ml-2">Remember me</label>
                                </div>

                                <div className="mt-5">
                                    <button className="w-full px-4 py-2 bg-slate-500 text-white font-semibold rounded-md hover:bg-blue-600" type="submit">Sign In</button>
                                </div>
                            </form> */}

                            <div className="flex justify-center">
                                <form onSubmit={handleSubmit} className="max-w-[280px] mx-auto">
                                    <div className={`${errorHandler === 'hidden'? 'border-neutral-500':'border-red-500'} rounded-md flex gap-3 px-2 py-2 mt-12 max-w-full text-base leading-7 whitespace-nowrap bg-white border border-solid text-neutral-700 w-[300px] max-md:mt-10 shadow-lg`}>
                                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/978da9f7d3913ce0456832f58efe5674d1114328f451a4700571e5971dd0038c?apiKey=966c510a434d496c8209492887da4d0c&" alt="username icon" className="shrink-0 w-6 aspect-square" />
                                        <label for="username" className="sr-only">username</label>
                                        <input autoComplete='off' className="text-sm flex-auto my-auto bg-transparent border-none focus:outline-none" type="username" id="username" name="username" value={username} required onChange={handleOnChange} placeholder="username" />
                                    </div>
                                    <p className={errorHandler + ' text-xs flex flex-row-reverse text-red-400'}>Incorrect username or password</p>
                                        <div className={`${errorHandler === 'hidden'? 'border-neutral-500':'border-red-500'} rounded-md flex justify-between px-2 py-2 mt-5 max-w-full whitespace-nowrap bg-white border border-solid w-[300px] shadow-lg`}>
                                            <div className="flex gap-3 text-base leading-7 text-neutral-700">
                                                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/9686404333324d9d51b219ae370cc2836d4b29ecd3df9f89d290521db2946d53?apiKey=966c510a434d496c8209492887da4d0c&" alt="userpass icon" className="shrink-0 w-6 aspect-square" />
                                                <label for="userpass" className="sr-only">userpass</label>
                                                <input className="text-sm flex-auto my-auto bg-transparent border-none focus:outline-none" type={passwordType} id="userpass" name="userpass" placeholder="*********" value={userpass} required onChange={handleOnChange} />
                                            </div>
                                            <motion.div whileTap={{ scale: 0.5 }} whileHover={{ scale: 1.2 }} className="my-auto text-xs leading-6 text-right text-neutral-400">
                                                <a className="font-bold text-neutral-800">
                                                    <label className="cursor-pointer" onClick={handleShowPass} for="check">{showHide}</label>
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


                            {/* <div className="flex justify-between mt-4">
                                <a href="../../front-pages/password-reminder/" className="text-slate-500 hover:underline">Forgot password ?</a>
                                <a href="../../front-pages/register/" className="text-slate-500 hover:underline">Create a new account</a>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-300 pt-3 mt-3">
                                <h5>Login with</h5>

                                <div className="flex ms-3">
                                    <a href="#" className="btn btn-primary btn-icon btn-hover text-inherit">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="#" className="btn btn-info btn-icon btn-hover text-inherit">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="#" className="btn btn-danger btn-icon btn-hover text-inherit">
                                        <i className="fab fa-google-plus-g"></i>
                                    </a>
                                    <a href="#" className="btn btn-warning btn-icon btn-hover text-inherit">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>


    )
}

export default LoginPage