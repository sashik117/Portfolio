import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onHoverIn = () => setHovering(true);
    const onHoverOut = () => setHovering(false);

    const interactiveSelector = "a, button, [data-cursor='hover'], input, textarea, select";

    const addListeners = () => {
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.addEventListener("mouseenter", onHoverIn);
        el.addEventListener("mouseleave", onHoverOut);
      });
    };

    // Use MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    addListeners();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      observer.disconnect();
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.removeEventListener("mouseenter", onHoverIn);
        el.removeEventListener("mouseleave", onHoverOut);
      });
    };
  }, []);

  // Hide on touch devices
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  if (isTouchDevice) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border"
        style={{ borderColor: "hsl(var(--primary))" }}
        animate={{
          x: pos.x - (hovering ? 20 : 16),
          y: pos.y - (hovering ? 20 : 16),
          width: hovering ? 40 : 32,
          height: hovering ? 40 : 32,
          opacity: visible ? (hovering ? 0.6 : 0.4) : 0,
          scale: clicking ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.5 }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{ backgroundColor: "hsl(var(--primary))" }}
        animate={{
          x: pos.x - (hovering ? 4 : 3),
          y: pos.y - (hovering ? 4 : 3),
          width: hovering ? 8 : 6,
          height: hovering ? 8 : 6,
          opacity: visible ? 1 : 0,
          scale: clicking ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 600, damping: 30, mass: 0.2 }}
      />

      {/* Hover glow */}
      {hovering && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
          style={{ background: "hsl(var(--primary) / 0.12)" }}
          initial={{ opacity: 0, width: 60, height: 60 }}
          animate={{
            x: pos.x - 30,
            y: pos.y - 30,
            opacity: visible ? 1 : 0,
          }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 250, damping: 25 }}
        />
      )}
    </>
  );
}