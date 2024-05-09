import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from '../../baseUrl';
import Swal from 'sweetalert2';
import ReactLoading from 'react-loading';
import Logo from '../assets/img_logogo.png';
import { motion } from 'framer-motion';

const UserPage = () => {

  const token = localStorage.getItem("token");
  // const token = "12345"
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [initialData, setInitialData] = useState("");
  const [user, setUser] = useState('');
  const [foundUser, setFoundUser] = useState(userData);
  const [userDropdown, setUserDropdown] = useState('hidden');
  const [isModalOpen, setIsModalOpen] = useState('hidden');
  const [isUserModalOpen, setIsUserModalOpen] = useState('hidden');

  const [addErrorHandler, setAddErrorHandler] = useState('hidden');
  const [changePassModal, setChangePassModal] = useState('hidden');
  const [passwordType, setPasswordType] = useState('password');
  const [showHide, setShowHide] = useState("SHOW");
  const [passwordTypeNew, setPasswordTypeNew] = useState('password');
  const [showHideNew, setShowHideNew] = useState("SHOW");
  const [changePassErrorHandler, setChangePassErrorHandler] = useState('hidden');
  const [loadingDone, setLoadingDone] = useState(undefined);
  const [employeeNoErr, setEmployeeNoErr] = useState("");
  const [firstnameErr, setFirstnameErr] = useState("");
  const [lastnameErr, setLastnameErr] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [confirmPasswordErr, setConfirmPasswordErr] = useState("");
  const [errorMsg, setErrorMsg] = useState("")
  const [isChecked, setIsChecked] = useState(false);


  const [inputValue, setInputValue] = useState({
    employeeid: "",
    employeeno: "",
    position: "",
    firstname: "",
    middlename: "",
    lastname: "",
    department: "",
    username: "",
    password: "",
    confirmpassword: "",
    userType: 0
  });

  const [changepassInput, setChangepassInput] = useState({
    newpassword: "",
    confirmchangepassword: ""
  })
  const { newpassword, confirmchangepassword } = changepassInput;
  const { employeeid, employeeno, position, firstname, middlename, lastname, department, username, password, confirmpassword, userType } = inputValue;


  const dummyArr = [
    {
      Value: "123",
      Text: "Raymon pogi",
      // useraddress: "address ni raymon",
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

  const getUserList = async () => {
    try {
      const { data } = await axios.get(
        `${base_url}/api/mobileapi/GetAllUser`,
        {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });

      const { ReturnMsg, UserList } = data;
      if (ReturnMsg === "Success") {
        setUserData(UserList);
      }

      setLoadingDone(true)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userData) {
      setTimeout(() => {
        getUserList();
      }, 2000)
    }

    if (initialData == "" || initialData == undefined) {
      setFoundUser(userData)
    }
    // console.log(userData)
  }, [userData]);

  // console.log(token)
  const handleAddModalOpen = () => {
    setIsModalOpen('block');
  }

  const handleAddModalClose = () => {
    closeDropdown("");
    setInputValue({
      ...inputValue,
      employeeid: "",
    employeeno: "",
    position: "",
    firstname: "",
    middlename: "",
    lastname: "",
    department: "",
    username: "",
    password: "",
    confirmpassword: "",
    userType: 0
    });
    setIsChecked(false);
    setIsModalOpen('hidden');
  }

  const handleUpdateUserClose = () => {
    setInputValue({
      ...inputValue,
      employeeid: "",
    employeeno: "",
    position: "",
    firstname: "",
    middlename: "",
    lastname: "",
    department: "",
    username: "",
    password: "",
    confirmpassword: "",
    userType: 0
    });
    setIsChecked(false);
    closeDropdown("");
    setIsUserModalOpen('hidden');
  }

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${base_url}/api/mobileapi/PostUser`,
        {
          ...inputValue,
        },
        {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }
      );
      const { ReturnMsg, ResultList } = data;
      if (ReturnMsg === "Success") {
        Swal.fire({
          title: "User Added",
          text: "Successfuly added a new user!",
          confirmButtonColor: "#334155",
          color: "#334155",
        }).then(() => {
          setIsModalOpen('hidden');
          window.location.reload();
        })
      } else {
        if (ReturnMsg === "Fail") {
          for (let index in ResultList) {
            const errorData = ResultList[index];
            if (errorData.ValidationKey === "EmployeeNo") {
              setEmployeeNoErr(errorData.ValidationMsg)
            } else if (errorData.ValidationKey === "FirstName") {
              setFirstnameErr(errorData.ValidationMsg)

            } else if (errorData.ValidationKey === "LastName") {
              setLastnameErr(errorData.ValidationMsg)

            } else if (errorData.ValidationKey === "UserName") {
              setUsernameErr(errorData.ValidationMsg)

            } else if (errorData.ValidationKey === "Password") {
              setPasswordErr(errorData.ValidationMsg)
            } else if (errorData.ValidationKey === "ConfirmPassword") {
              setConfirmPasswordErr(errorData.ValidationMsg)
            }
          }
        } else if (ReturnMsg === "Username already exists") {
          setAddErrorHandler('block');
          setErrorMsg(ReturnMsg);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      employeeid: "",
      employeeno: "",
      position: "",
      firstname: "",
      middlename: "",
      lastname: "",
      department: "",
      username: "",
      password: "",
      confirmpassword: "",
      userType: 0
    });
    setIsChecked(false);
    const errorMethod = () => {
      setEmployeeNoErr("");
      setFirstnameErr("");
      setLastnameErr("");
      setUsernameErr("");
      setPasswordErr("");
      setConfirmPasswordErr("");
    }
    if (employeeNoErr !== "") {
      errorMethod();
    } else if (firstnameErr !== "") {
      errorMethod();
    } else if (lastnameErr !== "") {
      errorMethod();
    } else if (usernameErr !== "") {
      errorMethod();
    } else if (passwordErr !== "") {
      errorMethod();
    } else if (confirmPasswordErr !== "") {
      errorMethod();
    }
  };

  const handleOnChange = (e) => {
    e.preventDefault();
    if (addErrorHandler === 'block') {
      setAddErrorHandler('hidden')
    }
    const errorMethod = () => {
      setEmployeeNoErr("");
      setFirstnameErr("");
      setLastnameErr("");
      setUsernameErr("");
      setPasswordErr("");
      setConfirmPasswordErr("");
    }
    if (employeeNoErr !== "") {
      errorMethod();
    } else if (firstnameErr !== "") {
      errorMethod();
    } else if (lastnameErr !== "") {
      errorMethod();
    } else if (usernameErr !== "") {
      errorMethod();
    } else if (passwordErr !== "") {
      errorMethod();
    } else if (confirmPasswordErr !== "") {
      errorMethod();
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

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const userId = e.target.id;
    for (let i in userData) {
      const data = userData[i];
      if (data.EmployeeId === userId) {
        if(data.UserType === 1){
          setIsChecked(true);
        }
        setInputValue({
          ...inputValue,
          employeeid: data.EmployeeId,
          employeeno: data.EmployeeNo,
          position: data.PositionName,
          firstname: data.FirstName,
          middlename: data.MiddleName,
          lastname: data.LastName,
          department: data.DepartmnentName,
          username: data.UserName,
          password: data.Password,
          confirmpassword: data.ConfirmPassword,
          userType: data.UserType
        });
      }
    }
    const errorMethod = () => {
      setEmployeeNoErr("");
      setFirstnameErr("");
      setLastnameErr("");
      setUsernameErr("");
      setPasswordErr("");
      setConfirmPasswordErr("");
    }
    if (employeeNoErr !== "") {
      errorMethod();
    } else if (firstnameErr !== "") {
      errorMethod();
    } else if (lastnameErr !== "") {
      errorMethod();
    } else if (usernameErr !== "") {
      errorMethod();
    } else if (passwordErr !== "") {
      errorMethod();
    } else if (confirmPasswordErr !== "") {
      errorMethod();
    }
    setIsUserModalOpen('block');
  }

  const handleDeleteUser = async (e) => {
    const userId = e.target.id;
    Swal.fire({
      title: "Remove Contact",
      text: "Are you sure you want to delete this contact?",
      confirmButtonColor: "#334155",
      showCancelButton: true,
      color: "#334155",
    }).then(async (confirmMsg) => {
      if (confirmMsg.isConfirmed == true) {
        const { data } = await axios.post(
          `${base_url}/api/mobileapi/DeleteUser`,
          {
            "EmployeeId": userId
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
            title: "Contact Deleted",
            text: "Successfuly deleted contact!",
            confirmButtonColor: "#334155",
            color: "#334155",
          }).then((input) => {

            if (input.isConfirmed) {
              window.location.reload();
            }
          })
        }
      }

    })
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

  const handleClicked = (e) => {
    const checkedValue = e.target.checked;
    setIsChecked(checkedValue);
    if(checkedValue === true) {
      setInputValue({...inputValue, userType: 1})
    } else {
      setInputValue({...inputValue, userType: 0})
    }
  }

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    for(let index in inputValue){
      const value = inputValue[index];
      if(value == null || value == undefined
        || value == ""
      ) {
        delete inputValue[index];
      }
    }
    try {
      const { data } = await axios.post(
        `${base_url}/api/mobileapi/PostUser`,
        {
          ...inputValue
        },
        {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }
      );
      const { ReturnMsg, ResultList } = data;
      if (ReturnMsg === "Success") {
        Swal.fire({
          title: "User Updated",
          text: "Successfuly updated user!",
          confirmButtonColor: "#334155",
          color: "#334155",
        }).then(() => {
          setIsUserModalOpen('hidden');
          closeDropdown("");
          window.location.reload();
        })
      } else {
        if (ReturnMsg === "Fail") {
          for (let index in ResultList) {
            const errorData = ResultList[index];
            if (errorData.ValidationKey === "EmployeeNo") {
              setEmployeeNoErr(errorData.ValidationMsg)
            } else if (errorData.ValidationKey === "FirstName") {
              setFirstnameErr(errorData.ValidationMsg)

            } else if (errorData.ValidationKey === "LastName") {
              setLastnameErr(errorData.ValidationMsg)

            } else if (errorData.ValidationKey === "UserName") {
              setUsernameErr(errorData.ValidationMsg)

            } else if (errorData.ValidationKey === "Password") {
              setPasswordErr(errorData.ValidationMsg)
            } else if (errorData.ValidationKey === "ConfirmPassword") {
              setConfirmPasswordErr(errorData.ValidationMsg)
            }
          }
        } else if (ReturnMsg === "Username already exists") {
          setAddErrorHandler('block');
          setErrorMsg(ReturnMsg);
        }
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
      }
    })
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

  const handleUserDropdown = () => {
    if (userDropdown === 'hidden') {
      setUserDropdown('block');
    } else {
      setUserDropdown('hidden');
    }
  }

  const handleSearchBar = (e) => {
    const searchInput = e.target.value;
    setInitialData(searchInput);
    if (searchInput !== '') {
      const results = userData.filter((user) => {
        return user.LNameFName.toLowerCase().startsWith(searchInput.toLowerCase());
      });
      setFoundUser(results);
    } else {
      setFoundUser(userData);
      console.log("raymon")
    }

    setUser(searchInput);
  }

  const handleOpenKebab = (e) => {
    const contactId = e.target.getAttribute('data-key');
    const allElements = document.getElementsByName("kebabDropdown");
    for (let index in allElements) {
      const targetElement = allElements[index];
      if (targetElement.id !== undefined && targetElement.id !== null) {
        if (contactId == targetElement.id) {
          const elementInfo = "flex flex-col p-4 z-50 bg-slate-100 p-2 w-[150px] sm:min-w-[100px] max-sm:min-w-[100px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]";
          const elementHidden = "hidden flex-col z-50 bg-slate-100 p-2 w-[100px] sm:min-w-[100px] max-sm:min-w-[100px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]";
          const variantClose = {
            opacity: 0, y: "-100%"
          }
          const variantOpen = {
            opacity: 1, y: 0
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
      <div className="font-[sans-serif] text-[#333] bg-gradient-to-r from-slate-200 via-slate-100 via-50% to-slate-200 to-90% p-4 h-full">
        <div className="">
          <header className='shadow-md font-[sans-serif] tracking-wide relative z-50'>
            <section className='md:flex lg:items-center relative py-3 lg:px-10 px-4 border-slate-200 border-b bg-white bg-gradient-to-r from-slate-900 via-slate-500 via-50% to-slate-900 to-90% h-[50px] sm:h-[50px] md:h-[50px] lg:h-[50px] xl:h-[50px]'>

              <div className="flex justify-between items-center w-full">
                <motion.div whileHover={{ x: 10 }} whileTap={{ x: 0 }} className="lg:cursor-pointer-hidden xl:cursor-pointer-hidden md:cursor-pointer-hidden sm:cursor-pointer-hidden lg:hidden xl:hidden md:hidden sm:hidden flex items-center h-[25px] cursor-pointer" onClick={() => navigate("/landing")} >
                  <svg className="w-6 h-6 text-slate-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                  </svg>
                </motion.div>
                <div className="flex items-center">
                  <img src={Logo} className='h-[20px] max-sm:hidden' />
                </div>

                <div className='text-sm flex items-center rounded transition-all'>
                  <div className='flex items-center space-x-6'>
                    <ul>
                      <li className="relative px-1 after:absolute after:bg-transparent after:w-full after:h-[2px] after:block after:top-8 after:left-0 after:transition-all after:duration-200">
                        <motion.svg whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.8 }} xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" className="cursor-pointer xl:hover:fill-slate-500 lg:hover:fill-slate-500" fill="white" onClick={handleUserDropdown}
                          viewBox="0 0 512 512">
                          <path
                            d="M437.02 74.981C388.667 26.629 324.38 0 256 0S123.333 26.629 74.98 74.981C26.629 123.333 0 187.62 0 256s26.629 132.667 74.98 181.019C123.333 485.371 187.62 512 256 512s132.667-26.629 181.02-74.981C485.371 388.667 512 324.38 512 256s-26.629-132.667-74.98-181.019zM256 482c-66.869 0-127.037-29.202-168.452-75.511C113.223 338.422 178.948 290 256 290c-49.706 0-90-40.294-90-90s40.294-90 90-90 90 40.294 90 90-40.294 90-90 90c77.052 0 142.777 48.422 168.452 116.489C383.037 452.798 322.869 482 256 482z"
                            data-original="#000000" />
                        </motion.svg>
                        <motion.div animate={userDropdown === 'block' ? { opacity: 1, y: 0 } : { opacity: 1, y: "100%" }} className={userDropdown + " z-50 shadow-md bg-white p-4 w-[250px] sm:min-w-[140px] max-sm:min-w-[200px] absolute right-0 top-10 rounded-md"}>
                          <motion.h6 whileHover={{ scale: 1.1 }} className="font-semibold cursor-pointer hover:text-slate-400" onClick={() => { setChangePassModal('block') }}>
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
          <motion.div whileHover={{ x: 10 }} whileTap={{ x: 0 }} className='justify-start text-sm mt-2 cursor-pointer hidden sm:flex md:flex lg:flex xl:flex text-gray-400' onClick={() => navigate("/landing")}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-current mr-2" viewBox="0 0 55.753 55.753">
              <path
                d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                data-original="#000000" />
            </svg>
            <p>back to the clients page</p>
          </motion.div>
          <div className='flex flex-wrap items-center justify-end px-10 py-3 relative lg:gap-y-4 max-sm:gap-x-4 gap-y-6 w-full mt-7'>

            <div className='flex items-center'>
              <div
                className=" border-2 bg-gray-50 outline-[#333] focus-within:outline focus-within:bg-transparent flex px-4 rounded-sm h-10 max-xl:flex max-lg:flex w-full transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-gray-400 mr-3">
                  <path
                    d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                  </path>
                </svg>
                <input type='text' value={user} onChange={handleSearchBar} placeholder='Search...' className="w-full outline-none bg-transparent text-black text-sm" />

              </div>
              <motion.button whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.8 }}
                type="button"
                onClick={handleAddModalOpen}
                className="h-[40px] w-[220px] sm:w-[240px] md:w-[200px] lg:w-[200px] xl:w-[200px] px-4 py-2.5 flex items-center text-[#fff] rounded-sm text-sm font-semibold outline-none bg-slate-600 hover:bg-slate-700 active:bg-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 float-start mr-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
                Add User
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
                        Users Contact Persons
                      </h3>
                    </div>
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <motion.button
                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.08 }}
                        className="text-slate-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.08 }}
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
            className={isUserModalOpen + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
            <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
              <div className="flex items-center pb-3 border-b text-black">
                <h3 className="text-xl font-bold flex-1">Update User</h3>
                <svg onClick={handleUpdateUserClose} xmlns="http://www.w3.org/2000/svg" className="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
                  viewBox="0 0 320.591 320.591">
                  <path
                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                    data-original="#000000"></path>
                  <path
                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                    data-original="#000000"></path>
                </svg>
              </div>
              <form onSubmit={handleSubmitUpdate} className="font-[sans-serif] m-6 max-w-4xl mx-auto">
                <div className="grid sm:grid-cols-2 gap-10">
                <div className="relative flex items-center sm:col-span-2">
                    <label
                      className="relative flex cursor-pointer items-center rounded-full p-3"
                      htmlhtmlfor="updateCheckbox"
                      data-ripple-dark="true"
                    >
                      <input
                        type="checkbox"
                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-8 before:w-8 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-md before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-sky-500 checked:bg-sky-500 checked:before:bg-sky-500 hover:before:opacity-10"
                        id="updateCheckbox"
                        checked={isChecked}
                        name='userType'
                        onChange={handleClicked}
                      />
                      <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </label>
                    <div className="text-[13px] font-semibold mt-0.5 text-slate-500">Grant Admin Permission</div>
                  </div>
                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Employee No.</label>
                    <input type="number" placeholder="Enter employee number"
                      onChange={handleOnChange}
                      name='employeeno'
                      value={employeeno}
                      autoComplete='off'
                      // required
                      className={`truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-${employeeNoErr !== "" ? "red" : "slate"}-200 focus:border-slate-500 rounded outline-none`} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                    <label className={employeeNoErr !== "" ? `text-[11px] bg-white text-red-500 absolute px-2 top-[40px] left-[18px] font-semibold` : "hidden"}>
                      {employeeNoErr !== "" ? employeeNoErr : null}</label>
                  </div>
                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Position</label>
                    <input type="text" placeholder="Enter company position"
                      name='position'
                      value={position}
                      onChange={handleOnChange}
                      autoComplete='off'
                      // required
                      className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-200 focus:border-slate-500 rounded outline-none" />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>

                  </div>
                  <div className="relative flex items-center">

                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Firstname</label>
                    <input type="text" placeholder="Enter first name"
                      onChange={handleOnChange}
                      name='firstname'
                      value={firstname}
                      autoComplete='off'
                      className={`truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-${firstnameErr !== "" ? "red" : "slate"}-200 focus:border-slate-500 rounded outline-none`} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                    <label className={firstnameErr !== "" ? `text-[11px] bg-white text-red-500 absolute px-2 top-[40px] left-[18px] font-semibold` : "hidden"}>
                      {firstnameErr !== "" ? firstnameErr : null}</label>
                  </div>
                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Middlename</label>
                    <input type="text" placeholder="Enter middle name"
                      name='middlename'
                      value={middlename}
                      onChange={handleOnChange}
                      autoComplete='off'
                      // required
                      className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-200 focus:border-slate-500 rounded outline-none" />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                  </div>
                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Lastname</label>
                    <input type="text" placeholder="Enter last name"
                      name='lastname'
                      value={lastname}
                      onChange={handleOnChange}
                      autoComplete='off'
                      // required
                      className={`truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-${lastnameErr !== "" ? "red" : "slate"}-200 focus:border-slate-500 rounded outline-none`} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                    <label className={lastnameErr !== "" ? `text-[11px] bg-white text-red-500 absolute px-2 top-[40px] left-[18px] font-semibold` : "hidden"}>
                      {lastnameErr !== "" ? lastnameErr : null}</label>
                  </div>
                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Department</label>
                    <input type="text" placeholder="Enter department"
                      name='department'
                      value={department}
                      onChange={handleOnChange}
                      autoComplete='off'
                      // required
                      className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-200 focus:border-slate-500 rounded outline-none" />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                  </div>
                  <div className="relative flex items-center sm:col-span-2">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Username</label>
                    <input type="text" placeholder="Enter user name"
                      name='username'
                      value={username}
                      onChange={handleOnChange}
                      autoComplete='off'
                      // required
                      className={`truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-${usernameErr !== "" ? "red" : "slate"}-200 focus:border-slate-500 rounded outline-none`} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                    <label className={usernameErr !== "" ? `text-[11px] bg-white text-red-500 absolute px-2 top-[40px] left-[18px] font-semibold` : "hidden"}>
                      {usernameErr !== "" ? usernameErr : null}</label>
                  </div>

                  <div className="relative flex items-center sm:col-span-2">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Password</label>
                    <input type="password" placeholder="Enter password"
                      name='password'
                      value={password}
                      onChange={handleOnChange}
                      autoComplete='off'
                      // required
                      className={`truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-${passwordErr !== "" ? "red" : "slate"}-200 focus:border-slate-500 rounded outline-none`} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                    <label className={passwordErr !== "" ? `text-[11px] bg-white text-red-500 absolute px-2 top-[40px] left-[18px] font-semibold` : "hidden"}>
                      {passwordErr !== "" ? passwordErr : null}</label>
                  </div>
                  <div className="mb-9 relative flex items-center sm:col-span-2">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Confirm Password</label>
                    <input type="password" placeholder="Enter confirm password"
                      name='confirmpassword'
                      value={confirmpassword}
                      onChange={handleOnChange}
                      autoComplete='off'
                      // required
                      className={`truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-${confirmPasswordErr !== "" ? "red" : "slate"}-200 focus:border-slate-500 rounded outline-none`} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                    <label className={confirmPasswordErr !== "" ? `text-[11px] bg-white text-red-500 absolute px-2 top-[40px] left-[18px] font-semibold` : "hidden"}>
                      {confirmPasswordErr !== "" ? confirmPasswordErr : null}</label>
                  </div>
                </div>
                <div className={addErrorHandler + ` flex justify-center items-center m-1 font-medium py-1 px-2 rounded-md text-red-700 bg-red-100 border border-red-300`}>
                  <div slot="avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon w-5 h-5 mx-2">
                      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <div className="text-sm font-normal  max-w-full flex-initial">
                    {errorMsg}
                  </div>
                  <div className="flex flex-auto flex-row-reverse">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x cursor-pointer hover:text-red-400 rounded-full w-5 h-5 ml-2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.8 }} type="submit"
                  className="px-6 py-2.5 w-full text-sm font-semibold bg-slate-500 text-white rounded hover:bg-slate-600 mt-5">Submit</motion.button>
              </form>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            className={isModalOpen + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
            <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
              <div className="flex items-center pb-3 border-b text-black">
                <h3 className="text-xl font-bold flex-1">Add User</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
                  onClick={handleAddModalClose}
                  viewBox="0 0 320.591 320.591">
                  <path
                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                    data-original="#000000"></path>
                  <path
                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                    data-original="#000000"></path>
                </svg>
              </div>

              <form onSubmit={handleAddUser} className="font-[sans-serif] m-6 max-w-4xl mx-auto">
                <div className="grid sm:grid-cols-2 gap-10">
                <div className="relative flex items-center sm:col-span-2">
                    <label
                      className="relative flex cursor-pointer items-center rounded-full p-3"
                      htmlhtmlfor="addCheckbox"
                      data-ripple-dark="true"
                    >
                      <input
                        type="checkbox"
                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-8 before:w-8 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-md before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-sky-500 checked:bg-sky-500 checked:before:bg-sky-500 hover:before:opacity-10"
                        id="addCheckbox"
                        checked={isChecked}
                        name='userType'
                        onChange={handleClicked}
                      />
                      <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </label>
                    <div className="text-[13px] font-semibold mt-0.5 text-slate-500">Grant Admin Permission</div>
                  </div>
                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Employee No.</label>
                    <input type="number" placeholder="Enter employee number"
                      onChange={handleOnChange}
                      name='employeeno'
                      value={employeeno}
                      autoComplete='off'
                      // required
                      className={`truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-${employeeNoErr !== "" ? "red" : "slate"}-200 focus:border-slate-500 rounded outline-none`} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                    <label className={employeeNoErr !== "" ? `text-[11px] bg-white text-red-500 absolute px-2 top-[40px] left-[18px] font-semibold` : "hidden"}>
                      {employeeNoErr !== "" ? employeeNoErr : null}</label>
                  </div>
                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Position</label>
                    <input type="text" placeholder="Enter company position"
                      name='position'
                      value={position}
                      onChange={handleOnChange}
                      autoComplete='off'
                      // required
                      className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-200 focus:border-slate-500 rounded outline-none" />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>

                  </div>
                  <div className="relative flex items-center">

                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Firstname</label>
                    <input type="text" placeholder="Enter first name"
                      onChange={handleOnChange}
                      name='firstname'
                      value={firstname}
                      autoComplete='off'
                      className={`truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-${firstnameErr !== "" ? "red" : "slate"}-200 focus:border-slate-500 rounded outline-none`} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                    <label className={firstnameErr !== "" ? `text-[11px] bg-white text-red-500 absolute px-2 top-[40px] left-[18px] font-semibold` : "hidden"}>
                      {firstnameErr !== "" ? firstnameErr : null}</label>
                  </div>
                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Middlename</label>
                    <input type="text" placeholder="Enter middle name"
                      name='middlename'
                      value={middlename}
                      onChange={handleOnChange}
                      autoComplete='off'
                      // required
                      className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-200 focus:border-slate-500 rounded outline-none" />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                  </div>
                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Lastname</label>
                    <input type="text" placeholder="Enter last name"
                      name='lastname'
                      value={lastname}
                      onChange={handleOnChange}
                      autoComplete='off'
                      // required
                      className={`truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-${lastnameErr !== "" ? "red" : "slate"}-200 focus:border-slate-500 rounded outline-none`} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                    <label className={lastnameErr !== "" ? `text-[11px] bg-white text-red-500 absolute px-2 top-[40px] left-[18px] font-semibold` : "hidden"}>
                      {lastnameErr !== "" ? lastnameErr : null}</label>
                  </div>
                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Department</label>
                    <input type="text" placeholder="Enter department"
                      name='department'
                      value={department}
                      onChange={handleOnChange}
                      autoComplete='off'
                      // required
                      className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-200 focus:border-slate-500 rounded outline-none" />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                  </div>
                  <div className="relative flex items-center sm:col-span-2">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Username</label>
                    <input type="text" placeholder="Enter user name"
                      name='username'
                      value={username}
                      onChange={handleOnChange}
                      autoComplete='off'
                      // required
                      className={`truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-${usernameErr !== "" ? "red" : "slate"}-200 focus:border-slate-500 rounded outline-none`} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                    <label className={usernameErr !== "" ? `text-[11px] bg-white text-red-500 absolute px-2 top-[40px] left-[18px] font-semibold` : "hidden"}>
                      {usernameErr !== "" ? usernameErr : null}</label>
                  </div>

                  <div className="relative flex items-center sm:col-span-2">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Password</label>
                    <input type="password" placeholder="Enter password"
                      name='password'
                      value={password}
                      onChange={handleOnChange}
                      autoComplete='off'
                      // required
                      className={`truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-${passwordErr !== "" ? "red" : "slate"}-200 focus:border-slate-500 rounded outline-none`} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                    <label className={passwordErr !== "" ? `text-[11px] bg-white text-red-500 absolute px-2 top-[40px] left-[18px] font-semibold` : "hidden"}>
                      {passwordErr !== "" ? passwordErr : null}</label>
                  </div>
                  <div className="mb-9 relative flex items-center sm:col-span-2">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Confirm Password</label>
                    <input type="password" placeholder="Enter confirm password"
                      name='confirmpassword'
                      value={confirmpassword}
                      onChange={handleOnChange}
                      autoComplete='off'
                      // required
                      className={`truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-${confirmPasswordErr !== "" ? "red" : "slate"}-200 focus:border-slate-500 rounded outline-none`} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24">
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"></path>
                    </svg>
                    <label className={confirmPasswordErr !== "" ? `text-[11px] bg-white text-red-500 absolute px-2 top-[40px] left-[18px] font-semibold` : "hidden"}>
                      {confirmPasswordErr !== "" ? confirmPasswordErr : null}</label>
                  </div>
                </div>
                <div className={addErrorHandler + ` flex justify-center items-center m-1 font-medium py-1 px-2 rounded-md text-red-700 bg-red-100 border border-red-300`}>
                  <div slot="avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon w-5 h-5 mx-2">
                      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <div className="text-sm font-normal  max-w-full flex-initial">
                    {errorMsg}
                  </div>
                  <div className="flex flex-auto flex-row-reverse">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x cursor-pointer hover:text-red-400 rounded-full w-5 h-5 ml-2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.8 }} type="submit"
                  className="px-6 py-2.5 w-full text-sm font-semibold bg-slate-500 text-white rounded hover:bg-slate-600 mt-5">Submit</motion.button>
              </form>
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
                        <motion.label whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.5 }} className="cursor-pointer" name="newpassword" onClick={handleShowPass} htmlhtmlhtmlfor="check">{showHideNew}</motion.label>
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="text-gray-400 w-44 text-sm">Confirm Password :</label>
                    <input
                      type={passwordType}
                      id="confirmchangepassword"
                      name="confirmchangepassword"
                      placeholder="Enter confirmed password"
                      value={confirmchangepassword}
                      required
                      onChange={handleOnChangePass}
                      autoComplete='off'
                      className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                    <div className="my-auto text-xs leading-6 text-right text-neutral-400">
                      <a className="font-bold text-neutral-800">
                        <motion.label whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.5 }} className="cursor-pointer" name="confirmchangepassword" onClick={handleShowPass} htmlhtmlhtmlfor="check">{showHide}</motion.label>
                      </a>
                    </div>
                  </div>

                  <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.8 }} type="submit"
                    className="px-6 py-2 w-full bg-slate-800 text-sm text-white hover:bg-slate-500 mx-auto block">Update</motion.button>
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
                <div className="text-3xl text-slate-700 ml-4 font-semibold mt-4">Users</div>
                <div className="text-md text-slate-700 ml-4">Collection of users informations</div>
              <div className='flex items-center justify-center'>
                <div className='m-4 grid sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-3 w-full'>
                  {/* </header> */}

                  {foundUser && foundUser.length > 0 ? foundUser.map((userInfo, i) => {
                    return (
                      <motion.div whileHover={{ scale: 1.05 }} initial={{ opacity: 0, y: "-40%" }} whileInView={{ opacity: 1, y: 0 }} className="relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900 shadow-lg" key={userInfo.EmployeeId}>
                        <div aria-hidden="true" className="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-blue-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10 p-10"></div>
                        <div className="absolute top-0 right-0 m-2 flex items-center justify-center rounded-md cursor-pointer h-[40px] w-[40px]" onClick={handleOpenKebab} id="menuOpen">
                          <motion.svg whileTap={{ scale: 0.5 }} whileHover={{ scale: 1.1 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="max-sm:w-9 max-sm:h-9 w-6 h-6" key={userInfo.EmployeeId} data-key={userInfo.EmployeeId}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                          </motion.svg>

                          <motion.div initial={{ opacity: 0, y: "-100%" }} whileInView={{ opacity: 1, y: 0 }} name="kebabDropdown" id={userInfo.EmployeeId} className="hidden flex-col z-50 bg-slate-200 p-2 w-[150px] sm:min-w-[10px] max-sm:min-w-[120px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]">
                            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.8 }} onClick={handleUpdateUser} id={userInfo.EmployeeId} className="text-xs cursor-pointer hover:text-gray-400 rounded-sm flex items-start justify-start space-x-1 mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                              <span id={userInfo.EmployeeId} className='mt-0.5'>Edit</span>
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.8 }} id={userInfo.EmployeeId} className="text-xs cursor-pointer hover:text-red-400 rounded-sm flex items-start justify-start space-x-1" onClick={handleDeleteUser}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>

                              <span id={userInfo.EmployeeId} className='mt-0.5'>Delete</span>
                            </motion.button>
                          </motion.div>
                        </div>
                        <div className="relative">
                          <div className="mt-6 pb-6 rounded-b-[--card-border-radius]">
                            <p className="text-gray-700 text-xl dark:text-gray-300 truncate">{userInfo.LNameFName}</p>
                            <p className="text-xs text-gray-700 dark:text-gray-300">{userInfo.UserRoleDesc}</p>
                          </div>
                          <div className="flex gap-3 -mb-8 py-4 border-t border-gray-200 dark:border-gray-800">
                          </div>
                        </div>
                      </motion.div>
                    )

                  }) :
                    <div className='flex items-start justify-start hover:bg-blue-50 bg-slate-100 h-screen w-screen'>
                      <div className="px-2 py-2 text-sm">
                        No User Found.
                      </div>
                    </div>
                  }

                  {/* <table className='min-w-full bg-white font-[sans-serif]'>
              <thead className="bg-gray-800 whitespace-nowrap">
                <tr>
                  <th className="w-full px-6 py-3 text-start font-semibold text-white text-lg">
                    User
                  </th>
                  <th className="w-full px-6 py-3 text-left text-sm font-semibold text-white">
                  </th>
                </tr>
              </thead>
              <tbody className="whitespace-nowrap divide-y divide-gray-200">

                    {foundUser && foundUser.length > 0 ? foundUser.map((userInfo, i) => {
                      return (
                        <tr className={i%2 === 0?'hover:bg-slate-200' : 'hover:bg-slate-200 bg-blue-50'} key={userInfo.Value} id="parentElement" data-key={userInfo.Value}>
                          
                          <td className="px-2 py-2 flex items-center justify-between">
                          <div className="px-2 py-2 text-md text-center">
                            {userInfo.Text}
                            </div>
                            <div className=''>
                            <button className="mr-4" title="UpdateUser" onClick={handleUpdateUser}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#545457" className="float-start w-6 h-6 hover:stroke-slate-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                            </button>
                            <button className="mr-4" title="OpenUser" onClick={handleDeleteUser}>
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
                          No User Found.
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
    </>
  )
}

export default UserPage