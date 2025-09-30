"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";

export default function SignUpPage() {
  // const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-100 via-white to-indigo-50 relative overflow-hidden">
      <div className="absolute w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-80 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-md">
        <SignUp.Root>
          {/* Step 1: Basic Credentials */}
          <SignUp.Step
            name="start"
            className="w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 border border-gray-100"
          >
            <div className="text-center space-y-2">
              <Image
                src="/Vidyarth_main.png"
                alt="Vidyarth Logo"
                width={150}
                height={90}
                priority
                className="mx-auto drop-shadow-md"
              />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
                Create Account
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Join Vidyarth today 🎉
              </p>
            </div>

            <Clerk.GlobalError className="text-sm text-red-500" />

            <Clerk.Field name="emailAddress">
              <Clerk.Label className="block text-sm font-medium text-gray-700">
                Email
              </Clerk.Label>
              <Clerk.Input
                type="email"
                required
                placeholder="you@example.com"
                className="mt-1 w-full border rounded-lg p-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <Clerk.FieldError className="text-red-600 text-xs mt-1" />
            </Clerk.Field>

            <Clerk.Field name="password">
              <Clerk.Label className="block text-sm font-medium text-gray-700">
                Password
              </Clerk.Label>
              <Clerk.Input
                type="password"
                required
                placeholder="••••••••"
                className="mt-1 w-full border rounded-lg p-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <Clerk.FieldError className="text-red-600 text-xs mt-1" />
            </Clerk.Field>

            <SignUp.Action
              submit
              className="mt-6 w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Continue
            </SignUp.Action>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Clerk.Link
                navigate="sign-in"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Sign in
              </Clerk.Link>
            </p>
          </SignUp.Step>

          {/* Step 2: Email Verification */}
          <SignUp.Step
            name="verifications"
            className="w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 border border-gray-100"
          >
            <h1 className="text-lg sm:text-xl font-semibold text-center text-gray-800">
              Verify Your Email
            </h1>
            <p className="text-sm text-gray-500 text-center">
              We&apos;ve sent a code to your email 📩
            </p>
            <Clerk.GlobalError className="text-sm text-red-500" />

            <SignUp.Strategy name="email_code">
              <Clerk.Field name="code">
                <Clerk.Label className="block text-sm font-medium text-gray-700">
                  Verification Code
                </Clerk.Label>
                <Clerk.Input
                  type="otp"
                  required
                  placeholder="123456"
                  className="mt-1 w-full border rounded-lg p-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition tracking-widest text-center"
                />
                <Clerk.FieldError className="text-red-600 text-xs mt-1" />
              </Clerk.Field>

              <SignUp.Action
                submit
                className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
              >
                Verify
              </SignUp.Action>
            </SignUp.Strategy>
          </SignUp.Step>

          {/* Step 3: Collect User Profile Info */}
          <SignUp.Step
            name="continue"
            className="w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 border border-gray-100"
          >
            <h1 className="text-lg sm:text-xl font-semibold text-center text-gray-800">
              Complete Your Profile
            </h1>
            <Clerk.GlobalError className="text-sm text-red-500" />

            {/* Full Name */}
            <Clerk.Field name="username">
              <Clerk.Label className="block text-sm font-medium text-gray-700">
                Full Name
              </Clerk.Label>
              <Clerk.Input
                type="text"
                required
                placeholder="John Doe"
                className="mt-1 w-full border rounded-md p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </Clerk.Field>

            {/* College Name */}
            <Clerk.Field name="college_name">
              <Clerk.Label className="block text-sm font-medium text-gray-700">
                College Name
              </Clerk.Label>
              <Clerk.Input
                type="text"
                required
                placeholder="XYZ University"
                className="mt-1 w-full border rounded-md p-2"
              />
            </Clerk.Field>

            {/* Course */}
            <Clerk.Field name="course">
              <Clerk.Label className="block text-sm font-medium text-gray-700">
                Course
              </Clerk.Label>
              <Clerk.Input
                type="text"
                required
                placeholder="B.Tech CSE"
                className="mt-1 w-full border rounded-md p-2"
              />
            </Clerk.Field>

            {/* Year */}
            <Clerk.Field name="year">
              <Clerk.Label className="block text-sm font-medium text-gray-700">
                Year
              </Clerk.Label>
              <Clerk.Input
                type="number"
                min="1"
                max="5"
                required
                placeholder="3"
                className="mt-1 w-full border rounded-md p-2"
              />
            </Clerk.Field>

            {/* Phone */}
            <Clerk.Field name="phone_number">
              <Clerk.Label className="block text-sm font-medium text-gray-700">
                Phone Number
              </Clerk.Label>
              <Clerk.Input
                type="tel"
                placeholder="+91 9876543210"
                className="mt-1 w-full border rounded-md p-2"
              />
            </Clerk.Field>

            {/* Bio */}
            <Clerk.Field name="bio">
              <Clerk.Label className="block text-sm font-medium text-gray-700">
                Bio
              </Clerk.Label>
              <Clerk.Input
                type="text"
                placeholder="Tell us something about yourself"
                className="mt-1 w-full border rounded-md p-2"
              />
            </Clerk.Field>

            {/* Profile Picture */}
            <Clerk.Field name="profile_pic_url">
              <Clerk.Label className="block text-sm font-medium text-gray-700">
                Profile Picture URL
              </Clerk.Label>
              <Clerk.Input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                className="mt-1 w-full border rounded-md p-2"
              />
            </Clerk.Field>

            <SignUp.Action
              submit
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
            >
              Finish Registration
            </SignUp.Action>
          </SignUp.Step>
        </SignUp.Root>
      </div>
    </div>
  );
}
