'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import FeaturedProducts from './components/home/FeaturedProducts';

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Parallax Effekte
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Mouse Move Effekt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Setze isLoaded auf true, nachdem die Komponente gemountet wurde
    const timer = setTimeout(() => setIsLoaded(true), 300);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);
  
  const movementX = (mousePosition.x / window.innerWidth - 0.5) * 30;
  const movementY = (mousePosition.y / window.innerHeight - 0.5) * 30;

  return (
    <main className="min-h-screen overflow-hidden" ref={ref}>
      {/* Animierter Ladebildschirm */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]"
            exit={{ 
              opacity: 0,
              transition: { duration: 0.8, ease: [0.45, 0, 0.55, 1] }
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { duration: 0.5 } }}
              exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.5 } }}
              className="relative"
            >
              <span className="text-5xl font-bold text-gradient">WOW</span>
              <motion.div
                className="absolute -inset-4 bg-[rgba(var(--primary),0.2)]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: [0, 0.5, 0], 
                  scale: [0.8, 1.2, 1.8],
                  transition: { 
                    repeat: 2,
                    duration: 1.5
                  }
                }}
                style={{ borderRadius: '50%' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hauptnavigation mit Glasmorphismus */}
      <nav className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl font-bold text-gradient"
            >
              WOW-Webdesign
            </motion.div>
            
            <div className="flex items-center space-x-1">
              <AnimatePresence>
                {isLoaded && (
                  <>
                    {["Home", "Leistungen", "Portfolio", "Shop", "Kontakt"].map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                      >
                        <Link 
                          href={`#${item.toLowerCase()}`} 
                          className="px-4 py-2 mx-1 rounded-full glass hover:bg-[rgba(var(--primary),0.3)] transition-all text-white"
                        >
                          {item}
                        </Link>
                      </motion.div>
                    ))}
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero-Bereich mit Parallaxeffekt und Partikeln */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#111827] hero-pattern wavy-border">
        {/* Animierte Partikel im Hintergrund */}
        <div className="absolute inset-0 z-0">
          {Array(20).fill(0).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute rounded-full bg-[rgba(var(--primary),0.2)]"
              style={{
                width: Math.random() * 60 + 10,
                height: Math.random() * 60 + 10,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                opacity: [0.1, 0.5, 0.1],
                scale: [1, Math.random() + 0.5, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Video Hintergrund mit Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent z-10"></div>
          <div className="w-full h-full">
            <iframe
              src="https://player.vimeo.com/video/1067507561?h=48d0275128&background=1&autoplay=1&loop=1&muted=1"
              className="w-full h-full object-cover"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Header Background Video"
            ></iframe>
          </div>
        </div>

        {/* Geschwungener SVG Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <svg
            className="absolute bottom-0 left-0 w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="rgb(var(--background-start))"
              fillOpacity="1"
              d="M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,192C672,203,768,213,864,197.3C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        {/* Hero-Inhalt mit parallaxem Text */}
        <div className="container mx-auto px-6 relative z-20">
          <div className="flex flex-col items-center text-center">
            <motion.div
              style={{ y: titleY }}
              className="relative"
            >
              <motion.h1 
                className="text-6xl md:text-8xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <span>Professionelles</span> <br />
                <motion.span 
                  className="text-gradient"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  Webdesign
                </motion.span>
                <br />
                <motion.span
                  className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--accent))] to-[rgb(var(--secondary))]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  mit WOW-Effekt
                </motion.span>
              </motion.h1>
              
              <motion.div
                className="absolute -inset-10 rounded-full bg-[rgba(var(--primary),0.1)] blur-3xl -z-10"
                style={{ 
                  transform: `translate(${movementX * 0.5}px, ${movementY * 0.5}px)` 
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 1, delay: 1 }}
              />
            </motion.div>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-2xl text-[rgba(var(--text-primary),0.9)]"
              style={{ y: subtitleY }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              Wir erstellen beeindruckende Websites, die Ihr 
              Unternehmen perfekt präsentieren und Kunden begeistern.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              <Link href="#kontakt" className="relative group">
                <span className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative block px-8 py-4 bg-[rgba(var(--background-start),0.9)] border border-[rgba(var(--primary),0.3)] rounded-full text-white font-medium transform transition-transform group-hover:translate-y-[-3px] group-hover:translate-x-[3px]">
                  Jetzt Angebot anfordern
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll-Indikator */}
        <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
          style={{ opacity: heroOpacity }}
        >
          <div className="mouse"></div>
          <p className="mt-2 text-sm text-[rgba(var(--text-primary),0.7)]">Scroll</p>
        </motion.div>
      </section>

      {/* Leistungen-Bereich mit 3D-Karten */}
      <section id="leistungen" className="py-24 bg-[rgb(var(--background-start))]">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-[rgba(var(--secondary),0.1)] text-[rgb(var(--secondary))] text-sm font-medium mb-4">
              Unsere Expertise
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Leistungen mit <span className="text-gradient">Wow-Faktor</span>
            </h2>
            <p className="max-w-2xl mx-auto text-[rgba(var(--text-primary),0.7)]">
              Wir bieten moderne Webdesign-Lösungen, die durch Kreativität und technische Exzellenz überzeugen.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                title: "Webdesign", 
                icon: "🎨", 
                description: "Kreatives, responsives Design, das Ihre Marke optimal präsentiert und Besucher beeindruckt." 
              },
              { 
                title: "Webentwicklung", 
                icon: "⚙️", 
                description: "Technisch einwandfreie Umsetzung mit modernsten Technologien für optimale Performance." 
              },
              { 
                title: "SEO & Marketing", 
                icon: "📈", 
                description: "Strategische Optimierung für bessere Rankings und höhere Conversion-Raten." 
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                className="card-3d glass relative p-8 rounded-2xl overflow-hidden group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[rgba(var(--primary),0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-1 bg-gradient-to-br from-[rgba(var(--primary),0.2)] to-[rgba(var(--secondary),0.2)] rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                
                <span className="inline-block text-4xl mb-4">{service.icon}</span>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-[rgba(var(--text-primary),0.7)]">{service.description}</p>
                
                <div className="mt-6 flex justify-between items-center">
                  <Link href="#kontakt" className="text-[rgb(var(--primary))] hover:text-[rgb(var(--primary-glow))] transition-colors">
                    Mehr erfahren
                  </Link>
                  <span className="h-8 w-8 rounded-full flex items-center justify-center bg-[rgba(var(--primary),0.1)] text-[rgb(var(--primary))]">
                    →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio-Bereich mit Masonry-Grid */}
      <section id="portfolio" className="py-24 bg-[rgb(var(--background-end))]">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-[rgba(var(--primary),0.1)] text-[rgb(var(--primary))] text-sm font-medium mb-4">
              Unsere Arbeiten
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Portfolio</span> das überzeugt
            </h2>
            <p className="max-w-2xl mx-auto text-[rgba(var(--text-primary),0.7)]">
              Entdecken Sie einige unserer besten Projekte, die den WOW-Effekt in der Praxis zeigen.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "E-Commerce Website", height: "h-80" },
              { title: "Unternehmenswebsite", height: "h-96" },
              { title: "App Landing Page", height: "h-64" },
              { title: "Portfolio-Website", height: "h-72" },
              { title: "Blog-Design", height: "h-80" },
              { title: "Produktseite", height: "h-64" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`relative group overflow-hidden rounded-xl ${item.height}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src={`https://source.unsplash.com/random/600x${400 + index * 50}/?website,digital,${index}`}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <a href="#" className="inline-block mt-2 text-[rgb(var(--accent))]">Ansehen →</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop-Bereich mit Produktkarten */}
      <section id="shop" className="py-24 bg-[rgb(var(--background-start))]">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-[rgba(var(--accent),0.1)] text-[rgb(var(--accent))] text-sm font-medium mb-4">
              Unsere Angebote
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Unsere <span className="text-gradient">Pakete</span>
            </h2>
            <p className="max-w-2xl mx-auto text-[rgba(var(--text-primary),0.7)]">
              Wählen Sie aus unseren maßgeschneiderten Paketen, die perfekt zu Ihrem Projekt passen.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Basic Website", 
                price: 499, 
                features: ["5 Seiten", "Responsive Design", "Kontaktformular", "SEO-Grundlagen", "1 Monat Support"] 
              },
              { 
                title: "Premium Website", 
                price: 999, 
                features: ["10 Seiten", "Responsive Design", "Kontaktformular", "SEO-Optimierung", "Social Media Integration", "3 Monate Support"] 
              },
              { 
                title: "E-Commerce", 
                price: 1999, 
                features: ["Unbegrenzte Produkte", "Zahlungsabwicklung", "Kundenverwaltung", "SEO-Optimierung", "Performance-Analyse", "6 Monate Support"] 
              }
            ].map((product, index) => (
              <motion.div
                key={product.title}
                className={`glass rounded-2xl overflow-hidden ${index === 1 ? 'border border-[rgba(var(--primary),0.3)] scale-105 -mt-4' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className={`p-8 ${index === 1 ? 'bg-gradient-to-br from-[rgba(var(--primary),0.1)] to-transparent' : ''}`}>
                  <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold">{product.price}€</span>
                    <span className="ml-2 text-[rgba(var(--text-primary),0.7)]">einmalig</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <span className="mr-2 text-[rgb(var(--accent))]">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full py-3 px-6 rounded-full ${index === 1 ? 'bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:shadow-lg hover:shadow-[rgba(var(--primary),0.3)] transition-shadow' : 'bg-[rgba(var(--text-primary),0.05)] hover:bg-[rgba(var(--text-primary),0.1)] transition-colors'}`}>
                    Paket wählen
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontakt-Bereich mit Animation */}
      <section id="kontakt" className="py-24 bg-gradient-to-b from-[rgb(var(--background-end))] to-[rgba(var(--primary),0.1)]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-[rgba(var(--secondary),0.1)] text-[rgb(var(--secondary))] text-sm font-medium mb-4">
                Kontaktieren Sie uns
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Bereit für Ihren <span className="text-gradient">WOW-Moment?</span>
              </h2>
              <p className="text-lg text-[rgba(var(--text-primary),0.7)] mb-8">
                Schreiben Sie uns oder rufen Sie an. Wir besprechen gerne Ihr Projekt und zeigen Ihnen, wie wir gemeinsam den WOW-Effekt erzielen können.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-full bg-[rgba(var(--primary),0.1)] flex items-center justify-center text-[rgb(var(--primary))] mr-4">
                    📍
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Adresse</h3>
                    <p className="text-[rgba(var(--text-primary),0.7)]">Musterstraße 123, 12345 Musterstadt</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-full bg-[rgba(var(--primary),0.1)] flex items-center justify-center text-[rgb(var(--primary))] mr-4">
                    ✉️
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">E-Mail</h3>
                    <p className="text-[rgba(var(--text-primary),0.7)]">info@wow-webdesign.de</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-full bg-[rgba(var(--primary),0.1)] flex items-center justify-center text-[rgb(var(--primary))] mr-4">
                    📱
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Telefon</h3>
                    <p className="text-[rgba(var(--text-primary),0.7)]">+49 123 456789</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="glass p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-bold mb-6">Senden Sie uns eine Nachricht</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 bg-[rgba(var(--text-primary),0.05)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary),0.5)]"
                      placeholder="Ihr Name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-2">E-Mail</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 bg-[rgba(var(--text-primary),0.05)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary),0.5)]"
                      placeholder="Ihre E-Mail"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2">Betreff</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full px-4 py-3 bg-[rgba(var(--text-primary),0.05)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary),0.5)]"
                    placeholder="Betreff Ihrer Nachricht"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2">Nachricht</label>
                  <textarea 
                    id="message" 
                    rows={5} 
                    className="w-full px-4 py-3 bg-[rgba(var(--text-primary),0.05)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary),0.5)]"
                    placeholder="Ihre Nachricht"
                  ></textarea>
                </div>
                
                <button type="submit" className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white font-medium hover:shadow-lg hover:shadow-[rgba(var(--primary),0.3)] transition-shadow">
                  Nachricht senden
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Bereich mit animiertem Hintergrund und Werbe-Video */}
      <section className="py-20 relative overflow-hidden bg-[rgba(var(--background-end),0.5)]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center md:text-left"
            >
              <h2 className="text-4xl font-bold mb-6">
                Bereit für Ihren <span className="text-gradient">WOW-Moment?</span>
              </h2>
              <p className="text-lg mb-8 text-[rgba(var(--text-primary),0.8)]">
                Überzeugen Sie sich selbst von unserer Arbeit und sehen Sie, wie wir Ihrem Unternehmen zum Erfolg verhelfen können.
              </p>
              <Link href="#kontakt" className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white font-medium hover:shadow-lg hover:shadow-[rgba(var(--primary),0.3)] transition-shadow">
                Jetzt Beratung anfragen
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="aspect-video rounded-2xl overflow-hidden shadow-xl shadow-[rgba(var(--primary),0.2)]"
            >
              <iframe
                src="https://player.vimeo.com/video/1067508106?h=343f245390&autoplay=0&loop=0&muted=0"
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="WOW-Webdesign Promotional Video"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Füge die FeaturedProducts-Komponente hinzu */}
      <FeaturedProducts />
      
      {/* Footer mit Glassmorphismus */}
      <footer className="py-16 relative overflow-hidden bg-[rgba(var(--background-end),0.8)]">
        {/* ... existing code ... */}
      </footer>
    </main>
  );
} 