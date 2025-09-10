import { useRef, useState } from "react";

export default function useRecorder() {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [supported] = useState(!!navigator.mediaDevices?.getUserMedia);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
    chunksRef.current = [];
    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    mr.onstop = () => stream.getTracks().forEach((t) => t.stop());
    mediaRecorderRef.current = mr;
    mr.start();
    setRecording(true);
  };

  const stop = async () => {
    return new Promise((resolve) => {
      mediaRecorderRef.current.onstop = () => {
        mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
        resolve(new Blob(chunksRef.current, { type: "audio/webm" }));
      };
      mediaRecorderRef.current.stop();
      setRecording(false);
    });
  };

  return { recording, supported, start, stop };
}
