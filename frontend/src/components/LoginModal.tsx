import { useState } from "react";
import { login, signup } from "../lib/fetch";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface ModalProps {
  onLoginSuccess: (user: { firstName: string; lastName: string }) => void;
}

export function LoginModal({ onLoginSuccess }: ModalProps) {
  const [loggingIn, setLoggingIn] = useState<boolean>(true);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  function loginPayload(email: string, password: string): LoginForm {
    const payload = {
      email: email,
      password: password,
    };
    return payload;
  }

  function signupPayload(firstName: string, lastName: string, email: string, password: string): SignupForm {
    // Confirm that email string has an @ucf.edu
    if (!email.endsWith("@ucf.edu")) {
      // Remove this alert later; only for testing atm
      alert("You need a valid ucf.edu email in order to sign up.");
      throw new Error("Invalid email. Please use your UCF email.");
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password
    }
    return payload
  }

  async function submitForm() {
    try {
      let data;
      if (loggingIn === true) {
        data = await login(loginPayload(email, password));
      } else {
        data = await signup(signupPayload(firstName, lastName, email, password));
      }
      onLoginSuccess({ firstName: data.firstName, lastName: data.lastName });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <>
      <DialogContent className="z-1060 grid gap-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {loggingIn === true ? "Login" : "Sign Up"}
          </DialogTitle>
        </DialogHeader>

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
          >
            {loggingIn === true ? "Login" : "Sign Up"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
