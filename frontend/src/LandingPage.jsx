import React from "react";

const LandingPage = ({ onStart }) => (
  <div style={{
    width: "100vw",
    minHeight: "100vh",
    background: "linear-gradient(120deg, #e0e7ff 0%, #f0f4ff 100%)",
    margin: 0,
    padding: 0,
    boxSizing: "border-box"
  }}>
    <section style={{
      width: "100%",
      padding: "64px 0 32px 0",
      background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
      color: "#fff",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: 56, margin: "16px 0" }}>Welcome to ZoomLite</h1>
      <p style={{ fontSize: 24, color: "#e0e7ff" }}>
        Effortless, secure, and instant video meetings. Connect with anyone, anywhere, anytime—right from your browser.
      </p>
      <button
        style={{
          marginTop: 32,
          padding: "16px 48px",
          fontSize: 22,
          background: "#fff",
          color: "#2563eb",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          boxShadow: "0 2px 8px #0002",
          fontWeight: 600
        }}
        onClick={onStart}
      >
        Start a Meeting
      </button>
    </section>
    <section style={{
      width: "100%",
      maxWidth: 1200,
      margin: "40px auto",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 24px #0001",
      padding: "40px 32px"
    }}>
      <h2 style={{ fontSize: 32, color: "#2563eb" }}>Why ZoomLite?</h2>
      <ul style={{ fontSize: 20, color: "#333", lineHeight: 1.7, marginTop: 24 }}>
        <li><b>One-click meetings:</b> No downloads, no hassle. Just share a room ID and connect instantly.</li>
        <li><b>Crystal-clear video & audio:</b> Powered by modern WebRTC technology for smooth, real-time communication.</li>
        <li><b>Privacy-first:</b> Your calls are never recorded or stored. All communication is peer-to-peer and encrypted.</li>
        <li><b>Open source:</b> Built for the community, by the community. Fork, modify, and make it your own!</li>
      </ul>
    </section>
    <section style={{
      width: "100%",
      maxWidth: 1200,
      margin: "0 auto 40px auto",
      background: "#f1f5f9",
      borderRadius: 16,
      boxShadow: "0 1px 8px #0001",
      padding: "32px 32px"
    }}>
      <h2 style={{ fontSize: 28, color: "#2563eb" }}>Get Started</h2>
      <p style={{ fontSize: 18, color: "#555", marginTop: 16 }}>
        Click "Start a Meeting" to create or join a room. Share the room ID with your friends or colleagues and enjoy seamless video calls. No sign-up required!
      </p>
    </section>
  </div>
);

export default LandingPage;