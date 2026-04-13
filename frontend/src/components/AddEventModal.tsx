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

function uploadPost(
    title: string,
    longitude: number,
    latitude: number,
    imageFile: File | null,
    description: string
) {
    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("longitude", String(longitude));
        formData.append("latitude", String(latitude));
        formData.append("description", description);
        if (imageFile) {
            formData.append("image", imageFile);
        }
        submitPost(formData);
    } catch (error) {
        console.error("Upload Failed:", error);
    }
}
export function AddEventModal() {
    const [title, setTitle] = useState<string>('');
    const [longitude, setLongitude] = useState<number>(0);
    const [latitude, setLatitude] = useState<number>(0);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>('');

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
                            <Label htmlFor="name-1">Longitude</Label>
                            <Input
                                value={longitude} 
                                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                                type="number"
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="name-1">Latitude</Label>
                            <Input
                                value={latitude} 
                                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                                type="number"
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
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={() => uploadPost(title, longitude, latitude, imageFile, description)}>Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </>
    )
}