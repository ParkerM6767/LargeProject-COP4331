import { useContext, useState } from "react";
import { Button } from "./ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Field, FieldGroup } from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { submitPost } from "../lib/fetch";
import { PostContext } from "../lib/postContext";

async function uploadPost(payload: EventForm) {
  // TODO: verify the post was submitted and have error feedback
  await submitPost(payload);
}

export function AddEventModal({
  longitude = 0,
  latitude = 0,
  closeModal,
}: {
  longitude: number | null;
  latitude: number | null;
  closeModal: () => void;
}) {
  const [title, setTitle] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [isSending, setSending] = useState(false);
  const { refetch } = useContext(PostContext);

  return (
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
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                value={longitude || "Loading..."}
                disabled
                id="longitude"
              />
              <Label htmlFor="latitude">Latitude</Label>
              <Input value={latitude || "Loading..."} disabled id="latitude" />
            </Field>
            <Field>
              <Label>Upload Image</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                type="file"
                accept="image/*"
              />
            </Field>
            <Field>
              <Label htmlFor="description">Post Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                className="h-[10vh]"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={isSending}
              onClick={() => {
                // Prevent multiple clicks at once
                setSending(true);

                uploadPost({
                  title,
                  longitude: longitude || 0,
                  latitude: latitude || 0,
                  imageUrl,
                  description,
                })
                  // Close the modal when sent
                  .then(closeModal)
                  // Once posted, update all posts
                  .then(refetch)
                  // Un-disable the button
                  .finally(() => setSending(false));
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </>
  );
}
