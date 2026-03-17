import { useState } from "react"
import type { LoginForm, SignupForm } from "../types";
import { login, signup } from "../lib/fetch";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: ModalProps) {
    if (!isOpen) return null;

    const [loggingIn, setLoggingIn] = useState<boolean>(true);

    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")

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
        try {
            if(loggingIn === true) {
                login(loginPayload(email, password))
            } else {
                signup(signupPayload(firstName, lastName, email, password))
            }
            onLoginSuccess();
        } catch(error) {
            console.error("Error:", error);
        }
    }

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div onClick={(e) => e.stopPropagation()} className="w-[25vw] h-auto p-5 bg-white text-black grid gap-4 rounded">
                <header className="text-xl font-semibold">{loggingIn === true ? "Login" : "Sign Up"}</header>
                <form className="grid gap-8">
                    {loggingIn === false && 
                    <>
                        <input className="border h-[4vh] rounded p-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="First Name" />
                        <input className="border h-[4vh] rounded p-2" value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Last Name" />
                    </>
                    }
                    <input className="border h-[4vh] rounded p-2" value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="UCF Email" />
                    <input className="border h-[4vh] rounded p-2" value={password} onChange={(e) => setPassword(e.target.value)} type="text" placeholder="Password" />
                    {loggingIn === false && 
                    <>
                        <input className="border h-[4vh] rounded p-2" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="text" placeholder="Confirm Password" />
                        {password !== confirmPassword && <div>Passwords Don't match</div>}
                    </>
                    }
                </form>
                <footer className="flex justify-around">
                    <p className="content-center underline text-blue-500" onClick={() => setLoggingIn(!loggingIn)}>{loggingIn === true ? "Create an Account" : "Login"}</p>
                    <button className="bg-orange-500! text-white" onClick={submitForm}>{loggingIn === true ? "Login" : "Sign Up"}</button>
                </footer>
            </div>   
        </div>
    )
}