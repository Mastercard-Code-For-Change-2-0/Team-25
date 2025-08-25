'use client';

import { useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

type Role = "individual" | "corporate" | "institution" | "donor" | "receiver" | "";

export default function Register() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<Role>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  // Autofill and lock the role from URL on mount
  useEffect(() => {
    const qRole = searchParams.get('role');
    if (
      qRole === "donor" ||
      qRole === "receiver" ||
      qRole === "individual" ||
      qRole === "corporate" ||
      qRole === "institution"
    ) {
      setRole(qRole as Role);
    }
  }, [searchParams]);

  const validateAadhaar = (num: string) => /^\d{12}$/.test(num);
  const validateMobile = (num: string) => /^\d{10}$/.test(num);
  const validateZipcode = (code: string) => /^\d{5,6}$/.test(code);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    if (!role) {
      setError("Please select a role");
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
    alert(`Registered successfully as ${role}.`);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left gold panel */}
      <div className="hidden md:block w-1/2 bg-[#DEAC34]">
        <img
          src="https://sevasahayog.org/wp-content/uploads/2023/03/Group-6399_1.webp"
          alt="Donor-Connect Icon"
          className="w-288 h-288 object-contain"
        />
      </div>
      {/* Right navy panel with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#1B2A41] p-6">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6 text-[#1B2A41]">Register</h2>
          
          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              <span className="block mb-1 font-medium">Select Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full border rounded px-3 py-2"
                required
                disabled={["donor", "receiver"].includes(role)}
              >
                <option value="">-- Select Role --</option>
                <option value="individual">Individual</option>
                <option value="corporate">Corporate</option>
                <option value="institution">Institution</option>
                <option value="donor">Donor</option>
                <option value="receiver">Receiver</option>
              </select>
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                minLength={6}
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium">Aadhaar Number</span>
              <input
                type="text"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                className="w-full border rounded px-3 py-2"
                maxLength={12}
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium">State</span>
              <input
                type="text"
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium">City</span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium">Zipcode</span>
              <input
                type="text"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium">Address</span>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={3}
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1 font-medium">Mobile Number</span>
              <input
                type="text"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </label>

            {error && <p className="text-red-600 my-2">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#DEAC34] hover:bg-yellow-400 text-[#1B2A41] font-bold py-2 rounded transition"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
