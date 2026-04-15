import { useEffect, useState } from "react";
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
  passedEmail: string;
}

export function VerifyEmailModal({setOpen, passedEmail} : EmailModalProps) {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [email, setEmail] = useState<string>(passedEmail);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setEmail(passedEmail);
  }, [passedEmail]);

  async function verifyEmail() {
    try {
        await verify(email, verificationCode);
        setOpen(false);
    }   catch (error: any) {
        console.log(error.message)
        setErrorMessage(error.message);
        console.error("Error:", error);
    }
  }

  return (
    <>
      <DialogContent className="z-1060 grid gap-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Check inbox for code
          </DialogTitle>
          <DialogDescription className="hidden"/>
        </DialogHeader>
        {errorMessage && (
          <Field className="flex text-center text-red-500">
            <p>{errorMessage}</p>
          </Field>
        )}
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
