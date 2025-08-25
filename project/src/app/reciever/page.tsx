import Link from "next/link";

export default function RecieverPage() {
  return (
    <div>
      <h1>Reciever Dashboard</h1>
      <ul>
        <li>
          <Link href="/reciever/create-request">Create Request</Link>
        </li>
        <li>
          <Link href="/reciever/requests">View My Requests</Link>
        </li>
      </ul>
    </div>
  );
}
