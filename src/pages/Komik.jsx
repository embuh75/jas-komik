import { useParams } from "react-router-dom";
import ComicCard from "../components/ComicCard";
import { useQuery } from "@tanstack/react-query";
import { getByID } from "../api/galleries";

export default function Komik() {
  const { komikId } = useParams();
  const {
    isPending,
    error,
    data: komik,
  } = useQuery({
    queryKey: ["comic"],
    queryFn: async () => getByID(komikId),
    select: (data) => data,
  });

  return (
    <div className="grid" id="comicGrid">
      <span>Detail Komik: {komikId}</span>
      {isPending && <div className="state">Loading....</div>}
        {error && (
          <div className="state">An error has occurred: {error.message}</div>
        )}
      <ComicCard thumbnail={komik?.thumbnail?.path} en_title={komik?.title?.english} pages={komik?.num_pages}/>
    </div>
  );
}
