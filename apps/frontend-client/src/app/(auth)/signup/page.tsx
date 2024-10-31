"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ChangeEvent, useState } from "react";
//TODO:add the redirect if the login success
export default function Home() {
  const route = useRouter();
  const [object, setObject] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isShow, setIsShow] = useState(true);
  const [data, setData] = useState({});
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(object);
    setObject({ username: "", password: "", email: "" });
    try {
      const response = await fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type
        },
        body: JSON.stringify({
          username: object.username,
          email: object.email,
          password: object.password,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json(); // Handle error response
        throw new Error(errorData.message || "Signup failed");
      }
      const data = await response.json(); // Get the data as JSON

      setData(data);
      console.log(data);
      if (response.ok) {
        route.push("/");
      }
    } catch (error) {
      throw error;
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    // console.log(e.target.value);
    const { name, value } = e.target;
    setObject({ ...object, [name]: value });
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* {data && alert(data.message)} */}
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
        <Image
          className="dark:invert mx-auto"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div className="flex flex-col gap-4 items-centersm:flex-row">
          <form
            // action={""}
            onSubmit={onSubmit}
            className="bg-slate-200 text-blue-600 p-5 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-y-5">
              <input
                type="text"
                className="w-64 h-10 pl-4 rounded-lg text-xl py-5"
                placeholder="username"
                name="username"
                value={object.username}
                onChange={onChange}
              />
              <input
                type="email"
                className="w-64 h-10 pl-4 rounded-lg text-xl py-5"
                placeholder="email"
                name="email"
                value={object.email}
                onChange={onChange}
              />
              <input
                type={isShow ? "text" : "password"}
                className="w-64 h-10 pl-4 rounded-lg text-xl py-5"
                placeholder="password"
                name="password"
                value={object.password}
                onChange={onChange}
              />
            </div>
            <div className="flex gap-1 justify-center items-center">
              <input
                type="checkbox"
                className="size-4"
                onChange={() => setIsShow(!isShow)}
                checked={isShow}
              />
              <span>Show password</span>
            </div>
            <div className="flex">
              <button
                className="text-3xl font-bold rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                rel="noopener noreferrer"
                type="submit"
              >
                SignUp
              </button>
              <button
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                rel="noopener noreferrer"
                onClick={() => route.push("/")}
              >
                Back to Login
              </button>
            </div>
          </form>
          <div className="bg-white p-5 flex gap-x-4 justify-center items-center rounded-full">
            <Image
              src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
              alt=""
              width={50}
              height={50}
            ></Image>
            <Link
              href={
                "https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=https://localhost:8080&client_id=717187757445-jb5hq3qnusnr4spdn4i526df13viv55j.apps.googleusercontent.com"
              }
              className="text-lg text-blue-600"
            >
              SignUp With Google
            </Link>
          </div>
        </div>
      </main>
      {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer> */}
    </div>
  );
}
