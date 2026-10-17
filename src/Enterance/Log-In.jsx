
import './Entering.css'
import React, { useRef, useState, useEffect } from "react";
import sun from "../assets/sun-img.png";
import moon from "../assets/moon-img.png";
import { Link } from 'react-router-dom';

function Login() {

    const [error, setError] = useState("");
    const [darkMode, setDarkMode] = useState(true)
 
    const UserNameInputRef = useRef(null);
    const UserPassInputRef = useRef(null);

     function ThemeToggle() {
        setDarkMode(prev => !prev);
    }

    useEffect(() => {
        document.body.className = darkMode
            ? "root-dark"
            : "root-light";
    }, [darkMode]);


    function Check() {
        if (UserNameInputRef.current.value.length < 3) return setError("Your Name Should Be More Than or Equal to 3 word");
        if (UserPassInputRef.current.value.length < 4) return setError("Your PassWord Should Be More Than or Equal to 4 word");

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


                <input type="text" placeholder="User Name" ref={UserNameInputRef} className='log-in-input' />
                <input type="text" placeholder="Password" ref={UserPassInputRef} className='log-in-input' />
                <Link to={"/Shop"}><button onClick={Check}>Submit</button></Link>

            </main>

            <span className='text'>Don't have an account? <Link to={"/"}>Create Account</Link></span>

        </>

    );
}


export default Login