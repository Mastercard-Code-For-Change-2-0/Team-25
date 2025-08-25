import Link from "next/link";

export default function DonorPage() {
  return (
    <div>
      <h1>Donor Dashboard</h1>
      <ul>
        <li>
          <Link href="/donor/create-listing">Create Listing</Link>
        </li>
        <li>
          <Link href="/donor/listings">View My Listings</Link>
        </li>
      </ul>
    </div>
  );
}
