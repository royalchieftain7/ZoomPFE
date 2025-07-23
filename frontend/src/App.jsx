import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import LandingPage from "./LandingPage";

const SIGNAL_SERVER_URL = "https://zoompfe.onrender.com"; // Change if backend runs elsewhere

function generateRoomId() {
  return Math.random().toString(36).substring(2, 10);
}

const getRoomIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("room") || "";
};

const App = () => {
  const [showMeeting, setShowMeeting] = useState(false);
  const [roomId, setRoomId] = useState(getRoomIdFromUrl());
  const [joined, setJoined] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);

  // If roomId is in URL, auto-show meeting UI
  useEffect(() => {
    if (roomId && !showMeeting) {
      setShowMeeting(true);
    }
  }, [roomId, showMeeting]);

  const handleJoin = async () => {
    socketRef.current = io(SIGNAL_SERVER_URL);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-room", roomId);
      setJoined(true);
    });

    socketRef.current.on("user-joined", async () => {
      // If you are the second user, start offer
      await createOffer();
    });

    socketRef.current.on("signal", async ({ id, data }) => {
      if (data.type === "offer") {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        socketRef.current.emit("signal", { roomId, data: pcRef.current.localDescription });
      } else if (data.type === "answer") {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(data));
      } else if (data.candidate) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          // Ignore duplicate candidate errors
        }
      }
    });

    await setupMediaAndPeer();
  };

  const setupMediaAndPeer = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideoRef.current) {
  localVideoRef.current.srcObject = localStream;
}

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ]
    });

    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("signal", { roomId, data: { candidate: event.candidate } });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
  remoteVideoRef.current.srcObject = event.streams[0];
}
    };

    pcRef.current = pc;
  };

  const createOffer = async () => {
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socketRef.current.emit("signal", { roomId, data: offer });
  };

  // Handler for "Create Meeting"
  const handleCreateMeeting = () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setMeetingLink(`${window.location.origin}?room=${newRoomId}`);
    window.history.replaceState({}, "", `?room=${newRoomId}`);
  };

  // Handler for "Join Meeting"
  const handleStartMeeting = () => {
    setShowMeeting(true);
    if (roomId) {
      setMeetingLink(`${window.location.origin}?room=${roomId}`);
      window.history.replaceState({}, "", `?room=${roomId}`);
    }
  };

  if (!showMeeting) {
    return (
      <LandingPage
        onStart={handleStartMeeting}
        onCreate={handleCreateMeeting}
        meetingLink={meetingLink}
      />
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "linear-gradient(120deg, #e0e7ff 0%, #f0f4ff 100%)",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
      }}
    >
      <h2 style={{ fontSize: 36, color: "#2563eb", margin: "48px 0 24px 0" }}>Minimal Zoom-like Web App</h2>
      {!joined ? (
        <div
          style={{
            width: "100%",
            maxWidth: 480,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 16px #0001",
            padding: "32px 24px",
            margin: "0 auto"
          }}
        >
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
            style={{
              width: "70%",
              padding: "12px",
              fontSize: 18,
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              marginRight: 12
            }}
          />
          <button
            onClick={handleJoin}
            disabled={!roomId}
            style={{
              padding: "12px 28px",
              fontSize: 18,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: roomId ? "pointer" : "not-allowed",
              fontWeight: 600
            }}
          >
            Join Room
          </button>
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
          <h3 style={{ color: "#2563eb", margin: "32px 0 24px 0" }}>Room: {roomId}</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
            <div>
              <p style={{ color: "#2563eb", fontWeight: 500 }}>Local Video</p>
              <video ref={localVideoRef} autoPlay playsInline muted width={340} height={220} style={{ borderRadius: 10, background: "#e0e7ff" }} />
            </div>
            <div>
              <p style={{ color: "#2563eb", fontWeight: 500 }}>Remote Video</p>
              <video ref={remoteVideoRef} autoPlay playsInline width={340} height={220} style={{ borderRadius: 10, background: "#e0e7ff" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
