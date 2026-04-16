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
import { Field } from "./ui/field";
import { Label } from "./ui/label";
import { updatePassword } from "../lib/fetch";

interface PasswordModalProps {
  setResetOpen: (open: boolean) => void,
  resetToken: string | null
}

export function ForgotPasswordModal({setResetOpen, resetToken} : PasswordModalProps) {
  const [password, setPassword] = useState<string>('');

  function resetPassword() {
    try {
        updatePassword(resetToken, password);
    }   catch (error: any) {
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
            <Label>Please enter new password</Label>
            <Input
                className="border rounded p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="text"
            />
        </Field>
        <DialogFooter className="flex flex-row sm:justify-between">
          <Button
            className="py-2 px-4 rounded text-sm w-full"
            onClick={resetPassword}
            type="submit"
          >
            Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
