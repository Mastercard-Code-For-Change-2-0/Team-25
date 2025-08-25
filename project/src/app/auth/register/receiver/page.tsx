"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthService from "@/lib/authService";

export default function ReceiverRegister() {
  const router = useRouter();
  const [receiverSubtype, setReceiverSubtype] = useState("");
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
      if (!receiverSubtype) {
        setError("Please select receiver type");
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
        role: "student", // Map receiver to student for backend
        receiverSubtype,
        aadhaar,
        state: stateVal,
        city,
        zipcode,
        address,
        mobile,
      };

      const response = await AuthService.register(userData);

      if (response.success && response.user) {
        // Redirect to student dashboard
        router.push("/student-dashboard");
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
      {/* Left navy panel */}
      <div className="hidden md:flex w-1/2 bg-[#1B2A41] items-center justify-center">
        <div className="text-center p-8">
          <img
            src="https://sevasahayog.org/wp-content/uploads/2023/03/Group-6399_1.webp"
            alt="Receiver-Connect Icon"
            className="w-80 h-80 object-contain mx-auto mb-6 filter brightness-0 invert"
          />
          <h2 className="text-3xl font-bold text-white mb-4">Seek Support</h2>
          <p className="text-lg text-gray-200">
            Connect with generous donors to fund your educational journey
          </p>
        </div>
      </div>

      {/* Right gold panel with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#DEAC34] p-6">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6 text-[#1B2A41]">
            Receiver Registration
          </h2>

          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              <span className="block mb-1 font-medium text-gray-700">
                Organization Type
              </span>
              <select
                value={receiverSubtype}
                onChange={(e) => setReceiverSubtype(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#1B2A41] focus:ring-1 focus:ring-[#1B2A41]"
                required
              >
                <option value="">-- Select Organization Type --</option>
                <option value="NGO">NGO</option>
                <option value="Schools">Schools</option>
                <option value="Hostels">Hostels</option>
                <option value="Old age homes">Old age homes</option>
                <option value="Community organization">
                  Community organization
                </option>
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
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#1B2A41] focus:ring-1 focus:ring-[#1B2A41]"
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
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#1B2A41] focus:ring-1 focus:ring-[#1B2A41]"
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
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#1B2A41] focus:ring-1 focus:ring-[#1B2A41]"
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
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#1B2A41] focus:ring-1 focus:ring-[#1B2A41]"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium text-gray-700">City</span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#1B2A41] focus:ring-1 focus:ring-[#1B2A41]"
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
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#1B2A41] focus:ring-1 focus:ring-[#1B2A41]"
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
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#1B2A41] focus:ring-1 focus:ring-[#1B2A41]"
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
                className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:border-[#1B2A41] focus:ring-1 focus:ring-[#1B2A41]"
                required
              />
            </label>

            {error && <p className="text-red-600 my-2 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B2A41] hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 rounded transition"
            >
              {loading ? "Registering..." : "Register as Receiver"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-[#1B2A41] hover:underline font-medium"
              >
                Login here
              </a>
            </p>
            <p className="text-gray-600 mt-2">
              Want to donate?{" "}
              <a
                href="/auth/register/donor"
                className="text-[#DEAC34] hover:underline font-medium"
              >
                Register as Donor
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
