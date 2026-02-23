import React, { useMemo, useState } from "react";
import { Container, Offcanvas } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MiniPlayerBar from "./MiniPlayerBar";
import BottomNav from "./BottomNav";

export default function MobileShell({ title = "IranRadio", children }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  const canGoBack = useMemo(() => loc.pathname !== "/", [loc.pathname]);

  return (
    <div className="mainMobile text-white">
      {/* Header */}
      <div className="mobileTopBar">
        <button className="mobileIconBtn" onClick={() => setOpen(true)} aria-label="Menu">
          <i className="bi bi-list" />
        </button>

        <div className="mobileTopTitle">{title}</div>

        <button className="mobileIconBtn" onClick={() => nav("/login")} aria-label="Login">
          <i className="bi bi-person" />
        </button>
      </div>

      {/* Optional: back row */}
      {canGoBack && (
        <div className="mobileBackRow">
          <button className="mobileBackBtn" onClick={() => nav(-1)} aria-label="Back">
            ‹
          </button>
          <div className="mobileBackText">Back</div>
        </div>
      )}

      {/* Body */}
      <Container className="py-2 mobileBody">
        {children}
      </Container>

      {/* Mini Player */}
      <MiniPlayerBar />

      {/* Bottom Nav */}
      <BottomNav />

      {/* Offcanvas Menu */}
      <Offcanvas show={open} onHide={() => setOpen(false)} placement="start" className="mobileMenu">
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="text-white">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex flex-column gap-2">
            <Link className="mobileMenuLink" to="/" onClick={() => setOpen(false)}>
              <i className="bi bi-house me-2" /> Home
            </Link>

            <Link className="mobileMenuLink" to="/library" onClick={() => setOpen(false)}>
              <i className="bi bi-collection me-2" /> Library
            </Link>

            <Link className="mobileMenuLink" to="/listen-later" onClick={() => setOpen(false)}>
              <i className="bi bi-bookmark me-2" /> Listen Later
            </Link>

            <Link className="mobileMenuLink" to="/login" onClick={() => setOpen(false)}>
              <i className="bi bi-person me-2" /> Login
            </Link>
          </div>

          <div className="text-white-50 mt-4" style={{ fontSize: 12 }}>
            * فعلاً UI ساده است تا بعداً UI اصلی را جایگزین کنیم.
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}