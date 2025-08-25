"use client";

import Link from "next/link";

export default function RegisterSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B2A41] to-[#DEAC34] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Join DonorConnect
          </h1>
          <p className="text-xl text-gray-200">
            Choose how you want to make a difference
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Donor Registration Card */}
          <Link href="/auth/register/donor">
            <div className="bg-white rounded-xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#DEAC34]">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#DEAC34] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-[#1B2A41]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#1B2A41] mb-4">
                  Register as Donor
                </h2>
                <p className="text-gray-600 mb-6">
                  Contribute to educational funding and make a positive impact
                  on students' lives. Your generous donations help bridge the
                  gap for those in need.
                </p>
                <div className="space-y-2 text-left">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-[#DEAC34] rounded-full mr-2"></span>
                    Individual, Corporate, or Institution
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-[#DEAC34] rounded-full mr-2"></span>
                    Track your donation impact
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-[#DEAC34] rounded-full mr-2"></span>
                    Connect directly with recipients
                  </div>
                </div>
                <div className="mt-6">
                  <span className="inline-block bg-[#DEAC34] text-[#1B2A41] px-6 py-2 rounded-full font-semibold">
                    Start Giving →
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Receiver Registration Card */}
          <Link href="/auth/register/receiver">
            <div className="bg-white rounded-xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#1B2A41]">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#1B2A41] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#1B2A41] mb-4">
                  Register as Receiver
                </h2>
                <p className="text-gray-600 mb-6">
                  Seek educational funding support for students, schools, or
                  organizations. Connect with generous donors who want to help.
                </p>
                <div className="space-y-2 text-left">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-[#1B2A41] rounded-full mr-2"></span>
                    NGOs, Schools, Hostels & More
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-[#1B2A41] rounded-full mr-2"></span>
                    Submit funding requests
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-[#1B2A41] rounded-full mr-2"></span>
                    Direct connection with donors
                  </div>
                </div>
                <div className="mt-6">
                  <span className="inline-block bg-[#1B2A41] text-white px-6 py-2 rounded-full font-semibold">
                    Seek Support →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-200 mb-4">Already have an account?</p>
          <Link
            href="/auth/login"
            className="inline-block bg-white text-[#1B2A41] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
}
