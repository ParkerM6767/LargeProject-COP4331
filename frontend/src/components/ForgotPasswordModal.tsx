import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input"
import { forgotPassword } from "../lib/fetch";
import { Field } from "./ui/field";
import { Label } from "./ui/label";

interface PasswordModalProps {
  setResetOpen: (open: boolean) => void;
}

export function ForgotPasswordModal({setResetOpen} : PasswordModalProps) {
  const [email, setEmail] = useState<string>("");

  function resetPassword() {
    try {
        forgotPassword(email)
    }   catch (error) {
        console.error("Error:", error);
    }
    setResetOpen(false);
  }

  return (
    <>
      <DialogContent className="z-1060 grid gap-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Reset Password
          </DialogTitle>
          <DialogDescription className="hidden"/>
        </DialogHeader>
        <Field>
            <Label>Please enter email to reset password</Label>
            <Input
                className="border rounded p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
            />
        </Field>
        <DialogFooter className="flex flex-row sm:justify-between">
          <Button
            className="py-2 px-4 rounded text-sm w-full"
            onClick={resetPassword}
            type="submit"
          >
            Send reset link
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
