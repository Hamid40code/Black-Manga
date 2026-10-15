import './SignIn.css'
import React, { useRef, useState, useEffect } from "react";
import sun from "../assets/sun-img.png";
import moon from "../assets/moon-img.png";

function SignIn() {

    const [error, setError] = useState("");
    const [darkMode, setDarkMode] = useState(true)
 
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
        if (UserNameInputRef.current.value.length < 3) return setError("Your Name Should Be More Than or Equal to 3 word");
        if (UserPassInputRef.current.value.length < 4) return setError("Your PassWord Should Be More Than or Equal to 4 word");
        if (UserRePassInputRef.current.value !== UserPassInputRef.current.value) return setError("Passwords do not match. Please make sure your passwords are identical.");

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


                <input type="text" placeholder="User Name" ref={UserNameInputRef} className='sign-in-input' />
                <input type="text" placeholder="Password" ref={UserPassInputRef} className='sign-in-input' />
                <input type="text" placeholder="Repet Your Password" ref={UserRePassInputRef} className='sign-in-input' />
                <button onClick={Check}>Submit</button>

            </main>

            <span>Already have an account? <a href="">Log In</a></span>

        </>

    );
}


export default SignIn