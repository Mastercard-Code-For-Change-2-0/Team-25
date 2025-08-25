"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthService from "@/lib/authService";

export default function DonorRegister() {
  const router = useRouter();
  const [donorType, setDonorType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateAadhaar = (num: string) => /^\d{12}$/.test(num);
  const validateMobile = (num: string) => /^\d{10}$/.test(num);
  const validateZipcode = (code: string) => /^\d{5,6}$/.test(code);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!donorType) {
        setError("Please select donor type");
        return;
      }
      if (!email || !password) {
        setError("Please enter email and password");
        return;
      }
      if (!validateAadhaar(aadhaar)) {
        setError("Please enter valid 12-digit Aadhaar number");
        return;
      }
      if (!stateVal || !city || !address) {
        setError("Please enter state, city, and address");
        return;
      }
      if (!validateZipcode(zipcode)) {
        setError("Please enter a valid zipcode");
        return;
      }
      if (!validateMobile(mobile)) {
        setError("Please enter a valid 10-digit mobile number");
        return;
      }

      const userData = {
        email,
        password,
        role: "donor",
        donorType,
        aadhaar,
        state: stateVal,
        city,
        zipcode,
        address,
        mobile,
      };

      const response = await AuthService.register(userData);

      if (response.success && response.user) {
        // Redirect to donor dashboard
        router.push("/donor-dashboard");
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left gold panel */}
      <div className="hidden md:flex w-1/2 bg-[#DEAC34] items-center justify-center">
        <div className="text-center p-8">
          <img
            src="https://sevasahayog.org/wp-content/uploads/2023/03/Group-6399_1.webp"
            alt="Donor-Connect Icon"
            className="w-80 h-80 object-contain mx-auto mb-6"
          />
          <h2 className="text-3xl font-bold text-[#1B2A41] mb-4">
            Become a Donor
          </h2>
          <p className="text-lg text-[#1B2A41]">
            Join our community of generous donors making a difference in
            students' lives
          </p>
        </div>
      </div>

      {/* Right navy panel with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#1B2A41] p-6">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6 text-[#1B2A41]">
            Donor Registration
          </h2>

          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              <span className="block mb-1 font-medium text-gray-700">
                Donor Type
              </span>
              <select
                value={donorType}
                onChange={(e) => setDonorType(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#DEAC34] focus:ring-1 focus:ring-[#DEAC34]"
                required
              >
                <option value="">-- Select Donor Type --</option>
                <option value="individual">Individual</option>
                <option value="corporate">Corporate</option>
                <option value="institution">Institution</option>
              </select>
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium text-gray-700">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#DEAC34] focus:ring-1 focus:ring-[#DEAC34]"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium text-gray-700">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#DEAC34] focus:ring-1 focus:ring-[#DEAC34]"
                minLength={6}
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium text-gray-700">
                Aadhaar Number
              </span>
              <input
                type="text"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#DEAC34] focus:ring-1 focus:ring-[#DEAC34]"
                maxLength={12}
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium text-gray-700">
                State
              </span>
              <input
                type="text"
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#DEAC34] focus:ring-1 focus:ring-[#DEAC34]"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium text-gray-700">City</span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#DEAC34] focus:ring-1 focus:ring-[#DEAC34]"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium text-gray-700">
                Zipcode
              </span>
              <input
                type="text"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#DEAC34] focus:ring-1 focus:ring-[#DEAC34]"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium text-gray-700">
                Address
              </span>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#DEAC34] focus:ring-1 focus:ring-[#DEAC34]"
                rows={3}
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium text-gray-700">
                Mobile Number
              </span>
              <input
                type="text"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#DEAC34] focus:ring-1 focus:ring-[#DEAC34]"
                required
              />
            </label>

            {error && <p className="text-red-600 my-2 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#DEAC34] hover:bg-yellow-400 disabled:bg-gray-400 disabled:cursor-not-allowed text-[#1B2A41] font-bold py-2 rounded transition"
            >
              {loading ? "Registering..." : "Register as Donor"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-[#DEAC34] hover:underline font-medium"
              >
                Login here
              </a>
            </p>
            <p className="text-gray-600 mt-2">
              Looking for funding?{" "}
              <a
                href="/auth/register/receiver"
                className="text-[#1B2A41] hover:underline font-medium"
              >
                Register as Receiver
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
