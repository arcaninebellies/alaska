"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiFillCamera } from "react-icons/ai";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
interface User {
  id: number;
  username: string;
  avatar: string;
  newAvatar: string;
  description: string;
}

export default function Settings() {
  const [user, setUser] = useState<User>(null!);
  const router = useRouter();
  const [avatar, setAvatar] = useState("");
  const [cropper, setCropper] = useState<string>(null!);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("/api/user/")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      });
  }, []);

  const onCropProfile = () => {
    const cropper = cropperRef.current?.cropper;
    if (typeof cropper !== "undefined") {
      setCropper(cropper?.getCroppedCanvas().toDataURL());
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsOpen(true);
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const submit = () => {
    const form = new FormData();
    if (cropper) form.append("avatar", cropper);
    form.append("username", user.username);
    form.append("description", user.description);
    fetch("/api/user", {
      method: "POST",
      body: form,
    }).then(() => router.push(`/user/${user.username}`));
  };

  return (
    <>
      {user && (
        <div className="flex flex-col p-24 items-center justify-start content-start bg-slate-100 min-h-screen w-full text-black">
          <p className="text-2xl">Update Settings</p>
          {avatar && (
            <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Avatar</DialogTitle>
                  <DialogDescription>
                    Crop your avatar to your liking
                  </DialogDescription>
                </DialogHeader>
                <Cropper
                  src={avatar}
                  style={{ height: 400, width: "100%" }}
                  initialAspectRatio={1}
                  aspectRatio={1}
                  guides={true}
                  ref={cropperRef}
                  crop={onCropProfile}
                  movable={false}
                  rotatable={false}
                  scalable={false}
                />
                <button
                  className="bg-sky-500 mt-4 p-4"
                  onClick={() => setIsOpen(false)}
                >
                  Save
                </button>
              </DialogContent>
            </Dialog>
          )}
          <label htmlFor="profile">
            {cropper && !isOpen ? (
              <>
                <Image
                  src={cropper}
                  alt={user.username}
                  width={100}
                  height={100}
                  className="m-2 border-slate-950  rounded-full border-solid border-2 cursor-pointer"
                />
                <div className="relative">
                  <AiFillCamera className="w-6 h-6 -top-10 absolute rounded-full m-4 p-1 border-none" />
                </div>
              </>
            ) : (
              <>
                <Image
                  src={`https://cdn.notblizzard.dev/alaska/avatars/${user.avatar}.png`}
                  alt={user.username}
                  width={100}
                  height={100}
                  className="m-2 border-slate-950  rounded-full border-solid border-2 cursor-pointer"
                />
                <div className="relative">
                  <AiFillCamera className="w-6 h-6 -top-10 absolute  rounded-full m-4 p-1 border-none" />
                </div>
              </>
            )}
          </label>
          <input
            id="profile"
            type="file"
            name="profile"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleProfileChange}
            className="file:bg-gray-800 hidden file:text-white file:border file:border-none w-full border border-gray-700 cursor-pointer bg-gray-50 dark:bg-gray-700"
          />
          <label htmlFor="username">Username</label>
          <Input
            name="username"
            id="username"
            size={50}
            type="text"
            placeholder="Username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />{" "}
          <label htmlFor="description">Description</label>
          <Textarea
            rows={10}
            value={user.description}
            placeholder="Description"
            onChange={(e) => setUser({ ...user, description: e.target.value })}
          />
          <button
            onClick={() => submit()}
            className="bg-emerald-400/75 rounded-lg p-4 text-slate-100 hover:bg-emerald-400 m-4"
          >
            Save
          </button>
        </div>
      )}
    </>
  );
}
