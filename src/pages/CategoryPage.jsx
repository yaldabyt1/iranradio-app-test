import React from "react";
import { Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";

import {
  useGetCategoryBySlugQuery,
  useGetPlaylistsByCategoryIdQuery,
} from "../services/iranradioApi";

export default function CategoryPage() {
  const { categorySlug } = useParams();

  const { data: cat, isLoading: catLoading, isError: catError, error: catErr } =
    useGetCategoryBySlugQuery(categorySlug);

  const {
    data: podcasts = [],
    isLoading: podLoading,
    isError: podError,
    error: podErr,
  } = useGetPlaylistsByCategoryIdQuery(
    cat?.id ? { categoryId: cat.id, page: 1, perPage: 50 } : skipToken
  );

  if (catLoading) return <div className="text-white p-4">Loading category…</div>;
  if (catError || !cat) return <div className="text-white p-4">Category not found: {String(catErr?.error || catErr)}</div>;

  if (podLoading) return <div className="text-white p-4">Loading podcasts…</div>;
  if (podError) return <div className="text-white p-4">Failed: {String(podErr?.error || podErr)}</div>;

  return (
    <div className="col-12 col-md-9 offset-md-3 mainPage text-white">
      <Container className="py-4">
        <h3 className="mb-4">{cat.name}</h3>

        {podcasts.length === 0 ? (
          <p className="text-white-50">No podcasts in this category.</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            {podcasts.map((p) => (
              <Link
                key={p.id}
                to={`/podcast/${p.slug}`}
                className="text-white text-decoration-none p-3 rounded"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                {stripHtml(p.title)}
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

function stripHtml(s) {
  if (!s) return "";
  return String(s).replace(/<[^>]*>/g, "").trim();
}