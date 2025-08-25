import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DonorListings() {
  const { data, error } = useSWR("/api/listed-items", fetcher);

  return (
    <div>
      <h2>My Listings</h2>
      {error && <div>Error loading listings</div>}
      {!data ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data.items && data.items.length > 0 ? (
            data.items.map((item: any) => (
              <li key={item._id}>
                {item.title} - {item.category} - {item.available} available
              </li>
            ))
          ) : (
            <li>No listings found.</li>
          )}
        </ul>
      )}
    </div>
  );
}
