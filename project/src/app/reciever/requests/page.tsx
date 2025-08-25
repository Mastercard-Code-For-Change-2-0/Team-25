import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RecieverRequests() {
  const { data, error } = useSWR("/api/listed-requests", fetcher);

  return (
    <div>
      <h2>My Requests</h2>
      {error && <div>Error loading requests</div>}
      {!data ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data.requests && data.requests.length > 0 ? (
            data.requests.map((req: any) => (
              <li key={req._id}>
                {req.title} - {req.category} - {req.quantity} needed
              </li>
            ))
          ) : (
            <li>No requests found.</li>
          )}
        </ul>
      )}
    </div>
  );
}
