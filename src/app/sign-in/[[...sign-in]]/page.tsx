"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";

export default function SignInPage() {
  // const { signOut } = useClerk();
  // const router = useRouter();

  // Example function you can call if needed
  // const handleInvalidUser = async () => {
  //   await signOut();
  //   toast.error("Invalid user. Please sign in with a valid account.");
  //   router.replace("/sign-in");
  // };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-100 via-white to-indigo-50 relative overflow-hidden">
      <div className="absolute w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-80 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative mx-auto w-full max-w-md">
        <SignIn.Root>
          <SignIn.Step
            name="start"
            className="w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-100"
          >
            <div className="text-center space-y-3">
              <Image
                src="/Vidyarth_main.png"
                alt="Vidyarth Logo"
                width={150}
                height={90}
                priority
                className="mx-auto drop-shadow-md"
              />
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm">
                Sign in to continue your journey 🚀
              </p>
            </div>

            {/* Clerk form */}
            <Clerk.Field name="identifier">
              <Clerk.Label className="block text-sm font-medium text-gray-700">
                Email
              </Clerk.Label>
              <Clerk.Input
                type="email"
                required
                placeholder="you@example.com"
                className="mt-1 w-full border rounded-lg p-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <Clerk.FieldError className="text-red-600 text-xs mt-1" />
            </Clerk.Field>

            <Clerk.Field name="password" className="mt-4">
              <Clerk.Label className="block text-sm font-medium text-gray-700">
                Password
              </Clerk.Label>
              <Clerk.Input
                type="password"
                required
                placeholder="••••••••"
                className="mt-1 w-full border rounded-lg p-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <Clerk.FieldError className="text-red-600 text-xs mt-1" />
            </Clerk.Field>

            <SignIn.Action
              submit
              className="mt-6 w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Sign In
            </SignIn.Action>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-2 text-gray-400 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <Clerk.Connection
              name="google"
              className="w-full flex items-center justify-center gap-2 border py-2.5 rounded-lg bg-white shadow-sm hover:bg-gray-50 hover:shadow-md transition cursor-pointer"
            >
              <Image src="/google.png" alt="Google logo" width={18} height={18} />
              <span className="font-medium text-gray-700">Continue with Google</span>
            </Clerk.Connection>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{" "}
              <Clerk.Link
                navigate="sign-up"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Sign up
              </Clerk.Link>
            </p>
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  );
}
