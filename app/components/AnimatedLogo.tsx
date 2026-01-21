"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  controlX1: number;
  controlY1: number;
  controlX2: number;
  controlY2: number;
  delay: number;
}

export default function AnimatedLogo() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showLogo, setShowLogo] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [interactionEnabled, setInteractionEnabled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const containerRef = useState<HTMLDivElement | null>(null)[0];

  useEffect(() => {
    // Use fixed container dimensions
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: 100 // Fixed 100px height
      });
    };

    updateDimensions();

    // Check system color scheme preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);

    // Update dimensions on resize
    const handleResize = () => {
      updateDimensions();
    };

    // Listen for color scheme changes
    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    window.addEventListener('resize', handleResize);
    darkModeQuery.addEventListener('change', handleColorSchemeChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      darkModeQuery.removeEventListener('change', handleColorSchemeChange);
    };
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Sample points from the actual letter shapes using canvas rendering
    const samplePointsFromPath = () => {
      // All the path data from your logo (the black letters)
      const pathStrings = [
        "M344.521 112.578C353.628 112.578 357.811 121.342 357.811 128.883C357.811 137.715 353.291 145.189 344.184 145.189C341.014 145.189 338.18 143.83 335.819 141.316L335.415 141.52V155.38C335.415 156.399 335.55 156.875 335.887 156.875H339.732V160H323.205V156.875H326.983C327.927 156.875 328.332 156.467 328.332 155.448V117.945C328.331 116.926 327.927 116.518 326.983 116.518H323.205V113.393H335.415V117.673L335.887 117.809C337.573 115.295 340.744 112.578 344.521 112.578ZM343.172 115.703C338.923 115.703 335.415 121.613 335.415 126.641V132.688C335.415 137.715 338.653 142.064 343.172 142.064C348.569 142.064 349.176 135.338 349.176 128.883C349.176 122.429 348.569 115.703 343.172 115.703Z",
        "M261.523 112.578C270.023 112.578 275.487 114.548 275.487 122.633C275.487 124.263 275.082 125.554 274.272 126.437C273.463 127.32 272.518 127.728 271.372 127.728C270.158 127.728 269.281 127.32 268.471 126.437C267.662 125.554 267.257 124.603 267.257 123.38C267.257 121.07 268.134 119.507 269.821 118.76C270.63 118.624 270.967 118.352 270.967 117.945C270.967 116.042 265.84 115.499 262.265 115.499C254.845 115.499 253.765 121.75 253.765 128.815C253.765 135.406 254.71 142.064 261.995 142.064C268.538 142.064 272.518 139.21 273.395 134.387H276.229C275.014 141.656 269.011 145.189 260.916 145.189C255.857 145.189 251.944 143.558 249.246 140.433C246.548 137.308 245.131 133.435 245.131 128.883C245.131 124.331 246.48 120.459 249.246 117.334C252.147 114.208 256.261 112.578 261.523 112.578Z",
        "M424.35 112.578C435.48 112.578 440 119.915 440 129.699H416.322C416.322 137.172 417.874 142.064 425.159 142.064C432.647 142.064 435.615 139.006 436.425 133.911H438.988C437.773 141.724 433.929 145.189 424.08 145.189C413.489 145.189 407.687 139.278 407.687 128.883C407.687 119.507 413.556 112.578 424.35 112.578ZM423.945 115.703C418.008 115.703 416.322 121.07 416.322 126.369H431.568C431.568 121.07 430.016 115.703 423.945 115.703Z",
        "M93.7888 96C102.423 96 109.102 101.571 109.102 108.841C109.102 116.11 102.693 122.021 94.3961 122.021H84.075V139.753C84.075 140.908 84.6148 141.52 85.7616 141.52H91.9V144.373H72V141.52H74.631C76.1824 141.52 76.9917 140.976 76.9917 139.753V100.892C76.9917 99.6688 76.1824 99.1251 74.631 99.1251H72V96H93.7888ZM85.7616 99.1251C84.6148 99.1251 84.0751 99.7367 84.075 100.892V118.896H93.6539C98.4434 118.896 100.467 113.121 100.467 108.909C100.467 104.629 98.5784 99.1251 93.6539 99.1251H85.7616Z",
        "M144.738 112.578C151.956 112.578 153.036 115.431 153.036 119.1C153.036 121.477 151.417 123.856 148.854 123.856C146.965 123.856 145.481 123.04 145.48 121.41C145.48 120.187 146.02 119.236 147.167 118.556C148.111 118.081 148.516 117.673 148.516 117.061C148.516 116.042 146.964 115.907 143.659 115.907C138.195 115.907 131.854 122.701 131.854 132.076V139.821C131.854 140.773 132.394 141.248 133.541 141.248H140.016V144.373H117.081V141.248H123.422C124.366 141.248 124.771 140.772 124.771 139.821V117.945C124.771 116.994 124.366 116.518 123.422 116.518H117.013V113.393H131.854V121.885L132.191 121.953C135.294 115.159 140.556 112.578 144.738 112.578Z",
        "M180.384 139.753C180.384 140.773 180.856 141.248 181.8 141.248H192.998V144.373H161.293V141.248H171.952C172.896 141.248 173.301 140.772 173.301 139.821V117.945C173.301 116.994 172.896 116.518 171.952 116.518H162.508V113.393H180.384V139.753Z",
        "M222.707 112.578C229.52 112.578 232.556 116.042 232.556 122.497V139.958C232.556 140.977 233.028 141.452 233.973 141.452H236.604V144.373H220.751V141.452H223.854C225.001 141.452 225.54 140.977 225.54 140.026V121.749C225.54 117.945 223.921 115.974 220.751 115.974C216.434 115.974 211.914 122.429 211.914 127.66V140.026C211.914 140.977 212.454 141.452 213.6 141.452H216.096V144.373H200.851V141.452H203.482C204.426 141.452 204.898 140.977 204.898 140.026V117.741C204.898 116.79 204.426 116.315 203.482 116.314H200.851V113.393H211.914V119.372H212.251C214.343 115.839 217.85 112.578 222.707 112.578Z",
        "M305.128 139.753C305.128 140.773 305.6 141.248 306.545 141.248H317.743V144.373H286.038V141.248H296.696C297.64 141.248 298.045 140.772 298.045 139.821V117.945C298.045 116.994 297.64 116.518 296.696 116.518H287.252V113.393H305.128V139.753Z",
        "M385.993 139.753C385.993 140.773 386.466 141.248 387.612 141.248H398.676V144.373H366.161V141.248H377.291C378.438 141.248 378.843 140.84 378.843 139.821V100.552C378.843 99.533 378.438 99.1251 377.291 99.1251H366.768V96H385.993V139.753Z",
        "M176.876 96.4074C178.293 96.4074 179.574 96.8153 180.586 97.8344C181.598 98.8535 182.003 100.077 182.003 101.503C182.003 102.93 181.598 104.221 180.586 105.24C179.574 106.259 178.293 106.666 176.876 106.666C175.459 106.666 174.245 106.259 173.233 105.24C172.221 104.221 171.817 102.93 171.817 101.503C171.817 100.077 172.221 98.8535 173.233 97.8344C174.245 96.8153 175.459 96.4074 176.876 96.4074Z",
        "M301.62 96.4074C303.037 96.4074 304.319 96.8153 305.331 97.8344C306.343 98.8535 306.747 100.077 306.747 101.503C306.747 102.93 306.343 104.221 305.331 105.24C304.319 106.259 303.037 106.666 301.62 106.666C300.204 106.666 298.99 106.259 297.978 105.24C296.966 104.221 296.561 102.93 296.561 101.503C296.561 100.077 296.966 98.8535 297.978 97.8344C298.99 96.8153 300.204 96.4074 301.62 96.4074Z"
      ];

      const points: { x: number; y: number }[] = [];

      // Create an offscreen canvas to render the paths
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      if (!ctx) return points;

      // Fill canvas with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 512, 256);

      // Draw all paths in black
      ctx.fillStyle = 'black';
      pathStrings.forEach(pathString => {
        const path = new Path2D(pathString);
        ctx.fill(path);
      });

      // Now sample the canvas - check every 2 pixels
      const imageData = ctx.getImageData(0, 0, 512, 256);
      const data = imageData.data;

      for (let y = 0; y < 256; y += 2) {
        for (let x = 0; x < 512; x += 2) {
          const index = (y * 512 + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];

          // If the pixel is black (or close to black), it's part of a letter
          if (r < 128 && g < 128 && b < 128) {
            // Add some randomness to avoid grid pattern
            const offsetX = (Math.random() - 0.5) * 2;
            const offsetY = (Math.random() - 0.5) * 2;
            points.push({ x: x + offsetX, y: y + offsetY });
          }
        }
      }

      return points;
    };

    const letterPoints = samplePointsFromPath();
    console.log("Letter points sampled:", letterPoints.length);

    if (letterPoints.length === 0) {
      console.error("No letter points found!");
      return;
    }

    // Calculate center position for logo (in viewport coordinates)
    // Scale logo so the letters are roughly 50px height
    const targetLogoHeight = 108;
    const logoScale = targetLogoHeight / 256;
    const logoWidth = 512 * logoScale;
    const logoHeight = 256 * logoScale;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const logoOffsetX = centerX - logoWidth / 2;
    const logoOffsetY = centerY - logoHeight / 2;

    const particleCount = Math.min(1500, letterPoints.length * 3);
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      // End position: a point on the actual letter shapes (centered in viewport)
      const letterPoint = letterPoints[i % letterPoints.length];
      const endX = logoOffsetX + letterPoint.x * logoScale;
      const endY = logoOffsetY + letterPoint.y * logoScale;

      // Start position: random position across the entire viewport
      const startX = Math.random() * dimensions.width;
      const startY = Math.random() * dimensions.height;

      // Create organic curved path with two control points (Bezier curve)
      const controlX1 = startX + (Math.random() - 0.5) * (dimensions.width * 0.3);
      const controlY1 = startY + (Math.random() - 0.5) * (dimensions.height * 0.3);
      const controlX2 = endX + (Math.random() - 0.5) * 200;
      const controlY2 = endY + (Math.random() - 0.5) * 200;

      newParticles.push({
        id: i,
        startX,
        startY,
        endX,
        endY,
        controlX1,
        controlY1,
        controlX2,
        controlY2,
        delay: Math.random() * 0.3, // Reduced from 1.5 for faster animation
      });
    }

    setParticles(newParticles);

    // Enable interaction after particles have settled
    const timer = setTimeout(() => {
      setInteractionEnabled(true);
    }, 1500); // 1.0s animation + 0.5s buffer

    return () => clearTimeout(timer);
  }, [dimensions]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff' }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Particle layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ opacity: showLogo ? 0 : 1, transition: "opacity 0.5s", overflow: "visible" }}
      >
        {particles.map((particle) => {
          // Calculate bezier curve points for smooth organic movement
          const getBezierPoint = (t: number) => {
            const mt = 1 - t;
            const mt2 = mt * mt;
            const t2 = t * t;

            const x = mt2 * mt * particle.startX +
                     3 * mt2 * t * particle.controlX1 +
                     3 * mt * t2 * particle.controlX2 +
                     t2 * t * particle.endX;

            const y = mt2 * mt * particle.startY +
                     3 * mt2 * t * particle.controlY1 +
                     3 * mt * t2 * particle.controlY2 +
                     t2 * t * particle.endY;

            return { x, y };
          };

          // Sample curve at multiple points for animation keyframes
          const point1 = getBezierPoint(0.33);
          const point2 = getBezierPoint(0.66);

          // Calculate center of the logo for breathing effect
          const logoCenterX = dimensions.width / 2;
          const logoCenterY = dimensions.height / 2;

          // Calculate direction from center to this particle
          const dx = particle.endX - logoCenterX;
          const dy = particle.endY - logoCenterY;

          // Create breathing positions - move outward and inward (more subtle)
          const breatheDistance = 3; // pixels to move during breathe
          const breatheOutX = particle.endX + (dx / Math.sqrt(dx * dx + dy * dy)) * breatheDistance;
          const breatheOutY = particle.endY + (dy / Math.sqrt(dx * dx + dy * dy)) * breatheDistance;
          const breatheInX = particle.endX - (dx / Math.sqrt(dx * dx + dy * dy)) * breatheDistance * 0.5;
          const breatheInY = particle.endY - (dy / Math.sqrt(dx * dx + dy * dy)) * breatheDistance * 0.5;

          // Calculate mouse interaction (only if enabled)
          const distanceToMouse = interactionEnabled ? Math.sqrt(
            Math.pow(particle.endX - mousePos.x, 2) + Math.pow(particle.endY - mousePos.y, 2)
          ) : 1000; // Large distance when disabled
          const influenceRadius = 120; // Pixels of influence
          const mouseInfluence = Math.max(0, 1 - distanceToMouse / influenceRadius);
          const repelDistance = 30 * mouseInfluence; // Moderate push
          const mouseAngle = Math.atan2(particle.endY - mousePos.y, particle.endX - mousePos.x);
          const repelX = particle.endX + Math.cos(mouseAngle) * repelDistance;
          const repelY = particle.endY + Math.sin(mouseAngle) * repelDistance;

          return (
            <motion.circle
              key={particle.id}
              r="0.5"
              initial={{
                cx: particle.startX,
                cy: particle.startY,
                fill: "#ffffff",
                opacity: 0
              }}
              animate={{
                cx: interactionEnabled && mouseInfluence > 0 ? repelX : particle.endX,
                cy: interactionEnabled && mouseInfluence > 0 ? repelY : particle.endY,
                fill: isDarkMode
                  ? ["#ffffff", "#cccccc", "#888888", "#ffffff"]
                  : ["#000000", "#333333", "#888888", "#000000"],
                opacity: [0, 0.4, 0.4, 0.4]
              }}
              transition={{
                cx: interactionEnabled && mouseInfluence > 0 ? {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  mass: 0.5
                } : {
                  duration: 1.0, // Reduced from 3.5 for faster animation
                  delay: particle.delay,
                  times: [0, 0.33, 0.66, 1],
                  ease: "easeInOut",
                },
                cy: interactionEnabled && mouseInfluence > 0 ? {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  mass: 0.5
                } : {
                  duration: 1.0, // Reduced from 3.5 for faster animation
                  delay: particle.delay,
                  times: [0, 0.33, 0.66, 1],
                  ease: "easeInOut",
                },
                fill: {
                  duration: 1.0, // Reduced from 3.5 for faster animation
                  delay: particle.delay,
                  times: [0, 0.33, 0.66, 1],
                  ease: "easeInOut",
                },
                opacity: {
                  duration: 1.0, // Reduced from 3.5 for faster animation
                  delay: particle.delay,
                  times: [0, 0.33, 0.66, 1],
                  ease: "easeInOut",
                }
              }}
            >
              {/* Only show breathing animation when mouse isn't actively affecting this particle */}
              {!(interactionEnabled && mouseInfluence > 0) && (
                <>
                  <animate
                    attributeName="cx"
                    values={`${particle.endX};${breatheOutX};${breatheInX};${particle.endX}`}
                    dur="3s"
                    begin={`${1.0 + particle.delay}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values={`${particle.endY};${breatheOutY};${breatheInY};${particle.endY}`}
                    dur="3s"
                    begin={`${1.0 + particle.delay}s`}
                    repeatCount="indefinite"
                  />
                </>
              )}
            </motion.circle>
          );
        })}
      </svg>

      {/* Full logo layer */}
      <motion.svg
        width="512"
        height="256"
        viewBox="0 0 512 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: showLogo ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <rect width="512" height="256" fill="white" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M344.521 112.578C353.628 112.578 357.811 121.342 357.811 128.883C357.811 137.715 353.291 145.189 344.184 145.189C341.014 145.189 338.18 143.83 335.819 141.316L335.415 141.52V155.38C335.415 156.399 335.55 156.875 335.887 156.875H339.732V160H323.205V156.875H326.983C327.927 156.875 328.332 156.467 328.332 155.448V117.945C328.331 116.926 327.927 116.518 326.983 116.518H323.205V113.393H335.415V117.673L335.887 117.809C337.573 115.295 340.744 112.578 344.521 112.578ZM343.172 115.703C338.923 115.703 335.415 121.613 335.415 126.641V132.688C335.415 137.715 338.653 142.064 343.172 142.064C348.569 142.064 349.176 135.338 349.176 128.883C349.176 122.429 348.569 115.703 343.172 115.703Z"
          fill="black"
        />
        <path
          d="M261.523 112.578C270.023 112.578 275.487 114.548 275.487 122.633C275.487 124.263 275.082 125.554 274.272 126.437C273.463 127.32 272.518 127.728 271.372 127.728C270.158 127.728 269.281 127.32 268.471 126.437C267.662 125.554 267.257 124.603 267.257 123.38C267.257 121.07 268.134 119.507 269.821 118.76C270.63 118.624 270.967 118.352 270.967 117.945C270.967 116.042 265.84 115.499 262.265 115.499C254.845 115.499 253.765 121.75 253.765 128.815C253.765 135.406 254.71 142.064 261.995 142.064C268.538 142.064 272.518 139.21 273.395 134.387H276.229C275.014 141.656 269.011 145.189 260.916 145.189C255.857 145.189 251.944 143.558 249.246 140.433C246.548 137.308 245.131 133.435 245.131 128.883C245.131 124.331 246.48 120.459 249.246 117.334C252.147 114.208 256.261 112.578 261.523 112.578Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M424.35 112.578C435.48 112.578 440 119.915 440 129.699H416.322C416.322 137.172 417.874 142.064 425.159 142.064C432.647 142.064 435.615 139.006 436.425 133.911H438.988C437.773 141.724 433.929 145.189 424.08 145.189C413.489 145.189 407.687 139.278 407.687 128.883C407.687 119.507 413.556 112.578 424.35 112.578ZM423.945 115.703C418.008 115.703 416.322 121.07 416.322 126.369H431.568C431.568 121.07 430.016 115.703 423.945 115.703Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M93.7888 96C102.423 96 109.102 101.571 109.102 108.841C109.102 116.11 102.693 122.021 94.3961 122.021H84.075V139.753C84.075 140.908 84.6148 141.52 85.7616 141.52H91.9V144.373H72V141.52H74.631C76.1824 141.52 76.9917 140.976 76.9917 139.753V100.892C76.9917 99.6688 76.1824 99.1251 74.631 99.1251H72V96H93.7888ZM85.7616 99.1251C84.6148 99.1251 84.0751 99.7367 84.075 100.892V118.896H93.6539C98.4434 118.896 100.467 113.121 100.467 108.909C100.467 104.629 98.5784 99.1251 93.6539 99.1251H85.7616Z"
          fill="black"
        />
        <path
          d="M144.738 112.578C151.956 112.578 153.036 115.431 153.036 119.1C153.036 121.477 151.417 123.856 148.854 123.856C146.965 123.856 145.481 123.04 145.48 121.41C145.48 120.187 146.02 119.236 147.167 118.556C148.111 118.081 148.516 117.673 148.516 117.061C148.516 116.042 146.964 115.907 143.659 115.907C138.195 115.907 131.854 122.701 131.854 132.076V139.821C131.854 140.773 132.394 141.248 133.541 141.248H140.016V144.373H117.081V141.248H123.422C124.366 141.248 124.771 140.772 124.771 139.821V117.945C124.771 116.994 124.366 116.518 123.422 116.518H117.013V113.393H131.854V121.885L132.191 121.953C135.294 115.159 140.556 112.578 144.738 112.578Z"
          fill="black"
        />
        <path
          d="M180.384 139.753C180.384 140.773 180.856 141.248 181.8 141.248H192.998V144.373H161.293V141.248H171.952C172.896 141.248 173.301 140.772 173.301 139.821V117.945C173.301 116.994 172.896 116.518 171.952 116.518H162.508V113.393H180.384V139.753Z"
          fill="black"
        />
        <path
          d="M222.707 112.578C229.52 112.578 232.556 116.042 232.556 122.497V139.958C232.556 140.977 233.028 141.452 233.973 141.452H236.604V144.373H220.751V141.452H223.854C225.001 141.452 225.54 140.977 225.54 140.026V121.749C225.54 117.945 223.921 115.974 220.751 115.974C216.434 115.974 211.914 122.429 211.914 127.66V140.026C211.914 140.977 212.454 141.452 213.6 141.452H216.096V144.373H200.851V141.452H203.482C204.426 141.452 204.898 140.977 204.898 140.026V117.741C204.898 116.79 204.426 116.315 203.482 116.314H200.851V113.393H211.914V119.372H212.251C214.343 115.839 217.85 112.578 222.707 112.578Z"
          fill="black"
        />
        <path
          d="M305.128 139.753C305.128 140.773 305.6 141.248 306.545 141.248H317.743V144.373H286.038V141.248H296.696C297.64 141.248 298.045 140.772 298.045 139.821V117.945C298.045 116.994 297.64 116.518 296.696 116.518H287.252V113.393H305.128V139.753Z"
          fill="black"
        />
        <path
          d="M385.993 139.753C385.993 140.773 386.466 141.248 387.612 141.248H398.676V144.373H366.161V141.248H377.291C378.438 141.248 378.843 140.84 378.843 139.821V100.552C378.843 99.533 378.438 99.1251 377.291 99.1251H366.768V96H385.993V139.753Z"
          fill="black"
        />
        <path
          d="M176.876 96.4074C178.293 96.4074 179.574 96.8153 180.586 97.8344C181.598 98.8535 182.003 100.077 182.003 101.503C182.003 102.93 181.598 104.221 180.586 105.24C179.574 106.259 178.293 106.666 176.876 106.666C175.459 106.666 174.245 106.259 173.233 105.24C172.221 104.221 171.817 102.93 171.817 101.503C171.817 100.077 172.221 98.8535 173.233 97.8344C174.245 96.8153 175.459 96.4074 176.876 96.4074Z"
          fill="black"
        />
        <path
          d="M301.62 96.4074C303.037 96.4074 304.319 96.8153 305.331 97.8344C306.343 98.8535 306.747 100.077 306.747 101.503C306.747 102.93 306.343 104.221 305.331 105.24C304.319 106.259 303.037 106.666 301.62 106.666C300.204 106.666 298.99 106.259 297.978 105.24C296.966 104.221 296.561 102.93 296.561 101.503C296.561 100.077 296.966 98.8535 297.978 97.8344C298.99 96.8153 300.204 96.4074 301.62 96.4074Z"
          fill="black"
        />
      </motion.svg>
    </div>
  );
}
