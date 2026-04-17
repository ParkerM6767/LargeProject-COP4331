import { useState, useMemo } from "react";
import { forgotPassword, login, signup } from "../lib/fetch";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner"

interface ModalProps {
  onLoginSuccess: (user: { firstName: string; lastName: string, email: string }) => void;
  onLoginFailure: (email: string) => void;
  setVerifyOpen: (open: boolean) => void;
  setLoginOpen: (open: boolean) => void;
  setResetOpen: (open: boolean) => void;
}

export function LoginModal({ onLoginSuccess, onLoginFailure, setVerifyOpen, setLoginOpen}: ModalProps) {
  const [loggingIn, setLoggingIn] = useState<boolean>(true);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const disabled = useMemo(() => {
    if (loggingIn) {
      return email === "" || password === "" || !email.endsWith("@ucf.edu");
    }
    return firstName === "" || lastName === "" || email === "" || password === "" || password !== confirmPassword;
  }, [loggingIn, firstName, lastName, email, password, confirmPassword]);

  function loginPayload(email: string, password: string): LoginForm {
    const payload = {
      email: email,
      password: password,
    };
    return payload;
  }

  function signupPayload(firstName: string, lastName: string, email: string, password: string): SignupForm {
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password
    }
    return payload
  }

  async function submitForm() {
    if (!email.endsWith("@ucf.edu")) {
      setErrorMessage("Invalid email. Please use your UCF email.");
      return;
    }
    try {
      let data;
      if (loggingIn === true) {
        data = await login(loginPayload(email, password));
        onLoginSuccess({ firstName: data.firstName, lastName: data.lastName, email: data.email });
      } else {
        data = await signup(signupPayload(firstName, lastName, email, password));
        onLoginFailure(email);
        setLoginOpen(false);
        setVerifyOpen(true);
      }
    } catch (error: any) {
      setErrorMessage(error.message)
      if (error.status === 403 || error.response?.status === 403) {
        setLoginOpen(false);
        setVerifyOpen(true);
      } else if (!email.endsWith("@ucf.edu")) {
        setErrorMessage("Invalid email. Please use your UCF email.");
      } 
      onLoginFailure(email);
      console.error("Error:", error.message);
    }
  }

  function sendResetLink() {
    setLoginOpen(false)
    forgotPassword(email);
    toast.success("Reset link has been sent to email if it exists", { position: "top-center" })
  }

  return (
    <>
      <DialogContent className="z-1060 grid gap-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {loggingIn === true ? "Login" : "Sign Up"}
          </DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="flex justify-center text-red-500">
            <p>{errorMessage}</p>
          </div>
        )}
        {loggingIn === false && (
          <>
            <input
              className="border rounded p-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              placeholder="First Name"
            />
            <input
              className="border rounded p-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              placeholder="Last Name"
            />
          </>
        )}
        <input
          className="border rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="UCF Email"
        />
        <input
          className="border rounded p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        {errorMessage === "invalid password" && (
          <a 
            className="underline text-blue-500 select-none" 
            href="#"
            onClick={sendResetLink}
          >
            Forgot password?
          </a>
        )}
        {loggingIn === false && (
          <>
            <input
              className="border rounded p-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm Password"
            />
            {password !== confirmPassword && <div>Passwords Don't match</div>}
          </>
        )}
        <DialogFooter className="flex flex-row sm:justify-between">
          <p
            className="content-center underline text-blue-500 select-none"
            onClick={() => setLoggingIn(!loggingIn)}
          >
            {loggingIn === true ? "Create an Account" : "Login"}
          </p>
          <Button
            className="py-2 px-4 rounded text-sm"
            onClick={submitForm}
            disabled={disabled}
          >
            {loggingIn === true ? "Login" : "Sign Up"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
