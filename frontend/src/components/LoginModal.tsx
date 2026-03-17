import { useState } from "react"

export function LoginModal() {
    const [loggingIn, setLoggingIn] = useState<boolean>(true);

    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")

    interface LoginForm {
        email: string,
        password:string
    }
    interface SignupForm extends LoginForm{
        firstName: string,
        lastName: string
    }

    function signupPayload(firstName: string, lastName: string, email: string, password: string): SignupForm {
        const payload = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }
        return payload
    }

    function loginPayload(email: string, password: string): LoginForm {
        const payload = {
            email: email,
            password: password
        }
        return payload
    }

    function submitForm() {
        if(loggingIn === true) {
            console.log(loginPayload(email, password))
        } else {
            console.log(signupPayload(firstName, lastName, email, password))
        }
    }

    return (
        <div className="w-[15vw] h-auto p-5 bg-white text-black grid gap-4">
            <header className="text-xl font-semibold">{loggingIn === true ? "Login" : "Sign Up"}</header>
            <form className="grid gap-4">
                {loggingIn === false && 
                <>
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="First Name" />
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Last Name" />
                </>
                }
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="UCF Email" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" placeholder="Password" />
                {loggingIn === false && 
                <>
                    <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="text" placeholder="Confirm Password" />
                    {password !== confirmPassword && <div>Passwords Don't match</div>}
                </>
                }
            </form>
            <footer>
                <button onClick={() => setLoggingIn(!loggingIn)}>{loggingIn === true ? "Sign Up" : "Login"}</button>
                <button onClick={submitForm}>{loggingIn === true ? "Login" : "Sign Up"}</button>
            </footer>
        </div>
    )
}