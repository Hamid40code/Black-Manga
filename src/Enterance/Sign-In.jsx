import './Entering.css'
import React, { useRef, useState, useEffect } from "react";
import sun from "../assets/sun-img.png";
import moon from "../assets/moon-img.png";
import { Link } from 'react-router-dom';
import Shop from '../Shop';

function SignIn() {

    const [error, setError] = useState("");
    const [darkMode, setDarkMode] = useState(true);
    const [Location, setLocation] = useState('Shop');
 
    const UserNameInputRef = useRef(null);
    const UserPassInputRef = useRef(null);
    const UserRePassInputRef = useRef(null);

     function ThemeToggle() {
        setDarkMode(prev => !prev);
    }

    useEffect(() => {
        document.body.className = darkMode
            ? "root-dark"
            : "root-light";
    }, [darkMode]);


    function Check() {

        const UserName = UserNameInputRef.current.value;
        const PassWord = UserPassInputRef.current.value;
        const RePassWord = UserRePassInputRef.current;

        if (UserName.length < 3) return setError("Your Name Should Be More Than or Equal to 3 word") ,setLocation("#");
        if (PassWord.length < 4) return setError("Your PassWord Should Be More Than or Equal to 4 word") ,setLocation("#");
        if (RePassWord.value !== UserPassInputRef.current.value) return setError("Passwords do not match. Please make sure your passwords are identical."), setLocation("/#");

        setError("")
    }


    return (
        <>
            <header>
                <button id='light-mod-btn' onClick={ThemeToggle}>
                    <img
                        src={darkMode ? sun : moon}
                        alt={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    />
                </button>
            </header>
            <main>


                <input 
                     type="text"
                     placeholder="User Name"
                     ref={UserNameInputRef}
                     className='sign-in-input' 
                />

                <input type="text"
                 placeholder="Password"
                 ref={UserPassInputRef}
                 className='sign-in-input'
                />

                <input type="text"
                 placeholder="Repet Your Password"
                 ref={UserRePassInputRef}
                 className='sign-in-input'
                />

                <Link to={`/${Location}`}><button onClick={Check}>Submit</button></Link>

            </main>

            <span>Already have an account? <Link to={"/Log-In"}>Log In</Link></span>

        </>

    );
}


export default SignIn