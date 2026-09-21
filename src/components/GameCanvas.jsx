import React, { useRef, useEffect, useState, useCallback } from 'react';
import { audioManager } from '../lib/audio';
import { Zap, Heart, Sparkles, ArrowUp, ArrowDown } from 'lucide-react';

export function GameCanvas({
  playerObstacle,
  availableObstacles,
  onObstacleSmashed,
  onGameOver,
  playerName
}) {
  const canvasRef = useRef(null);
  
  // Mobile vs Desktop Viewport State
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Game State Refs (mutated inside loop for zero lag)
  const gameStateRef = useRef({
    isRunning: true,
    score: 0,
    modaksCollected: 0,
    obstaclesSmashed: 0,
    lives: 3,
    smashCharges: 1,
    modakProgress: 0,
    isSmashing: false,
    smashTimer: 0,
    
    // Timers, Modak Progression & Smooth Speed Ease
    elapsedTime: 0,
    obstacleTimer: 0,
    modakTimer: 0,
    baseSpeedPxPerSec: 150,
    currentSpeedPxPerSec: 150,
    smoothMultiplier: 1.0,
    lastMilestoneTriggered: 0,
    speedUpBannerTimer: 0,
    distance: 0,
    invulnerableTimer: 0,
    shakeTimer: 0,
    frameCount: 0,

    // Cutscene & Divine Blessing State
    hasTriggered20ModakCutscene: false,
    isCutsceneActive: false,
    cutsceneTimer: 0,
    blessedBuffTimer: 0,
    cutsceneMushikaX: 100,

    // Bipedal Player position & Jump Physics
    player: {
      x: 100,
      y: 350,
      width: 56,
      height: 56,
      vy: 0,
      isGrounded: true,
      isDucking: false,
      landingSquashTimer: 0,
      groundY: 350,
    },

    // Arrays
    obstacles: [],
    modaks: [],
    particles: [],
  });

  // Touch gesture ref
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  // Controls State
  const [smashChargesUI, setSmashChargesUI] = useState(1);
  const [modakProgressUI, setModakProgressUI] = useState(0);
  const [livesUI, setLivesUI] = useState(3);
  const [modaksUI, setModaksUI] = useState(0);
  const [smashedUI, setSmashedUI] = useState(0);
  const [isSmashingUI, setIsSmashingUI] = useState(false);
  const [debugInfo, setDebugInfo] = useState({ speedPxSec: 150, modaks: 0, nextMilestone: 10, multiplier: 1.0 });

  // Sync available obstacles pool
  const obstaclesPoolRef = useRef([]);
  useEffect(() => {
    const active = availableObstacles.filter(o => !o.destroyed);
    obstaclesPoolRef.current = active.length > 0 ? active : availableObstacles;
  }, [availableObstacles]);

  // Skip Cutscene Helper
  const skipCutscene = useCallback(() => {
    const state = gameStateRef.current;
    if (state.isCutsceneActive) {
      state.isCutsceneActive = false;
      state.score += 50;
      state.smashCharges += 1;
      state.blessedBuffTimer = 7.0;
      audioManager.playModak();
    }
  }, []);

  // Handle Jump Action
  const triggerJump = useCallback(() => {
    const state = gameStateRef.current;
    if (state.isCutsceneActive) {
      skipCutscene();
      return;
    }
    const p = state.player;
    if (p.isGrounded && state.isRunning) {
      p.vy = isMobile ? -21.5 : -16.8;
      p.isGrounded = false;
      p.isDucking = false;
      p.landingSquashTimer = 0;
      audioManager.playJump();
    }
  }, [isMobile, skipCutscene]);

  // Handle Duck Action
  const setDuck = useCallback((ducking) => {
    const state = gameStateRef.current;
    if (state.isCutsceneActive) {
      skipCutscene();
      return;
    }
    const p = state.player;
    if (p.isGrounded && state.isRunning) {
      p.isDucking = ducking;
    }
  }, [skipCutscene]);

  // Handle Smash Trigger
  const triggerSmash = useCallback(() => {
    const state = gameStateRef.current;
    if (state.isCutsceneActive) {
      skipCutscene();
      return;
    }
    if (state.smashCharges > 0 && !state.isSmashing && state.isRunning) {
      state.smashCharges -= 1;
      state.isSmashing = true;
      state.smashTimer = 3.0;
      setSmashChargesUI(state.smashCharges);
      setIsSmashingUI(true);
      audioManager.playSmash();
    }
  }, [skipCutscene]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        triggerJump();
      } else if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setDuck(true);
      } else if (e.code === 'KeyX' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        e.preventDefault();
        triggerSmash();
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setDuck(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerJump, setDuck, triggerSmash]);

  // Touch Swipe Gesture Handlers
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
      const dt = Date.now() - touchStartRef.current.time;

      if (dt < 400 && Math.abs(dy) > 25) {
        if (dy < -25) {
          triggerJump();
        } else if (dy > 25) {
          setDuck(true);
          setTimeout(() => setDuck(false), 600);
        }
      }
    }
  };

  // Main Delta-Time Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let lastTimestamp = null;

    const canvasWidth = isMobile ? 540 : 860;
    const canvasHeight = isMobile ? 960 : 420;
    const groundY = isMobile ? 904 : 404;

    const p = gameStateRef.current.player;
    p.groundY = isMobile ? 848 : 350;
    p.x = isMobile ? 80 : 100;
    if (p.isGrounded) p.y = p.groundY;

    // Helper: Draw Rounded Rect
    const drawRoundedRect = (x, y, w, h, r, fillColor, strokeColor, strokeWidth = 2) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      }
    };

    // Helper: Text Wrapping
    const wrapText = (text, maxWidth) => {
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0] || '';

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    // DRAW STYLIZED CANVAS LORD GANESHA FIGURE (CUTSCENE MILESTONE)
    const drawGanesha = (x, y, scale = 1.0, isBlessing = false) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      // 1. Radiant Divine Saffron & Gold Halo Glow
      const haloGrad = ctx.createRadialGradient(0, -30, 10, 0, -30, 90);
      haloGrad.addColorStop(0, 'rgba(250, 204, 21, 0.85)');
      haloGrad.addColorStop(0.6, 'rgba(249, 115, 22, 0.4)');
      haloGrad.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.beginPath();
      ctx.arc(0, -30, 90, 0, Math.PI * 2);
      ctx.fillStyle = haloGrad;
      ctx.fill();

      // 2. Lotus Altar Platform
      ctx.fillStyle = '#f472b6'; // Pink petals
      for (let p = -3; p <= 3; p++) {
        ctx.beginPath();
        ctx.ellipse(p * 14, 30, 12, 18, (p * Math.PI) / 12, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-45, 25, 90, 10);

      // 3. Seated Body & Dhoti
      ctx.fillStyle = '#ea580c'; // Saffron Dhoti
      ctx.beginPath();
      ctx.arc(0, 10, 32, 0, Math.PI);
      ctx.fill();

      // Golden Kurta Body
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(0, -10, 22, 26, 0, 0, Math.PI * 2);
      ctx.fill();

      // 4. Elephant Head
      ctx.fillStyle = '#f59e0b'; // Warm Ganesha skin tone
      ctx.beginPath();
      ctx.arc(0, -45, 24, 0, Math.PI * 2);
      ctx.fill();

      // Large Elephant Ears
      ctx.beginPath();
      ctx.ellipse(-26, -45, 16, 22, -0.2, 0, Math.PI * 2);
      ctx.ellipse(26, -45, 16, 22, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.ellipse(-26, -45, 9, 13, -0.2, 0, Math.PI * 2);
      ctx.ellipse(26, -45, 9, 13, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Trunk curving gracefully holding a Modak
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, -38);
      ctx.quadraticCurveTo(-14, -20, -18, -12);
      ctx.stroke();

      // 5. Four Arms & Blessing Mudra
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 6;
      // Abhaya Mudra Blessing Palm (Right Arm raised)
      ctx.beginPath();
      ctx.moveTo(18, -25);
      ctx.lineTo(32, -35);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(34, -38, 6, 0, Math.PI * 2); // Blessing Palm
      ctx.fill();

      // Modak Bowl in Left Hand
      ctx.beginPath();
      ctx.moveTo(-18, -25);
      ctx.lineTo(-30, -20);
      ctx.stroke();

      // 6. High Golden Crown (Mukut)
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.moveTo(-16, -65);
      ctx.lineTo(0, -95);
      ctx.lineTo(16, -65);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.stroke();

      // Crown Jewel & Tilak
      ctx.beginPath();
      ctx.arc(0, -75, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, -50, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      ctx.fill();

      ctx.restore();
    };

    // BIPEDAL MUSHIKA SPRITE
    const drawMushika = (x, y, w, h, frame, isSmashing, isDucking, isGrounded, landingSquashTimer, invulnerable, isBlessed = false) => {
      ctx.save();
      
      if (invulnerable && !isBlessed && Math.floor(frame / 4) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }

      // Drop Shadow
      ctx.beginPath();
      ctx.ellipse(x + w / 2, groundY - 1, isDucking ? 26 : (landingSquashTimer > 0 ? 24 : 20), 5.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fill();

      // Divine Blessing Golden Aura Glow
      if (isBlessed || isSmashing) {
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, w * 0.85, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
        ctx.fill();
      }

      const bob = isGrounded && !isDucking && landingSquashTimer <= 0 ? Math.sin(frame * 0.4) * 2.5 : 0;
      let drawY = isDucking ? y + 20 : y + bob;
      let drawH = isDucking ? h - 20 : h;

      if (!isGrounded) {
        drawH = h + 4;
        drawY = y - 2;
      } else if (landingSquashTimer > 0) {
        drawH = h - 6;
        drawY = y + 6;
      }

      const leanAngle = isGrounded && !isDucking && landingSquashTimer <= 0 ? 0.08 : 0;
      ctx.translate(x + w / 2, drawY + drawH / 2);
      ctx.rotate(leanAngle);
      ctx.translate(-(x + w / 2), -(drawY + drawH / 2));

      // Tail
      const tailWag = Math.sin(frame * 0.3) * 8;
      ctx.beginPath();
      ctx.moveTo(x + 12, drawY + drawH - 18);
      ctx.quadraticCurveTo(x - 12, drawY + drawH - 28 + tailWag, x - 20, drawY + drawH - 14 + tailWag * 0.5);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Legs
      ctx.fillStyle = '#78350f';
      const legStride = Math.sin(frame * 0.4) * 9;

      if (!isGrounded) {
        ctx.fillRect(x + 14, drawY + drawH - 12, 7, 8);
        ctx.fillRect(x + 30, drawY + drawH - 12, 7, 8);
      } else if (isDucking) {
        ctx.fillRect(x + 12, drawY + drawH - 6, 10, 6);
        ctx.fillRect(x + 30, drawY + drawH - 6, 10, 6);
      } else {
        ctx.fillRect(x + 14 - legStride * 0.8, drawY + drawH - 8, 7, 10);
        ctx.fillRect(x + 30 + legStride * 0.8, drawY + drawH - 8, 7, 10);
      }

      // Dhoti
      const dhotiY = drawY + drawH - 26;
      const dhotiH = 18;
      drawRoundedRect(x + 10, dhotiY, w - 20, dhotiH, 6, '#ea580c', '#c2410c', 1.5);

      ctx.fillStyle = '#facc15';
      ctx.fillRect(x + 10, dhotiY + dhotiH - 3, w - 20, 3);
      ctx.fillRect(x + w / 2 - 2, dhotiY, 4, dhotiH);

      // Torso & Kurta
      const torsoY = drawY + 16;
      const torsoH = drawH - 38;
      const torsoGrad = ctx.createLinearGradient(x, torsoY, x + w, torsoY + torsoH);
      torsoGrad.addColorStop(0, '#dc2626');
      torsoGrad.addColorStop(1, '#991b1b');
      drawRoundedRect(x + 12, torsoY, w - 24, torsoH, 10, torsoGrad, '#7f1d1d', 1.5);

      ctx.beginPath();
      ctx.moveTo(x + 18, torsoY);
      ctx.lineTo(x + w / 2, torsoY + 12);
      ctx.lineTo(x + w - 18, torsoY);
      ctx.fillStyle = '#fef3c7';
      ctx.fill();

      ctx.fillStyle = '#facc15';
      ctx.fillRect(x + 11, torsoY + torsoH - 4, w - 22, 3);

      // Arms
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      const armSwing = Math.sin(frame * 0.4) * 8;

      if (!isGrounded) {
        ctx.beginPath();
        ctx.moveTo(x + 14, torsoY + 6);
        ctx.lineTo(x + 6, torsoY - 6);
        ctx.moveTo(x + w - 14, torsoY + 6);
        ctx.lineTo(x + w - 4, torsoY - 6);
        ctx.stroke();
      } else if (isDucking) {
        ctx.beginPath();
        ctx.moveTo(x + 14, torsoY + 8);
        ctx.lineTo(x + 8, torsoY + 16);
        ctx.moveTo(x + w - 14, torsoY + 8);
        ctx.lineTo(x + w - 6, torsoY + 16);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(x + 14, torsoY + 6);
        ctx.lineTo(x + 6 + armSwing, torsoY + 16);
        ctx.moveTo(x + w - 14, torsoY + 6);
        ctx.lineTo(x + w - 4 - armSwing, torsoY + 16);
        ctx.stroke();
      }

      // Head
      const headX = x + w / 2;
      const headY = isDucking ? drawY + 14 : drawY + 12;
      ctx.beginPath();
      ctx.arc(headX, headY, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#a16207';
      ctx.fill();
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Ears & Earring
      ctx.beginPath();
      ctx.arc(headX - 11, headY - 10, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#a16207';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(headX - 11, headY - 10, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#f472b6';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(headX + 11, headY - 10, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#a16207';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(headX + 11, headY - 10, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#f472b6';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(headX + 17, headY - 8, 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Eyes
      ctx.beginPath();
      ctx.arc(headX + 4, headY - 2, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(headX + 5.2, headY - 3.2, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Mouth
      ctx.beginPath();
      ctx.arc(headX + 3, headY + 5, 3.2, 0.2, Math.PI - 0.2);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Nose
      ctx.beginPath();
      ctx.arc(headX + 13, headY + 2, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#f43f5e';
      ctx.fill();

      // Tilak
      ctx.beginPath();
      ctx.arc(headX, headY - 7, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      ctx.fill();

      // Modak
      ctx.beginPath();
      ctx.arc(headX + 12, headY + 12, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#facc15';
      ctx.fill();

      ctx.restore();
    };

    // Helper: Draw Divine Modak Collectible
    const drawModak = (x, y, elapsedTime) => {
      ctx.save();
      const hoverY = y + Math.sin(elapsedTime * 4) * 4;

      ctx.beginPath();
      ctx.arc(x, hoverY, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, hoverY + 3, 9, 0, Math.PI);
      ctx.lineTo(x, hoverY - 9);
      ctx.closePath();
      ctx.fillStyle = '#facc15';
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 4, hoverY + 3);
      ctx.lineTo(x, hoverY - 8);
      ctx.moveTo(x + 4, hoverY + 3);
      ctx.lineTo(x, hoverY - 8);
      ctx.stroke();

      ctx.restore();
    };

    // Category Color Mapping
    const CATEGORY_COLORS = {
      Academic: { fill: '#1e40af', stroke: '#60a5fa', text: '#ffffff' },
      Personal: { fill: '#6b21a8', stroke: '#c084fc', text: '#ffffff' },
      Health: { fill: '#065f46', stroke: '#34d399', text: '#ffffff' },
      Career: { fill: '#9a3412', stroke: '#fb923c', text: '#ffffff' },
      Other: { fill: '#334155', stroke: '#94a3b8', text: '#ffffff' },
    };

    // MAIN GAME LOOP WITH DELTA TIME
    const gameLoop = (timestamp) => {
      const state = gameStateRef.current;
      if (!state.isRunning) return;

      if (!lastTimestamp) lastTimestamp = timestamp;
      const dt = Math.min(0.1, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;

      const dtScale = dt * 60;

      // 1. CHECK FOR 20 MODAKS STORY CUTSCENE TRIGGER (REQUIREMENT #1)
      if (state.modaksCollected >= 20 && !state.hasTriggered20ModakCutscene && !state.isCutsceneActive) {
        state.hasTriggered20ModakCutscene = true;
        state.isCutsceneActive = true;
        state.cutsceneTimer = 0;
        state.cutsceneMushikaX = p.x;
        state.obstacles = []; // Clear obstacles for clean cutscene
      }

      // --- CUTSCENE EXECUTION BRANCH ---
      if (state.isCutsceneActive) {
        state.cutsceneTimer += dt;
        state.frameCount++;

        // Clear Canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Sky & Ground Background
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        skyGrad.addColorStop(0, '#fef3c7');
        skyGrad.addColorStop(1, '#fffdfa');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = '#ea580c';
        ctx.fillRect(0, groundY, canvasWidth, canvasHeight - groundY);
        ctx.fillStyle = '#c2410c';
        ctx.fillRect(0, groundY, canvasWidth, 6);

        // Ganesha Target Position
        const ganeshaX = isMobile ? canvasWidth - 140 : canvasWidth - 180;
        const ganeshaY = isMobile ? groundY - 140 : groundY - 110;
        const targetMushikaX = ganeshaX - 85;

        // Cutscene Steps:
        // Step 1 (~1.0s): Mushika approaches Ganesha
        if (state.cutsceneTimer < 1.2) {
          state.cutsceneMushikaX += (targetMushikaX - state.cutsceneMushikaX) * Math.min(1.0, dt * 3.5);
        }

        // Draw Ganesha
        drawGanesha(ganeshaX, ganeshaY, isMobile ? 1.0 : 1.15, state.cutsceneTimer >= 2.0);

        // Draw Mushika
        drawMushika(
          state.cutsceneMushikaX,
          p.groundY,
          p.width,
          p.height,
          state.frameCount,
          false,
          false,
          true,
          0,
          false,
          state.cutsceneTimer >= 2.4
        );

        // Step 2 & 3: Floating Modak & Sparkle Blessing (~1.2s to 3.2s)
        if (state.cutsceneTimer >= 1.2 && state.cutsceneTimer < 3.2) {
          const modakProgress = Math.min(1.0, (state.cutsceneTimer - 1.2) / 1.0);
          const modakX = (state.cutsceneMushikaX + 30) + (ganeshaX - (state.cutsceneMushikaX + 30)) * modakProgress;
          const modakY = (p.groundY - 10) - (p.groundY - 10 - (ganeshaY - 20)) * modakProgress;
          
          drawModak(modakX, modakY, state.cutsceneTimer);

          if (state.cutsceneTimer >= 2.2) {
            // Sparkles burst
            for (let k = 0; k < 4; k++) {
              const spX = ganeshaX + (Math.random() - 0.5) * 120;
              const spY = ganeshaY + (Math.random() - 0.5) * 120;
              ctx.beginPath();
              ctx.arc(spX, spY, Math.random() * 4 + 2, 0, Math.PI * 2);
              ctx.fillStyle = '#facc15';
              ctx.fill();
            }
          }
        }

        // Step 4: Text Overlay Banner & Complete Cutscene (~3.2s to 4.2s)
        if (state.cutsceneTimer >= 3.0) {
          ctx.save();
          drawRoundedRect(canvasWidth / 2 - 170, 70, 340, 48, 24, '#facc15', '#ca8a04', 3);
          ctx.font = 'extrabold 15px Outfit, sans-serif';
          ctx.fillStyle = '#78350f';
          ctx.textAlign = 'center';
          ctx.fillText("🪔 Ganpati Bappa's Blessing Received!", canvasWidth / 2, 98);
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.fillStyle = '#ea580c';
          ctx.fillText("+50 Bonus Points & 7s Divine Invincibility!", canvasWidth / 2, 114);
          ctx.restore();
        }

        // Skip Prompt
        ctx.font = 'bold 10px Outfit, sans-serif';
        ctx.fillStyle = '#92400e';
        ctx.textAlign = 'center';
        ctx.fillText('Tap screen or press Space to continue', canvasWidth / 2, canvasHeight - 20);

        // Auto Finish Cutscene at 4.2s
        if (state.cutsceneTimer >= 4.2) {
          skipCutscene();
        }

        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }
      // --- END CUTSCENE BRANCH ---

      state.elapsedTime += dt;
      state.frameCount++;

      // MODAK-BASED SPEED PROGRESSION
      const modakMilestones = Math.floor(state.modaksCollected / 10);
      const modakSpeedMult = Math.pow(1.035, modakMilestones);
      const timeSpeedMult = 1.0 + Math.floor(state.elapsedTime / 30) * 0.01;
      
      const targetMultiplier = Math.min(2.2, modakSpeedMult * timeSpeedMult);

      state.smoothMultiplier += (targetMultiplier - state.smoothMultiplier) * Math.min(1.0, dt * 2.5);

      const speedPxPerSec = state.baseSpeedPxPerSec * state.smoothMultiplier;
      state.currentSpeedPxPerSec = speedPxPerSec;

      state.distance += (speedPxPerSec * dt) / 10;
      state.score = Math.floor(state.distance * 10) + (state.obstaclesSmashed * 50);

      // Decrement Divine Blessed Buff Timer
      if (state.blessedBuffTimer > 0) {
        state.blessedBuffTimer -= dt;
        state.invulnerableTimer = Math.max(state.invulnerableTimer, state.blessedBuffTimer);
      }

      if (state.modaksCollected >= state.lastMilestoneTriggered + 10 && state.modaksCollected > 0) {
        state.lastMilestoneTriggered = Math.floor(state.modaksCollected / 10) * 10;
        state.speedUpBannerTimer = 1.2;
      }

      if (state.frameCount % 10 === 0) {
        setDebugInfo({
          speedPxSec: Math.round(speedPxPerSec),
          modaks: state.modaksCollected,
          nextMilestone: (Math.floor(state.modaksCollected / 10) + 1) * 10,
          multiplier: state.smoothMultiplier.toFixed(2)
        });
      }

      if (state.isSmashing) {
        state.smashTimer -= dt;
        if (state.smashTimer <= 0) {
          state.isSmashing = false;
          setIsSmashingUI(false);
        }
      }

      if (state.invulnerableTimer > 0) {
        state.invulnerableTimer -= dt;
      }

      // JUMP PHYSICS
      const gravityVal = isMobile ? 0.82 : 0.62;
      if (p.landingSquashTimer > 0) {
        p.landingSquashTimer -= dt;
      }

      if (!p.isGrounded) {
        p.vy += gravityVal * dtScale;
        p.y += p.vy * dtScale;
        if (p.y >= p.groundY) {
          p.y = p.groundY;
          p.vy = 0;
          p.isGrounded = true;
          p.landingSquashTimer = 0.1;
        }
      }

      // Clear Canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Apply Camera Shake
      ctx.save();
      if (state.shakeTimer > 0) {
        state.shakeTimer -= dt;
        const dx = (Math.random() - 0.5) * 8;
        const dy = (Math.random() - 0.5) * 8;
        ctx.translate(dx, dy);
      }

      // --- 1. DRAW BACKGROUND & GROUND ---
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
      skyGrad.addColorStop(0, '#fef3c7');
      skyGrad.addColorStop(1, '#fffdfa');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.fillStyle = '#ea580c';
      ctx.fillRect(0, groundY, canvasWidth, canvasHeight - groundY);

      ctx.fillStyle = '#c2410c';
      ctx.fillRect(0, groundY, canvasWidth, 6);

      // Ground grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      const lineOffset = (state.elapsedTime * speedPxPerSec) % 40;
      for (let x = -lineOffset; x < canvasWidth; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, groundY + 6);
        ctx.lineTo(x - 20, canvasHeight);
        ctx.stroke();
      }

      // --- 2. SPAWN & UPDATE OBSTACLES ---
      const obstacleInterval = Math.max(1.7, 2.5 - Math.floor(state.elapsedTime / 25) * 0.15);
      state.obstacleTimer += dt;
      if (state.obstacleTimer >= obstacleInterval) {
        state.obstacleTimer = 0;
        const pool = obstaclesPoolRef.current;
        const randomObsData = pool.length > 0 
          ? pool[Math.floor(Math.random() * pool.length)]
          : { id: Date.now(), text: "Campus Obstacle", category: "Academic" };

        const isOverhead = Math.random() < 0.35;
        
        const obsHeight = isMobile ? 52 : 36;
        const obsWidth = isMobile ? 110 : 75;
        const obsY = isOverhead 
          ? (isMobile ? groundY - 145 : groundY - 102) 
          : (isMobile ? groundY - 52 : groundY - 36);

        state.obstacles.push({
          x: canvasWidth + 40,
          y: obsY,
          width: obsWidth,
          height: obsHeight,
          type: isOverhead ? 'OVERHEAD' : 'LOW',
          data: randomObsData,
          smashed: false
        });
      }

      // --- SPAWN MODAKS ALONG REACHABLE PATHS ---
      state.modakTimer += dt;
      if (state.modakTimer >= 1.2) {
        state.modakTimer = 0;
        
        const pathChoice = Math.random();
        let modakY = isMobile ? groundY - 32 : groundY - 22;
        if (pathChoice > 0.65) {
          modakY = isMobile ? groundY - 190 : groundY - 130;
        } else if (pathChoice > 0.35) {
          modakY = isMobile ? groundY - 110 : groundY - 80;
        }

        state.modaks.push({
          x: canvasWidth + 30,
          y: modakY,
          radius: 12,
          collected: false
        });
      }

      // --- TIGHTENED PLAYER HITBOX ---
      const pBox = {
        x: p.x + 14,
        y: p.isDucking ? p.y + 24 : p.y + 12,
        w: (p.width - 20) * 0.75,
        h: (p.isDucking ? p.height - 28 : p.height - 18) * 0.75
      };

      // Update and Draw Obstacles
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        obs.x -= speedPxPerSec * dt;

        const catTheme = CATEGORY_COLORS[obs.data.category] || CATEGORY_COLORS.Other;

        if (obs.type === 'OVERHEAD') {
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(obs.x + 6, groundY);
          ctx.lineTo(obs.x + 6, obs.y + obs.height);
          ctx.moveTo(obs.x + obs.width - 6, groundY);
          ctx.lineTo(obs.x + obs.width - 6, obs.y + obs.height);
          ctx.stroke();

          drawRoundedRect(obs.x, obs.y, obs.width, obs.height, 8, catTheme.fill, catTheme.stroke, 2);

          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 9px Outfit, sans-serif';
          ctx.fillText('⬇ DUCK', obs.x + 6, obs.y + 12);

          ctx.font = 'bold 10px Outfit, sans-serif';
          ctx.fillStyle = catTheme.text;
          const lines = wrapText(obs.data.text, obs.width - 12);
          lines.slice(0, 1).forEach((line) => {
            ctx.fillText(line, obs.x + 6, obs.y + 25);
          });
        } else {
          drawRoundedRect(obs.x, obs.y, obs.width, obs.height, 8, catTheme.fill, catTheme.stroke, 2);

          ctx.fillStyle = catTheme.stroke;
          ctx.fillRect(obs.x + 4, obs.y + 3, obs.width - 8, 2.5);

          ctx.font = 'bold 9px Outfit, sans-serif';
          ctx.fillStyle = '#fde047';
          ctx.fillText(`⬆ JUMP`, obs.x + 6, obs.y + 12);

          ctx.font = 'bold 10px Outfit, sans-serif';
          ctx.fillStyle = catTheme.text;
          const lines = wrapText(obs.data.text, obs.width - 12);
          lines.slice(0, 1).forEach((line) => {
            ctx.fillText(line, obs.x + 6, obs.y + 25);
          });
        }

        const obsBox = {
          x: obs.x + 6,
          y: obs.y + 6,
          w: obs.width - 12,
          h: obs.height - 10
        };

        const isColliding = 
          pBox.x < obsBox.x + obsBox.w &&
          pBox.x + pBox.w > obsBox.x &&
          pBox.y < obsBox.y + obsBox.h &&
          pBox.y + pBox.h > obsBox.y;

        if (isColliding && !obs.smashed) {
          if (state.isSmashing || state.blessedBuffTimer > 0) {
            obs.smashed = true;
            state.obstaclesSmashed += 1;
            setSmashedUI(state.obstaclesSmashed);
            state.shakeTimer = 0.2;

            for (let k = 0; k < 25; k++) {
              state.particles.push({
                x: obs.x + obs.width / 2,
                y: obs.y + obs.height / 2,
                vx: (Math.random() - 0.5) * 14,
                vy: (Math.random() - 0.8) * 12,
                size: Math.random() * 7 + 4,
                color: Math.random() > 0.5 ? '#facc15' : catTheme.stroke,
                life: 0.6
              });
            }

            audioManager.playSmash();
            onObstacleSmashed(obs.data);
            state.obstacles.splice(i, 1);
            continue;
          } else if (state.invulnerableTimer <= 0) {
            state.lives -= 1;
            setLivesUI(state.lives);
            state.invulnerableTimer = 1.5;
            state.shakeTimer = 0.25;
            audioManager.playHurt();

            if (state.lives <= 0) {
              state.isRunning = false;
              audioManager.playGameOver();
              onGameOver({
                score: state.score,
                modaks: state.modaksCollected,
                smashed: state.obstaclesSmashed
              });
              return;
            }
          }
        }

        if (obs.x + obs.width < -50) {
          state.obstacles.splice(i, 1);
        }
      }

      // --- 3. UPDATE & DRAW MODAKS ---
      for (let j = state.modaks.length - 1; j >= 0; j--) {
        const m = state.modaks[j];
        m.x -= speedPxPerSec * dt;

        drawModak(m.x, m.y, state.elapsedTime);

        const dist = Math.hypot((p.x + p.width / 2) - m.x, (p.y + p.height / 2) - m.y);
        if (dist < 28 && !m.collected) {
          m.collected = true;
          state.modaksCollected += 1;
          setModaksUI(state.modaksCollected);

          state.modakProgress += 1;
          if (state.modakProgress >= 5) {
            state.modakProgress = 0;
            state.smashCharges += 1;
            setSmashChargesUI(state.smashCharges);
          }
          setModakProgressUI(state.modakProgress);

          audioManager.playModak();
          state.modaks.splice(j, 1);
          continue;
        }

        if (m.x < -30) {
          state.modaks.splice(j, 1);
        }
      }

      // --- 4. PARTICLES EXPLOSION ---
      for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
        const pt = state.particles[pIdx];
        pt.x += pt.vx * dtScale;
        pt.y += pt.vy * dtScale;
        pt.vy += 0.4 * dtScale;
        pt.life -= dt;

        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);

        if (pt.life <= 0) {
          state.particles.splice(pIdx, 1);
        }
      }

      // --- 5. DRAW PLAYER ---
      drawMushika(
        p.x, 
        p.y, 
        p.width, 
        p.height, 
        state.frameCount, 
        state.isSmashing, 
        p.isDucking, 
        p.isGrounded,
        p.landingSquashTimer,
        state.invulnerableTimer > 0,
        state.blessedBuffTimer > 0
      );

      // --- 6. SPEED UP BANNER VISUAL CUE ---
      if (state.speedUpBannerTimer > 0) {
        state.speedUpBannerTimer -= dt;
        const alpha = Math.min(1, state.speedUpBannerTimer);
        const bannerY = isMobile ? 120 - (1.2 - state.speedUpBannerTimer) * 20 : 70 - (1.2 - state.speedUpBannerTimer) * 15;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        drawRoundedRect(canvasWidth / 2 - 95, bannerY, 190, 32, 16, '#facc15', '#ca8a04', 2);
        ctx.font = 'extrabold 13px Outfit, sans-serif';
        ctx.fillStyle = '#78350f';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ SPEED UP! (+3.5%)', canvasWidth / 2, bannerY + 20);
        ctx.restore();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onObstacleSmashed, onGameOver, isMobile, skipCutscene]);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center px-1 sm:px-0">
      
      {/* MOBILE RESPONSIVE COMPACT HUD OVERLAY BAR */}
      <div className="w-full bg-slate-900/95 text-white rounded-t-2xl px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between border-b border-saffron-500/30 gap-2 shadow-lg backdrop-blur-md z-10">
        
        {/* Lives */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium mr-0.5">Lives:</span>
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                i < livesUI 
                  ? 'text-red-500 fill-red-500 animate-pulse' 
                  : 'text-slate-600 fill-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Modaks Collected */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full gold-gradient-bg flex items-center justify-center text-[10px] sm:text-xs text-amber-900 font-bold shadow">
            🥮
          </div>
          <span className="font-bold text-amber-300 text-xs sm:text-sm">{modaksUI} Modaks</span>
        </div>

        {/* Obstacles Smashed */}
        <div className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
          <span className="font-bold text-saffron-300 text-xs sm:text-sm">{smashedUI} Smashed</span>
        </div>

        {/* Smash Meter & Charge Button */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[9px] uppercase font-bold tracking-wider text-amber-400">Smash Charge</span>
            <div className="w-20 h-2 bg-slate-800 rounded-full border border-amber-500/40 overflow-hidden">
              <div 
                className="h-full gold-gradient-bg transition-all duration-300"
                style={{ width: `${(modakProgressUI / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={triggerSmash}
            disabled={smashChargesUI <= 0 || isSmashingUI}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md min-h-[38px] ${
              isSmashingUI
                ? 'bg-amber-400 text-amber-950 animate-bounce'
                : smashChargesUI > 0
                ? 'saffron-gradient-bg text-white hover:scale-105 active:scale-95'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{isSmashingUI ? 'SMASHING!' : `SMASH (${smashChargesUI})`}</span>
          </button>
        </div>

      </div>

      {/* 9:16 MOBILE CANVAS CONTAINER & DESKTOP WIDESCREEN CONTAINER */}
      <div 
        className={`relative w-full shadow-2xl border-x border-b border-saffron-500/20 overflow-hidden rounded-b-2xl bg-slate-900 touch-none flex flex-col items-center justify-center ${
          isMobile 
            ? 'aspect-[9/16] max-h-[calc(100vh-140px)] w-auto mx-auto' 
            : ''
        }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={isMobile ? 540 : 860}
          height={isMobile ? 960 : 420}
          className="w-full h-full object-contain block touch-none cursor-pointer"
          onClick={triggerJump}
        />

        {/* TEMPORARY ON-SCREEN DEBUG DISPLAY */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-4 bg-slate-950/85 text-emerald-400 border border-emerald-500/40 font-mono text-[10px] sm:text-[11px] px-2.5 py-1 rounded-lg shadow-md backdrop-blur-sm pointer-events-none z-20">
          <div className="font-bold text-amber-300 text-[9px] sm:text-[10px] uppercase tracking-wider border-b border-emerald-500/30 pb-0.5 mb-0.5">
            🐞 20 Modak Story Cutscene
          </div>
          <div>Speed: <span className="text-white font-bold">{debugInfo.speedPxSec} px/s</span></div>
          <div>Modaks: <span className="text-yellow-300 font-bold">{debugInfo.modaks} / 20 Story Cutscene</span></div>
        </div>

        {/* Dynamic Controls Hint Overlay */}
        <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-[10px] sm:text-[11px] text-amber-200/80 pointer-events-none">
          <span className="hidden sm:inline">Controls: [Space/Up] Jump | [Down/S] Duck | [X/Shift] Super Smash</span>
          <span className="sm:hidden">Swipe Up / Tap to Jump • Swipe Down to Duck</span>
        </div>
      </div>

      {/* ON-SCREEN MOBILE TOUCH BUTTONS */}
      <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 mt-3">
        <button
          onClick={triggerJump}
          className="flex items-center justify-center gap-1.5 py-3.5 bg-saffron-600 text-white font-extrabold text-sm rounded-xl shadow-lg active:bg-saffron-700 min-h-[48px] touch-manipulation"
        >
          <ArrowUp className="w-5 h-5" /> JUMP
        </button>

        <button
          onMouseDown={() => setDuck(true)}
          onMouseUp={() => setDuck(false)}
          onTouchStart={() => setDuck(true)}
          onTouchEnd={() => setDuck(false)}
          className="flex items-center justify-center gap-1.5 py-3.5 bg-amber-600 text-white font-extrabold text-sm rounded-xl shadow-lg active:bg-amber-700 min-h-[48px] touch-manipulation"
        >
          <ArrowDown className="w-5 h-5" /> DUCK
        </button>

        <button
          onClick={triggerSmash}
          disabled={smashChargesUI <= 0}
          className={`flex items-center justify-center gap-1 py-3.5 font-extrabold text-sm rounded-xl shadow-lg min-h-[48px] touch-manipulation ${
            smashChargesUI > 0
              ? 'gold-gradient-bg text-amber-950 active:scale-95'
              : 'bg-slate-300 text-slate-500'
          }`}
        >
          <Zap className="w-5 h-5" /> SMASH ({smashChargesUI})
        </button>
      </div>

    </div>
  );
}
