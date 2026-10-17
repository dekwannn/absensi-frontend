"use client";

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { base64ToFile } from '@/utils/imageConverter';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Send,
  Camera,
  X,
  ScanLine,
  ImageIcon,
  Clock,
  Home,
  RotateCcw
} from 'lucide-react';
import { gsap } from 'gsap';

export default function CheckInPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Refs for GSAP animations
  const successModalRef = useRef<HTMLDivElement>(null);
  const checkmarkRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  
  // STATE
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; msg: string; time?: string }>({ type: '', msg: '' });
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [loadingLocation, setLoadingLocation] = useState(true);

  // GSAP Animation when success modal shows
  useEffect(() => {
    if (showSuccessAnimation && successModalRef.current) {
      const tl = gsap.timeline();
      
      // Animate modal background
      tl.fromTo(
        successModalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );

      // Animate checkmark with bounce
      tl.fromTo(
        checkmarkRef.current,
        { scale: 0, rotation: -180 },
        { 
          scale: 1, 
          rotation: 0, 
          duration: 0.6,
          ease: "back.out(1.7)"
        },
        "+=0.1"
      );

      // Confetti particles
      const particles = successModalRef.current.querySelectorAll('.particle');
      tl.fromTo(
        particles,
        { scale: 0, y: 0 },
        {
          scale: 1,
          y: -100,
          opacity: 0,
          duration: 1,
          stagger: 0.05,
          ease: "power2.out"
        },
        "-=0.3"
      );

      // Animate title
      tl.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.4"
      );

      // Animate time badge
      tl.fromTo(
        timeRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" },
        "-=0.2"
      );

      // Animate message
      tl.fromTo(
        messageRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      );

      // Animate buttons
      tl.fromTo(
        buttonsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      );
    }
  }, [showSuccessAnimation]);

  // Ambil lokasi dan nama lokasi saat halaman dibuka
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(coords);
          
          await getLocationName(coords.lat, coords.lng);
        },
        (error) => {
          setLoadingLocation(false);
          let msg = "Gagal mengambil lokasi.";
          if (error.code === 1) msg = "Izin lokasi ditolak. Harap aktifkan GPS!";
          else if (error.code === 2) msg = "Sinyal GPS lemah/tidak tersedia.";
          alert(msg);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLoadingLocation(false);
    }
  }, []);

  const getLocationName = async (lat: number, lng: number) => {
    try {
      setLoadingLocation(true);
      
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`
      );
      
      const data = await response.json();
      
      if (data) {
        const name = 
          data.locality || 
          data.principalSubdivision || 
          data.city || 
          data.countryName ||
          "Lokasi tidak diketahui";
        
        const city = data.city || data.principalSubdivision || "";
        
        if (city && name !== city) {
          setLocationName(`${name}, ${city}`);
        } else {
          setLocationName(name);
        }
      } else {
        setLocationName("Lokasi tidak diketahui");
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => stopCamera();
  }, [isCameraOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 1280 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    const captureWidth = 300;
    const captureHeight = 380;
    
    canvas.width = captureWidth;
    canvas.height = captureHeight;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
    const scale = Math.max(
      window.innerWidth / videoWidth,
      window.innerHeight / videoHeight
    );
    
    const scaledWidth = videoWidth * scale;
    const scaledHeight = videoHeight * scale;
    
    const videoX = (window.innerWidth - scaledWidth) / 2;
    const videoY = (window.innerHeight - scaledHeight) / 2;
    
    const captureX = (window.innerWidth - captureWidth) / 2;
    const captureY = (window.innerHeight - captureHeight) / 2;
    
    const sourceX = (captureX - videoX) / scale;
    const sourceY = (captureY - videoY) / scale;
    const sourceWidth = captureWidth / scale;
    const sourceHeight = captureHeight / scale;

    ctx.drawImage(
      video,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, captureWidth, captureHeight
    );

    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    setImage(imageData);
    setIsCameraOpen(false);
  };

  const handleCheckIn = async () => {
    if (!image) return alert("Ambil foto dulu!");
    if (!location) return alert("Sedang mencari lokasi... Tunggu sebentar.");

    setLoading(true);
    setStatus({ type: '', msg: '' });
    setShowSuccessAnimation(false);

    try {
      const imageFile = base64ToFile(image, "checkin.jpg");

      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('latitude', location.lat.toString());
      formData.append('longitude', location.lng.toString());

      const response = await api.post('/attendance/check-in', formData);
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });

      setStatus({ 
        type: 'success', 
        msg: `Halo ${response.data.user}, ${response.data.message}`,
        time: timeString
      });

      setShowSuccessAnimation(true);

    } catch (error: any) {
      console.error("FULL ERROR:", error);
      let errorMsg = "Terjadi kesalahan saat absensi.";

      if (error.response) {
        const detail = error.response.data?.detail || "";
        if (detail.toLowerCase().includes("lokasi") || detail.toLowerCase().includes("jarak")) {
          errorMsg = `${detail}`;
        } else if (detail.toLowerCase().includes("wajah") || detail.toLowerCase().includes("tidak dikenali")) {
          errorMsg = `Wajah tidak dikenali atau belum terdaftar.`;
        } else {
          errorMsg = detail || "Error dari server.";
        }
      } else if (error.request) {
        errorMsg = "Server tidak merespons. Cek koneksi internet.";
      } 

      setStatus({ type: 'error', msg: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    gsap.to(successModalRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        router.push('/dashboard');
      }
    });
  };

  const handleCheckInAgain = () => {
    gsap.to(successModalRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setShowSuccessAnimation(false);
        setImage(null);
        setStatus({ type: '', msg: '' });
      }
    });
  };

  // --- SUCCESS ANIMATION MODAL WITH GSAP ---
  if (showSuccessAnimation) {
    return (
      <div 
        ref={successModalRef}
        className="fixed inset-0 bg-gradient-to-br from-green-500 to-green-600 z-50 flex items-center justify-center p-6"
      >
        <div className="text-center relative">
          {/* Animated Checkmark */}
          <div ref={checkmarkRef} className="relative mx-auto mb-8">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <svg className="checkmark" width="80" height="80" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            
            {/* Confetti particles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="particle absolute w-3 h-3 bg-white rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${i * 30}deg) translateY(0)`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Success Text */}
          <h1 ref={titleRef} className="text-4xl font-bold text-white mb-3">
            Absensi Berhasil!
          </h1>
          
          {/* Time Badge */}
          <div ref={timeRef} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-4">
            <Clock size={20} className="text-white" />
            <span className="text-white font-bold text-lg">{status.time}</span>
          </div>

          <p ref={messageRef} className="text-white/90 text-lg max-w-sm mx-auto mb-8">
            {status.msg}
          </p>

          {/* Action Buttons */}
          <div ref={buttonsRef} className="flex flex-col gap-3 max-w-sm mx-auto">
            <button
              onClick={handleBackToDashboard}
              className="w-full bg-white text-green-600 py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 hover:bg-green-50 active:scale-95 transition-all"
            >
              <Home size={20} />
              Kembali ke Dashboard
            </button>
            
            <button
              onClick={handleCheckInAgain}
              className="w-full bg-white/10 backdrop-blur-md text-white border-2 border-white/30 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/20 active:scale-95 transition-all"
            >
              <RotateCcw size={20} />
              Absen Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN MODE KAMERA FULL SCREEN ---
  if (isCameraOpen) {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-hidden flex flex-col">
        
        <canvas ref={canvasRef} className="hidden" />
        
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative" style={{ width: '300px', height: '380px' }}>
            <svg className="absolute -top-1 -left-1" width="60" height="60" viewBox="0 0 60 60">
              <path d="M 20 5 L 5 5 L 5 20" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/>
            </svg>
            
            <svg className="absolute -top-1 -right-1" width="60" height="60" viewBox="0 0 60 60">
              <path d="M 40 5 L 55 5 L 55 20" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/>
            </svg>
            
            <svg className="absolute -bottom-1 -left-1" width="60" height="60" viewBox="0 0 60 60">
              <path d="M 5 40 L 5 55 L 20 55" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/>
            </svg>
            
            <svg className="absolute -bottom-1 -right-1" width="60" height="60" viewBox="0 0 60 60">
              <path d="M 55 40 L 55 55 L 40 55" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/>
            </svg>

            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div 
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80"
                style={{
                  animation: 'scan 2s ease-in-out infinite'
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
          
          <div className="text-center">
            <div className="inline-block bg-black/50 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-1">Verifikasi Wajah</h3>
              <p className="text-white/80 text-sm">Posisikan wajah dalam frame</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button 
              onClick={() => setIsCameraOpen(false)}
              className="text-white bg-white/20 p-4 rounded-full hover:bg-white/30 backdrop-blur-md border border-white/20 active:scale-95 transition"
            >
              <X size={24} />
            </button>

            <button
              onClick={capturePhoto}
              className="bg-white p-6 rounded-full shadow-2xl active:scale-95 transition-transform relative group"
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 group-active:animate-none"></div>
              <Camera size={32} className="text-blue-600 relative z-10" />
            </button>

            <div className="w-16"></div>
          </div>
        </div>

      </div>
    );
  }

  // --- TAMPILAN DASHBOARD UTAMA ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      
      <header className="bg-gradient-to-br from-blue-600 to-blue-700 text-white pt-6 pb-20 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mb-20 blur-2xl"></div>
        <div className="flex items-center gap-4 relative z-10">
          <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition backdrop-blur-sm active:scale-95">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Absensi Harian</h1>
            <p className="text-blue-100 text-xs mt-0.5">Verifikasi Wajah & Lokasi</p>
          </div>
        </div>
      </header>

      <div className="px-6 -mt-12 relative z-20 mb-6">
        <div className={`p-4 rounded-2xl shadow-md border flex items-center gap-4 transition-all duration-300 ${
          location && !loadingLocation
            ? 'bg-white border-green-200 shadow-green-100' 
            : 'bg-white border-yellow-200 shadow-yellow-100 animate-pulse'
        }`}>
          <div className={`p-3 rounded-full ${
            location && !loadingLocation
              ? 'bg-green-100 text-green-600' 
              : 'bg-yellow-100 text-yellow-600'
          }`}>
            <MapPin size={24} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Lokasi Anda</p>
            {loadingLocation ? (
              <div className="space-y-1.5 mt-1">
                <div className="h-3 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-2 bg-slate-200 rounded w-1/2 animate-pulse"></div>
              </div>
            ) : location && locationName ? (
              <div>
                <p className="text-slate-700 font-semibold text-sm leading-tight">{locationName}</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              </div>
            ) : (
              <p className="text-slate-700 font-semibold text-sm">Sedang mencari GPS...</p>
            )}
          </div>
        </div>
      </div>

      <main className="px-6">
        {status.msg && status.type === 'error' && (
          <div className="mb-6 p-4 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 bg-red-50 border border-red-200 text-red-800">
            <div className="mt-0.5"><AlertCircle size={20} /></div>
            <div className="flex-1">
              <p className="font-bold text-sm">Gagal</p>
              <p className="text-xs mt-1 leading-relaxed">{status.msg}</p>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center min-h-[320px]">
          
          {!image ? (
            <div className="text-center py-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-inner">
                <ScanLine size={40} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">Mulai Absensi</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-[220px] mx-auto leading-relaxed">
                Wajah Anda akan dipindai untuk verifikasi kehadiran.
              </p>
              
              <button
                onClick={() => setIsCameraOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 active:scale-95 transition-all flex items-center gap-2 mx-auto"
              >
                <Camera size={20} />
                Buka Kamera
              </button>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <ImageIcon size={20} className="text-blue-600"/>
                  Preview Foto
                </h3>
                <button 
                  onClick={() => setIsCameraOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 bg-blue-50 px-3 py-2 rounded-lg transition active:scale-95"
                >
                  <RefreshCw size={14} /> Foto Ulang
                </button>
              </div>

              <div className="w-full max-w-[300px] mx-auto">
                <div className="relative w-full bg-slate-100 rounded-3xl overflow-hidden border-4 border-slate-200 shadow-xl" style={{ aspectRatio: '300/380' }}>
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                    <p className="text-white text-xs font-medium flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={14} className="text-green-400"/> Foto siap dikirim
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={handleCheckIn}
            disabled={loading || !image || !location}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
              loading || !image || !location 
                ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none' 
                : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-green-300 hover:shadow-2xl'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Send size={20} />
                {image ? "Kirim Absensi" : "Lengkapi Data Dulu"}
              </>
            )}
          </button>
        </div>

      </main>
      
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        /* SVG Checkmark Animation */
        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #10b981;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          stroke: #10b981;
          stroke-width: 3;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
        }

        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}