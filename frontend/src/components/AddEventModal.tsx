import { useState } from "react";
import { Button } from "./ui/button"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "./ui/dialog";
import { Field, FieldGroup } from "./ui/field"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea";
import { submitPost } from "../lib/fetch";

interface AddEventModalProps {
  setPostingOpen: (open: boolean) => void;
  geoLocation: {
    coords: { lat: number; lng: number } | null
  }
}

export function AddEventModal({setPostingOpen, geoLocation: {coords}} :AddEventModalProps) {
    const [title, setTitle] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

async function uploadPost(title: string, imageFile: File | null, description: string) {
    try {
        setErrorMessage('');
        const formData = new FormData();
        formData.append("title", title);
        formData.append("longitude", String(coords?.lng));
        formData.append("latitude", String(coords?.lat));
        formData.append("description", description);
        if (imageFile) {
            formData.append("image", imageFile);
        }
        await submitPost(formData);
        setPostingOpen(false);
    } catch (error: any) {
        console.error("Upload Failed:", error);
        setErrorMessage(error?.message || "Failed to create post");
    }
}

    return(
        <>
            <form>
                <DialogContent className="z-1060">
                    <DialogHeader>
                        <DialogTitle>Create Post</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="post-title">Post Title</Label>
                            <Input
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)}
                                type="text"
                                id="post-title"
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="username-1">Upload Image</Label>
                            <Input
                                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                                type="file"
                                id="image-upload"
                                accept="image/*"
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="username-1">Post Description</Label>
                            <Textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                id="username-1" 
                                className="h-[10vh]"
                            />
                        </Field>
                    </FieldGroup>
                    {errorMessage && (
                        <div className="flex justify-center text-red-500">
                            <p>{errorMessage}</p>
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={() => uploadPost(title, imageFile, description)}>Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </>
    )
}