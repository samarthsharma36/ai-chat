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

  const handleStreamChat = async () => {
    setStreaming(true);
    setStreamResponse("");

    try {
      const response = await fetch("/api/chat-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const reader = response.body.getReader();

      // since we encode text in api backend we need to decode it in frontend
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const delta = decoder.decode(value);
        const lines = delta.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = json.parse(line.slice(6));
            setStreamResponse((prev) => prev + data.content);
          }
        }
      }
    } catch (error) {
      setStreamResponse(`Error: ${error.message}`);
    }
    setStreaming(false);
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

      {response.length > 0 && (
        <div>
          <h4 className="mt-4 mx-2">Response: </h4>
          <div className="border w-full max-w-xl p-4 m-2 rounded">
            {response}
          </div>
        </div>
      )}

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
