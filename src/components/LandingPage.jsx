import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from '../../baseUrl';
import Swal from 'sweetalert2';
import ReactLoading from 'react-loading';
import Logo from '../assets/img_logogo.png';
import { motion } from 'framer-motion';

const LandingPage = () => {

  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType")
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [initialData, setInitialData] = useState("");
  const [client, setClient] = useState('');
  const [foundClient, setFoundClient] = useState(clientData);
  const [userDropdown, setUserDropdown] = useState('hidden');
  const [isModalOpen, setIsModalOpen] = useState('hidden');
  const [isClientModalOpen, setIsClientModalOpen] = useState('hidden');

  const [addErrorHandler, setAddErrorHandler] = useState('hidden');
  const [changePassModal, setChangePassModal] = useState('hidden');
  const [passwordType, setPasswordType] = useState('password');
  const [showHide, setShowHide] = useState("SHOW");
  const [passwordTypeNew, setPasswordTypeNew] = useState('password');
  const [showHideNew, setShowHideNew] = useState("SHOW");
  const [changePassErrorHandler, setChangePassErrorHandler] = useState('hidden');
  const [loadingDone, setLoadingDone] = useState(undefined);

  const [inputValue, setInputValue] = useState({
    clientid: "",
    clientname: "",
    clientaddress: ""

  });
  const [changepassInput, setChangepassInput] = useState({
    newpassword: "",
    confirmpassword: ""
  })
  const { newpassword, confirmpassword } = changepassInput;

  const { clientid, clientname, clientaddress } = inputValue;


  const dummyArr = [
    {
      Value: "123",
      Text: "Raymon pogi",
      // clientaddress: "address ni raymon",
    },
    {
      Value: "123",
      Text: "Raymon pogi",
    },
    {
      Valu: "123",
      Text: "Raymon pogi",
    }
  ]

  const handleShowPass = (e) => {
    const passName = e.target.getAttribute("name");
    if (passName === "newpassword") {
      if (passwordTypeNew === 'password') {
        setShowHideNew("HIDE");
        setPasswordTypeNew('text')
      } else {
        setShowHideNew("SHOW")
        setPasswordTypeNew('password')
      }
    } else {
      if (passwordType === 'password') {
        setShowHide("HIDE");
        setPasswordType('text')
      } else {
        setShowHide("SHOW")
        setPasswordType('password')
      }
    }

  }

  const getClientList = async () => {
    try {
      const { data } = await axios.get(
        `${base_url}/api/mobileapi/GetAllClientDetails`,
        {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
      setClientData(data.ClientList);
      setLoadingDone(true)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!clientData) {
      setTimeout(() => {
        getClientList();
      }, 2000)
    }

    if (initialData == "" || initialData == undefined) {
      setFoundClient(clientData)
    }
    // console.log(clientData)
  }, [clientData]);

  const handleAddModalOpen = () => {
    setIsModalOpen('block');
  }

  const handleAddModalClose = () => {
    setIsModalOpen('hidden');
    setAddErrorHandler('hidden');
  }

  const handleUpdateClientClose = () => {
    setInputValue({
      ...inputValue,
      clientid: "",
      clientname: "",
      clientaddress: ""
    });
    setAddErrorHandler('hidden');
    setIsClientModalOpen('hidden');
    closeDropdown("");
  }

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${base_url}/api/mobileapi/PostClient`,
        {
          ...inputValue,
        },
        {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }
      );
      const { ReturnMsg } = data;
      if (ReturnMsg === "Success") {
        Swal.fire({
          title: "Client Added",
          text: "Successfuly added a new client!",
          confirmButtonColor: "#334155",
          color: "#334155",
        }).then(() => {
          setIsModalOpen('hidden');
        })
      } else {
        setAddErrorHandler('block');
        // Swal.fire({
        //   title: "Client Add Failed ",
        //   text: "Client name already exist!",
        //   confirmButtonColor: "#334155",
        //   color: "#334155",
        // }).then(() => {
        //   // setIsModalOpen('hidden');
        // })
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      clientid: "",
      clientname: "",
      clientaddress: ""
    });
  };

  const handleOnChange = (e) => {
    e.preventDefault();
    if (addErrorHandler === 'block') {
      setAddErrorHandler('hidden')
    }
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleOnChangePass = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setChangepassInput({
      ...changepassInput,
      [name]: value,
    });
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    const clientId = e.target.id;

    try {
      const { data } = await axios.get(
        `${base_url}/api/mobileapi/GetClientInfo/` + clientId,
        {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }
      );
      const { ReturnMsg, ClientProfile } = data;
      if (ReturnMsg === "Success") {
      setIsClientModalOpen('block');
      setInputValue({
        ...inputValue,
        clientid: ClientProfile.ClientId,
        clientname: ClientProfile.ClientName,
        clientaddress: ClientProfile.ClientAddress
      });
      // setInputValue({
      //   ...inputValue,
      //   clientid: dummyArrUpdate.ClientId,
      //   clientname: dummyArrUpdate.ClientName,
      //   clientaddress: dummyArrUpdate.ClientAddress
      // });
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleOpenClientInfo = async (e) => {

    const clientId = e.target.id;

    setTimeout(() => {
      navigate("/clientcontacts",
        {
          state: {
            clientId
          }
        }
      );
    }, 300);

  }

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${base_url}/api/mobileapi/ChangesPassword`,
        {
          ...changepassInput,
        },
        {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }
      );
      const { ReturnMsg } = data;

      if (ReturnMsg === "Success") {
        Swal.fire({
          title: "Password Updated",
          text: "Successfuly updated password!",
          confirmButtonColor: "#334155",
          color: "#334155",
        }).then(() => {
          setChangePassModal('hidden');
        })
      } else {
        setChangePassErrorHandler('block')
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    const tokenUpdate = localStorage.getItem("token");
    try {
      const { data } = await axios.post(
        `${base_url}/api/mobileapi/PostClient`,
        {
          ...inputValue
        },
        {
          headers: {
            'Authorization': 'Bearer ' + tokenUpdate
          }
        }
      );
      const { ReturnMsg } = data;
      console.log(data)
      if (ReturnMsg === "Success") {
        Swal.fire({
          title: "Client Updated",
          text: "Successfuly updated client!",
          confirmButtonColor: "#334155",
          color: "#334155",
        }).then(() => {
          setIsClientModalOpen('hidden');
          closeDropdown("");
        })

      } else {
        setAddErrorHandler("block")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogOut = () => {
    Swal.fire({
      title: "Confirm Log Out",
      text: "Are you sure you want to Log Out?",
      confirmButtonColor: "#334155",
      showCancelButton: true,
      color: "#334155",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
      }
    })
  }

  const handleUserDropdown = () => {
    if (userDropdown === 'hidden') {
      setUserDropdown('block');
    } else {
      setUserDropdown('hidden');
    }
  }

  const closeDropdown = ({ contactId }) => {
    const allElements = document.getElementsByName("kebabDropdown");
    for (let index in allElements) {
        const targetElement = allElements[index];
        
        if (targetElement.id !== undefined && targetElement.id !== null) {
            const elementHidden = "hidden flex-col z-50 bg-slate-200 p-2 w-[170px] sm:min-w-[10px] max-sm:min-w-[120px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]";
            if (contactId == targetElement.id) {
                targetElement.setAttribute('class', elementHidden);
            } else {
              targetElement.setAttribute('class', "hidden");
            }
        }
    }
}

  const handleSearchBar = (e) => {
    const searchInput = e.target.value;
    setInitialData(searchInput);
    if (searchInput !== '') {
      const results = clientData.filter((user) => {
        return user.ClientName.toLowerCase().startsWith(searchInput.toLowerCase());
      });
      setFoundClient(results);
    } else {
      setFoundClient(clientData);
    }

    setClient(searchInput);
  }

  const handleOpenKebab = (e) => {
    const contactId = e.target.getAttribute('data-key');
    const allElements = document.getElementsByName("kebabDropdown");
    for(let index in allElements) {
      const targetElement = allElements[index];
      if (targetElement.id !== undefined && targetElement.id !== null) {
        if (contactId == targetElement.id) {
          const elementInfo = "flex flex-col p-4 z-50 bg-slate-100 p-2 w-[100px] sm:min-w-[100px] max-sm:min-w-[100px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]";
          const elementHidden = "hidden flex-col z-50 bg-slate-100 p-2 w-[100px] sm:min-w-[100px] max-sm:min-w-[100px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]";
          const variantClose = {
            opacity: 0, x: "100%"
          }
          const variantOpen = {
            opacity: 1, x: 0
          }
          if (elementInfo === targetElement.className) {
            targetElement.setAttribute('class', elementHidden);
            targetElement.setAttribute('variants', variantClose);
          } else {
            targetElement.setAttribute('class', elementInfo);
            targetElement.setAttribute('variants', variantOpen);
          }
        }
      }
    }
  }

  return (
    <>
      <div className="font-[sans-serif] text-[#333] bg-gradient-to-r from-slate-200 via-slate-100 via-50% to-slate-200 to-90% p-4 h-max">
        <div className="">
          <header className='shadow-md font-[sans-serif] tracking-wide relative z-50'>
            <section className='md:flex lg:items-center relative py-3 lg:px-10 px-4 border-slate-200 border-b bg-white bg-gradient-to-r from-slate-900 via-slate-500 via-50% to-slate-900 to-90% h-[50px] sm:h-[50px] md:h-[50px] lg:h-[50px] xl:h-[50px]'>

              <div className="flex justify-between items-center w-full">
                {/* <div className="lg:cursor-pointer-hidden xl:cursor-pointer-hidden md:cursor-pointer-hidden sm:cursor-pointer-hidden lg:hidden xl:hidden md:hidden sm:hidden flex items-center h-[35px] cursor-pointer" onClick={() => navigate("/landing")} >
                  <svg className="w-6 h-6 text-slate-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                  </svg>
                </div> */}
                <div className="flex items-center">
                  <img src={Logo} className='h-[20px]' />
                  {/* <span className="font-bold text-3xl text-white hidden sm:block md:block lg:block xl:block">
                    COSMOHUB
                  </span> */}
                </div>

                <div className='text-sm flex items-center rounded transition-all'>
                  <div className='flex items-center space-x-6'>
                    <ul>
                      <li className="relative px-1 after:absolute after:bg-transparent after:w-full after:h-[2px] after:block after:top-8 after:left-0 after:transition-all after:duration-200">
                        <motion.svg whileTap={{ scale: 0.5 }} whileHover={{ scale: 1.1 }} xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" className="cursor-pointer xl:hover:fill-slate-500 lg:hover:fill-slate-500" fill="white" onClick={handleUserDropdown}
                          viewBox="0 0 512 512">
                          <path
                            d="M437.02 74.981C388.667 26.629 324.38 0 256 0S123.333 26.629 74.98 74.981C26.629 123.333 0 187.62 0 256s26.629 132.667 74.98 181.019C123.333 485.371 187.62 512 256 512s132.667-26.629 181.02-74.981C485.371 388.667 512 324.38 512 256s-26.629-132.667-74.98-181.019zM256 482c-66.869 0-127.037-29.202-168.452-75.511C113.223 338.422 178.948 290 256 290c-49.706 0-90-40.294-90-90s40.294-90 90-90 90 40.294 90 90-40.294 90-90 90c77.052 0 142.777 48.422 168.452 116.489C383.037 452.798 322.869 482 256 482z"
                            data-original="#000000" />
                        </motion.svg>
                        <motion.div animate={userDropdown === 'block' ? { opacity: 1, y: 0 } : { opacity: 1, y: "100%" }} className={userDropdown + " z-50 shadow-md bg-white p-4 w-[250px] sm:min-w-[140px] max-sm:min-w-[200px] absolute right-0 top-10 rounded-md"}>
                          <motion.h6 whileHover={{ scale: 1.1 }} className={userType == 1 ? "font-semibold cursor-pointer hover:text-slate-400" : "hidden m-0 p-0 "} onClick={() => {
                            navigate("/users",
                              {
                                state: {
                                  clientid
                                }
                              }
                            );
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2 float-start">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                            </svg>

                            User Settings</motion.h6>
                          <hr className={userType == 1 ? "w-43 h-1 mx-auto bg-gray-300 border-0 rounded my-2" : "hidden"} />
                          <motion.h6 whileHover={{ scale: 1.1 }} className={`font-semibold cursor-pointer hover:text-slate-400 ${userType == 1? "mt-4" : null}`} onClick={() => { setChangePassModal('block') }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2 float-start">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
                            </svg>

                            Change Password</motion.h6>

                          <motion.h6 whileHover={{ scale: 1.1 }} className="font-semibold cursor-pointer hover:text-red-400 mt-2" onClick={handleLogOut}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2 float-start">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                            </svg>

                            Logout
                          </motion.h6>



                        </motion.div>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </section>
          </header>
          {/* <div className='bg-slate-700 max-sm:rounded-sm rounded-br-[560px] rounded-bl-[560px] h-full bg-gradient-to-r from-slate-900 via-slate-500 via-50% to-slate-900 to-90%'> */}
          {/* <div className='justify-start text-sm mt-2 cursor-pointer hidden sm:flex md:flex lg:flex xl:flex text-gray-400' onClick={() => navigate("/landing")}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-current mr-2" viewBox="0 0 55.753 55.753">
                            <path
                                d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                                data-original="#000000" />
                        </svg>
                        <p>back to the clients page</p>
                    </div> */}
          <div className='flex flex-wrap items-center justify-end px-10 py-3 relative lg:gap-y-4 max-sm:gap-x-4 gap-y-6 w-full mt-7'>

            <div className='flex items-center'>
              <div
                className=" border-2 bg-gray-50 outline-[#333] focus-within:outline focus-within:bg-transparent flex px-4 rounded-sm h-10 max-xl:flex max-lg:flex w-full transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-gray-400 mr-3">
                  <path
                    d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                  </path>
                </svg>
                <input type='text' value={client} onChange={handleSearchBar} placeholder='Search...' className="w-full outline-none bg-transparent text-black text-sm" />

              </div>
              <motion.button whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.5 }}
                type="button"
                onClick={handleAddModalOpen}
                className="h-[40px] w-[220px] sm:w-[240px] md:w-[200px] lg:w-[200px] xl:w-[200px] px-4 py-2.5 flex items-center text-white rounded-sm text-sm font-semibold outline-none bg-slate-700 hover:bg-slate-400 active:bg-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="currentColor" className="mr-2" viewBox="0 0 6.35 6.35">
                  <path fillRule="evenodd" d="M3.181.264A2.92 2.92 0 0 0 .264 3.18a2.922 2.922 0 0 0 2.917 2.917A2.92 2.92 0 0 0 6.096 3.18 2.919 2.919 0 0 0 3.18.264zm0 .53A2.38 2.38 0 0 1 5.566 3.18 2.382 2.382 0 0 1 3.18 5.566 2.384 2.384 0 0 1 .794 3.179 2.383 2.383 0 0 1 3.181.794zm-.004 1.057a.265.265 0 0 0-.263.27v.794h-.793a.265.265 0 0 0-.028 0 .266.266 0 0 0 .028.53h.793v.794a.265.265 0 0 0 .531 0v-.793h.794a.265.265 0 0 0 0-.531h-.794v-.794a.265.265 0 0 0-.268-.27z" data-original="#000000" paintOrder="stroke fill markers" />
                </svg>
                Add Client
              </motion.button>
            </div>
          </div>
          {showModal ? (
            <>
              <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
              >
                <div className="flex relative w-auto my-6 mx-auto max-w-6xl">
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-3xl font-semibold">
                        Clients Contact Persons
                      </h3>
                    </div>
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <motion.button whileHover={{scale: 1.05}} whileTap={{ scale: 0.8}}
                        className="text-slate-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </motion.button>
                      <motion.button whileHover={{scale: 1.05}} whileTap={{ scale: 0.8}}
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Add Contact
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}
          <motion.div initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={isModalOpen + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
            <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
              <div className="flex items-center pb-3 border-b text-black">
                <h3 className="text-xl font-bold flex-1">Add Client</h3>
                <motion.svg whileTap={{ scale: 0.5 }} whileHover={{ scale: 1.08 }} onClick={handleAddModalClose} xmlns="http://www.w3.org/2000/svg" className="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
                  viewBox="0 0 320.591 320.591">
                  <path
                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                    data-original="#000000"></path>
                  <path
                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                    data-original="#000000"></path>
                </motion.svg>
              </div>
              <div className="m-10">
                <form onSubmit={handleAddClient} className="space-y-6 px-4 max-w-sm mx-auto font-[sans-serif]">
                  {/* <div className={`${addErrorHandler} mt-2 bg-red-100 text-red-800 w-[360px] p-4 rounded-md relative`} role="alert">
                    <strong className="font-bold text-base">Client Add Failed!</strong>
                    <span className="block text-sm sm:inline max-sm:mt-1 max-sm:ml-0 mx-4">Client name already exist.</span>
                  </div> */}
                  <div className="flex items-center">
                    <label className="text-gray-400 w-36 text-sm">Client :</label>
                    <input
                      type="text"
                      // id="clientname"
                      name="clientname"
                      placeholder="Enter clients name"
                      value={clientname}
                      required
                      autoComplete='off'
                      onChange={handleOnChange}
                      className={`px-2 py-2 w-full border-b-2 ${addErrorHandler === 'hidden' ? ' focus:border-slate-700' : 'border-red-400 focus:border-red-400'}  outline-none text-sm bg-white`} />
                  </div>
                  <p className={addErrorHandler + ' text-xs flex flex-row-reverse text-red-400 absolute top-[120px] right-[90px]'}>Client Name Already Exist</p>
                  <div className="flex items-center">
                    <label className="text-gray-400 w-36 text-sm">Address :</label>
                    <input
                      type="text"
                      // id="clientaddress"
                      name="clientaddress"
                      placeholder="Enter clients address"
                      value={clientaddress}
                      required
                      autoComplete='off'
                      onChange={handleOnChange}
                      className="px-2 py-2 w-full border-b-2 focus:border-slate-700 outline-none text-sm bg-white" />
                  </div>
                  <motion.button whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.08 }} type="submit"
                    className="rounded-md px-6 py-2 w-full bg-slate-700 text-sm text-white hover:bg-slate-400 mx-auto block">Submit</motion.button>
                </form>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={isClientModalOpen + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
            <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
              <div className="flex items-center pb-3 border-b text-black">
                <h3 className="text-xl font-bold flex-1">Update Client</h3>
                <svg onClick={(e) => handleUpdateClientClose(e)} xmlns="http://www.w3.org/2000/svg" className="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
                  viewBox="0 0 320.591 320.591">
                  <path
                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                    data-original="#000000"></path>
                  <path
                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                    data-original="#000000"></path>
                </svg>
              </div>
              <div className="m-10">
                <form onSubmit={handleSubmitUpdate} className="space-y-6 px-4 max-w-sm mx-auto font-[sans-serif]">
                  <div className="flex items-center">
                    <label className="text-gray-400 w-36 text-sm">Client :</label>
                    <input
                      type="text"
                      // id="clientname"
                      name="clientname"
                      placeholder="Enter clients name"
                      value={clientname}
                      required
                      onChange={handleOnChange}
                      autoComplete='off'
                      className={`px-2 py-2 w-full border-b-2 ${addErrorHandler === 'hidden' ? 'border-slate-700 focus:border-slate-700' : 'border-red-400 focus:border-red-400'}  outline-none text-sm bg-white`} />
                  </div>
                  <p className={addErrorHandler + ' text-xs flex flex-row-reverse text-red-400 absolute top-[120px] right-[90px]'}>Client Name Already Exist</p>
                  <div className="flex items-center">
                    <label className="text-gray-400 w-36 text-sm">Address :</label>
                    <input
                      type="text"
                      // id="clientaddress"
                      name="clientaddress"
                      placeholder="Enter clients address"
                      value={clientaddress}
                      required
                      onChange={handleOnChange}
                      autoComplete='off'
                      className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                  </div>
                  <motion.button whileHover={{scale: 1.05}} whileTap={{ scale: 0.8}} type="submit"
                    className="px-6 py-2 w-full bg-slate-800 text-sm text-white hover:bg-slate-500 mx-auto block">
                      Update
                      </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={changePassModal + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
            <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
              <div className="flex items-center pb-3 border-b text-black">
                <h3 className="text-xl font-bold flex-1">Change Password</h3>
                <svg onClick={() => { setChangePassModal('hidden') }} xmlns="http://www.w3.org/2000/svg" className="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
                  viewBox="0 0 320.591 320.591">
                  <path
                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                    data-original="#000000"></path>
                  <path
                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                    data-original="#000000"></path>
                </svg>
              </div>
              <div className="m-10">
                <form onSubmit={handleChangePassword} className="space-y-6 px-4 max-w-sm mx-auto font-[sans-serif]">
                  <div className={`${changePassErrorHandler} mt-2 bg-red-100 text-red-800 w-[360px] p-4 rounded-md relative`} role="alert">
                    <strong className="font-bold text-base">Change Password Failed!</strong>
                    <span className="block text-sm sm:inline max-sm:mt-1 max-sm:ml-0 mx-4">Confirmed password doesnt match the new password.</span>
                  </div>
                  <div className="flex items-center">
                    <label className="text-gray-400 w-44 text-sm">New Password :</label>
                    <input
                      type={passwordTypeNew}
                      id="newpassword"
                      name="newpassword"
                      placeholder="Enter new password"
                      value={newpassword}
                      required
                      onChange={handleOnChangePass}
                      autoComplete='off'
                      className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                    <div className="my-auto text-xs leading-6 text-right text-neutral-400">
                      <a className="font-bold text-neutral-800">
                        <label className="cursor-pointer" name="newpassword" onClick={handleShowPass} htmlFor="check">{showHideNew}</label>
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="text-gray-400 w-44 text-sm">Confirm Password :</label>
                    <input
                      type={passwordType}
                      id="confirmpassword"
                      name="confirmpassword"
                      placeholder="Enter confirmed password"
                      value={confirmpassword}
                      required
                      onChange={handleOnChangePass}
                      autoComplete='off'
                      className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                    <div className="my-auto text-xs leading-6 text-right text-neutral-400">
                      <a className="font-bold text-neutral-800">
                        <label className="cursor-pointer" name="confirmpassword" onClick={handleShowPass} htmlFor="check">{showHide}</label>
                      </a>
                    </div>
                  </div>

                  <motion.button whileHover={{scale: 1.05}} whileTap={{ scale: 0.8}} type="submit"
                    className="px-6 py-2 w-full bg-slate-800 text-sm text-white hover:bg-slate-500 mx-auto block">Update
                    </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
          {!loadingDone ? (
            <div className='flex items-start justify-center bg-gradient-to-r from-slate-200 via-slate-100 via-50% to-slate-200 to-90% h-screen'>
              <ReactLoading type="cylon" color="#94a3b8" height={100} width={100} delay={800} />
            </div>
          ) : (
            <>
            <section>
                <div className="text-3xl text-slate-700 ml-4 font-semibold mt-4">Clients</div>
                <div className="text-md text-slate-700 ml-4">Collection of partnered clients informations</div>
              <div className='flex items-center justify-center'>
                <div className='m-4 grid sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-3 w-full'>
                  {/* </header> */}

                  {foundClient && foundClient.length > 0 ? foundClient.map((clientInfo, i) => {
                    return (
                      <motion.div whileHover={{scale : 1.05}} initial={{ opacity: 0, y: "-40%" }} whileInView={{ opacity: 1, y: 0 }} className="relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900 shadow-lg" key={clientInfo.ClientId}>
                        <div aria-hidden="true" className="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-blue-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10 p-10"></div>
                        <div className="absolute top-0 right-0 m-2 flex items-center justify-center rounded-md cursor-pointer h-[40px] w-[40px]" onClick={handleOpenKebab} id="menuOpen">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="max-sm:w-9 max-sm:h-9 w-6 h-6" key={clientInfo.ClientId} data-key={clientInfo.ClientId}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                          </svg>

                          <motion.div initial={{ opacity: 0, y: "-100%" }} whileInView={{ opacity: 1, y: 0 }} name="kebabDropdown" id={clientInfo.ClientId} className="hidden flex-col z-50 bg-slate-200 p-2 w-[100px] sm:min-w-[10px] max-sm:min-w-[120px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]">
                            <motion.button whileHover={{scale: 1.05}} whileTap={{ scale: 0.8}} onClick={handleUpdateClient} id={clientInfo.ClientId} className="text-xs cursor-pointer hover:text-gray-400 rounded-sm flex items-start justify-start space-x-1 mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                              <span id={clientInfo.ClientId} className='mt-0.5'>Edit</span>
                            </motion.button>
                            <motion.button whileHover={{scale: 1.05}} whileTap={{ scale: 0.8}} id={clientInfo.ClientId} className="text-xs cursor-pointer hover:text-sky-400 rounded-sm flex items-start justify-start space-x-1" onClick={handleOpenClientInfo}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                              </svg>
                              <span id={clientInfo.ClientId} className='mt-0.5'>Contacts</span>
                            </motion.button>
                          </motion.div>
                        </div>
                        <div className="relative">
                          <div className="mt-6 pb-6 rounded-b-[--card-border-radius]">
                            <p className="text-gray-700 text-xl max-sm:text-3xl dark:text-gray-300">{clientInfo.ClientName}</p>
                            <p className="text-xs text-gray-700 max-sm:text-lg dark:text-gray-300">{clientInfo.ClientAddress}</p>
                          </div>
                          <div className="flex gap-3 -mb-8 py-4 border-t border-gray-200 dark:border-gray-800">
                          </div>
                        </div>
                      </motion.div>
                    )

                  }) :
                    <div className='flex items-start justify-start hover:bg-blue-50 bg-slate-100 h-screen w-screen'>
                      <div className="px-2 py-2 text-sm">
                        No Client Found.
                      </div>
                    </div>
                    
                  }

                  {/* <table className='min-w-full bg-white font-[sans-serif]'>
              <thead className="bg-gray-800 whitespace-nowrap">
                <tr>
                  <th className="w-full px-6 py-3 text-start font-semibold text-white text-lg">
                    Client
                  </th>
                  <th className="w-full px-6 py-3 text-left text-sm font-semibold text-white">
                  </th>
                </tr>
              </thead>
              <tbody className="whitespace-nowrap divide-y divide-gray-200">

                    {foundClient && foundClient.length > 0 ? foundClient.map((clientInfo, i) => {
                      return (
                        <tr className={i%2 === 0?'hover:bg-slate-200' : 'hover:bg-slate-200 bg-blue-50'} key={clientInfo.ClientId} id="parentElement" data-key={clientInfo.ClientId}>
                          
                          <td className="px-2 py-2 flex items-center justify-between">
                          <div className="px-2 py-2 text-md text-center">
                            {clientInfo.ClientName}
                            </div>
                            <div className=''>
                            <button className="mr-4" title="UpdateClient" onClick={handleUpdateClient}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#545457" className="float-start w-6 h-6 hover:stroke-slate-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                            </button>
                            <button className="mr-4" title="OpenClient" onClick={handleOpenClientInfo}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#545457" className="float-start w-6 h-6 hover:stroke-slate-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                              </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )

                    }) :
                      <tr className='flex items-start justify-start hover:bg-blue-50 bg-slate-100 h-screen w-screen'>
                        <td className="px-2 py-2 text-sm">
                          No Client Found.
                        </td>
                      </tr>
                    }
                  
              </tbody>
            </table> */}

                </div>
              </div>
              </section>
            </>
          )}
        </div>
      </div>
      {/* </div> */}
    </>
  )
}

export default LandingPage