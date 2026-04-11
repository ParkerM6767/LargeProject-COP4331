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
import { verify } from "../lib/fetch";
import { Field } from "./ui/field";
import { Label } from "./ui/label";

interface EmailModalProps {
  setOpen: (open: boolean) => void;
}

export function VerifyEmailModal({setOpen} : EmailModalProps) {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  function verifyEmail() {
    try {
        verify(email, verificationCode)
    }   catch (error) {
        console.error("Error:", error);
    }
    setOpen(false);
  }

  return (
    <>
      <DialogContent className="z-1060 grid gap-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Email Verification
          </DialogTitle>
          <DialogDescription className="hidden"/>
        </DialogHeader>
        <Field>
            <Label>Email</Label>
            <Input
                className="border rounded p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
            />
        </Field>
        <Field>
            <Label>Verification Code</Label>
            <Input
                className="border rounded p-2"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                type="text"
            />
        </Field>
        <DialogFooter className="flex flex-row sm:justify-between">
          <Button
            className="py-2 px-4 rounded text-sm w-full"
            onClick={verifyEmail}
            type="submit"
          >
            Verify Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
