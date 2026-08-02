import "./App.css";
import Header from "./components/Header";
import ComicCard from "./components/ComicCard";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "./api/getUser";

function App() {
  const {
    isPending,
    error,
    data: user,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => getUser(6620885, "saia"),
    select: (data) => data,
  });

  return (
    <>
      <Header />
      <h2 className="section-title">Komik Terbaru</h2>
      <div className="grid" id="comicGrid">
        {isPending && <div className="state">Loading....</div>}
        {error && (
          <div className="state">An error has occurred: {error.message}</div>
        )}
        {user?.recent_favorites.map((item) => (
          <ComicCard
            key={item.id}
            thumbnail={item.thumbnail}
            en_title={item.english_title}
            pages={item.num_pages}
          />
        ))}
      </div>
    </>
  );
}

export default App;
