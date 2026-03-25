import useWindowStore from "#store/window.js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useLayoutEffect, useRef } from "react";

const WindowWrapper = (Component, windowKey) => {
  const Wrapper = (props) => {
    const { focusWindow, windows } = useWindowStore();
    const { isOpen, isMaximized, zIndex } = windows[windowKey];
    const ref = useRef(null);
    const draggableRef = useRef(null); // ✅ store Draggable instance

    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen) return;

      el.style.display = "block";

      gsap.fromTo(
        el,
        { scale: 0.8, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
      );
    }, [isOpen]);

    useGSAP(() => {
      const el = ref.current;
      if (!el) return;

      // ✅ store instance so we can enable/disable it later
      draggableRef.current = Draggable.create(el, {
        onPress: () => focusWindow(windowKey),
      })[0];
    }, []);

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;

      el.style.display = isOpen ? "block" : "none";
      el.style.width = isMaximized ? "100vw" : "";
      el.style.height = isMaximized ? "100vh" : "";
      el.style.top = isMaximized ? "0" : "";
      el.style.left = isMaximized ? "0" : "";

      // ✅ disable drag when maximized, re-enable when restored
      if (draggableRef.current) {
        isMaximized
          ? draggableRef.current.disable()
          : draggableRef.current.enable();
      }
    }, [isOpen, isMaximized]); // ✅ added isMaximized to deps

    return (
      <section id={windowKey} ref={ref} style={{ zIndex }} className="absolute">
        <Component {...props} />
      </section>
    );
  };

  Wrapper.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;

  return Wrapper;
};

export default WindowWrapper;
