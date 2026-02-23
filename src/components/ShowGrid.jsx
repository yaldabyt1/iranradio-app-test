// src/components/ShowGrid.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ShowGrid({ shows = [] }) {
  const navigate = useNavigate();

  return (
    <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-4 row-cols-xl-5 imgLinks py-3">
      {shows.map((s) => (
        <div key={s.id} className="col mb-3">
          <div style={{ cursor: "pointer" }} onClick={() => navigate(`/shows/${s.id}`)}>
            <img
              src={s.artwork_url || ""}
              alt={s.title || "Podcast"}
              className="img-fluid rounded"
              style={{ aspectRatio: "1/1", objectFit: "cover" }}
            />

            <div className="mt-2 text-white">
              <div style={{ fontWeight: 600 }}>{s.title}</div>
              <div style={{ opacity: 0.8, fontSize: 13 }}>{s.publisher || ""}</div>
              <div style={{ opacity: 0.6, fontSize: 12 }}>{s.category?.name || ""}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}