"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [streamResponse, setStreamResponse] = useState("");
  const [streaming, setStreaming] = useState("");
  const [loading, setLoading] = useState("");

  const handleChat = async () => {
    setLoading(true);
    setResponse("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      // .content because look at return in route.ts
      console.log(data);
      setResponse(data.content);
    } catch (error) {
      setResponse("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4">Hello Ji</h2>

      <div className="w-full max-w-xl">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's on your mind?"
          rows={6}
          className="w-full border rounded-lg p-4"
        />
      </div>
      <div className="m-4">
        {!loading ? (
          <button onClick={handleChat}>Send</button>
        ) : (
          <h4>Loading</h4>
        )}
      </div>
    </div>
  );
}
