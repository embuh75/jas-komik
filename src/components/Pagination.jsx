import "./style.css";

export default function Pagination() {
  return (
    <div className="pagination">
      <button id="prevPage" /* ${page <= 1 ? "disabled" : ""} */>
        &larr; Sebelumnya
      </button>
      <span /* style="align-self:center;color:var(--muted)" */>
        Halaman {/* ${page} / ${totalPages} */}
      </span>
      <button id="nextPage" /* ${page >= totalPages ? "disabled" : ""} */>
        Selanjutnya &rarr;
      </button>
    </div>
  );
}
