"use client";
import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 480,   // 🔥 Turunkan resolusi
  height: 480,
  facingMode: "user",
};

interface CameraCaptureProps {
  onCapture: (imageSrc: string | null) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        console.error("Gagal mengambil screenshot");
        return;
      }
      setImage(imageSrc);
      onCapture(imageSrc);
    }
  }, [onCapture]);

  const retake = () => {
    setImage(null);
    onCapture(null);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-sm aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
        {image ? (
          <img
            src={image}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.6}  // 🔥 INI YANG PENTING
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="mt-4">
        {!image ? (
          <button
            type="button"
            onClick={capture}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            📸 Ambil Foto
          </button>
        ) : (
          <button
            type="button"
            onClick={retake}
            className="bg-gray-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-600 transition"
          >
            🔄 Foto Ulang
          </button>
        )}
      </div>
    </div>
  );
}
