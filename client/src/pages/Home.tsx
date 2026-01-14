import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, ChevronLeft, ChevronRight, MessageCircle, Send, Mic, MicOff } from "lucide-react";
import { FloatingChatWidget } from "../components/FloatingChatWidget";

const galleryImages = [
  "/images/frame_0125.jpg", "/images/frame_0129.jpg", "/images/frame_0132.jpg",
  "/images/frame_0153.jpg", "/images/frame_0154.jpg", "/images/frame_0155.jpg",
  "/images/frame_0156.jpg", "/images/frame_0157.jpg", "/images/frame_0159.jpg",
  "/images/frame_0160.jpg", "/images/frame_0161.jpg", "/images/frame_0162.jpg",
  "/images/frame_0163.jpg", "/images/frame_0164.jpg", "/images/frame_0165.jpg",
  "/images/frame_0166.jpg", "/images/frame_0167.jpg", "/images/frame_0170.jpg"
];

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(true);
  const [password, setPassword] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem("lojza_auth");
    if (savedAuth === "true") setShowPassword(false);
  }, []);

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Sekaneseka3") {
      setShowPassword(false);
      localStorage.setItem("lojza_auth", "true");
    } else {
      alert("Nesprávné heslo");
    }
  };

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && isMuted && !showPassword) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        setIsMuted(false);
      }
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, [isMuted, showPassword]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  if (showPassword) {
    return (
      <div style={{ height: '100vh', backgroundColor: '#0a0f16', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'serif' }}>
        <form onSubmit={handlePassword} style={{ textAlign: 'center', padding: '40px', border: '1px solid #22c55e', borderRadius: '15px', background: 'rgba(34, 197, 94, 0.05)' }}>
          <h2 style={{ marginBottom: '20px', letterSpacing: '2px' }}>SOUKROMÁ ZÓNA</h2>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Zadejte heslo"
            style={{ padding: '10px 20px', borderRadius: '20px', border: '1px solid #22c55e', background: 'transparent', color: 'white', marginBottom: '20px', width: '200px', textAlign: 'center' }}
          />
          <br />
          <button type="submit" style={{ background: '#22c55e', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>VSTOUPIT</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0a0f16', minHeight: '100vh', color: '#ffffff', fontFamily: 'serif' }}>
      <audio ref={audioRef} src="/morning-mood.mp3" loop />
      
      {/* Audio Toggle Button */}
      <button 
        onClick={toggleMute}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          background: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid #22c55e',
          color: '#22c55e',
          padding: '10px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)'
        }}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Navigation Bar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(10, 15, 22, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px' }}>
          LOJZOVY PASEKY
        </div>
        
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <a href="#about" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', opacity: 0.7 }}>O PROJEKTU</a>
          <a href="#apartments" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', opacity: 0.7 }}>APARTMÁNY</a>
          <a href="#location" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', opacity: 0.7 }}>LOKALITA</a>
          <a href="#contact" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', opacity: 0.7 }}>KONTAKT</a>
          <button style={{
            background: '#22c55e',
            color: 'white',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px'
          }}>
            Rezervovat
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        height: '100vh',
        backgroundImage: `linear-gradient(rgba(10, 15, 22, 0.4), rgba(10, 15, 22, 0.8)), url("/images/frame_0125.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <div style={{ fontSize: '12px', letterSpacing: '4px', color: '#22c55e', marginBottom: '20px', fontWeight: 'bold' }}>
          VÁŠ DRUHÝ DOMOV V SRDCI ŠUMAVY
        </div>

        <h1 style={{ fontSize: '5em', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '1px' }}>
          Lojzovy Paseky
        </h1>

        <p style={{ fontSize: '1.4em', marginBottom: '40px', opacity: 0.8, maxWidth: '800px', lineHeight: '1.5' }}>
          Kde se moderní architektura potkává s tichem lesů.<br />
          Investice do klidu, který trvá.
        </p>
      </div>

      {/* Content Sections */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 20px' }}>
        <section id="about" style={{ marginBottom: '100px' }}>
          <h2 style={{ fontSize: '2.5em', marginBottom: '30px', color: '#22c55e' }}>O Projektu</h2>
          <p style={{ fontSize: '1.2em', lineHeight: '1.8', opacity: 0.8 }}>
            Lojzovy Paseky je unikátní projekt moderních bungalovů v srdci Šumavy u Lipna nad Vltavou. 
            Kombinuje luxusní bydlení s přírodou a nabízí ideální podmínky pro rodiny, digitální nomády i investory.
          </p>
        </section>

        <section id="apartments" style={{ marginBottom: '100px' }}>
          <h2 style={{ fontSize: '2.5em', marginBottom: '30px', color: '#22c55e' }}>Apartmány & Galerie</h2>
          
          {/* Simple Gallery Slider */}
          <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '15px', overflow: 'hidden', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src={galleryImages[currentImageIndex]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Apartmán" />
            <button onClick={prevImage} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><ChevronLeft /></button>
            <button onClick={nextImage} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><ChevronRight /></button>
          </div>

          <p style={{ fontSize: '1.2em', lineHeight: '1.8', opacity: 0.8 }}>
            Naše apartmány jsou navrženy s důrazem na komfort a moderní design. 
            Každý bungalov nabízí výhled na přírodu a přímý přístup k lesu.
          </p>
        </section>

        <section id="location" style={{ marginBottom: '100px' }}>
          <h2 style={{ fontSize: '2.5em', marginBottom: '30px', color: '#22c55e' }}>Lokalita</h2>
          <p style={{ fontSize: '1.2em', lineHeight: '1.8', opacity: 0.8 }}>
            Lipno nad Vltavou je ideální destinace pro odpočinek a aktivní trávení volného času. 
            Blízkost přírody, vodních sportů a kulturních atraktivit.
          </p>
        </section>

        <section id="contact">
          <h2 style={{ fontSize: '2.5em', marginBottom: '30px', color: '#22c55e' }}>Kontakt</h2>
          <p style={{ fontSize: '1.2em', lineHeight: '1.8', opacity: 0.8 }}>
            Email: <a href="mailto:info@lojzovypaseky.life" style={{ color: '#22c55e', textDecoration: 'none' }}>info@lojzovypaseky.life</a>
          </p>
        </section>
      </div>

      <FloatingChatWidget />
    </div>
  );
}
