import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 400, default: 100 },
  title: { min: 400, max: 900, default: 400 }, // Fixed 'dafault' typo
};

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={`${className} inline-block transition-none`} // Added transition-none to prevent CSS/GSAP conflict
      style={{
        fontVariationSettings: `'wght' ${baseWeight}`,
        fontWeight: 400, // <--- CRITICAL: Forces variable axis usage
        display: "inline-block",
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

const setupTextHover = (container, type) => {
  if (!container) return () => {};

  const letters = container.querySelectorAll("span");
  const { min, max, default: base } = FONT_WEIGHTS[type];

  const handleMouseMove = (e) => {

    const { left: containerLeft } = container.getBoundingClientRect();
    const mouseX = e.clientX - containerLeft;

    letters.forEach((letter) => {
      const { left: l, width: w } = letter.getBoundingClientRect();
      const letterCenter = l - containerLeft + w / 2;
      const distance = Math.abs(mouseX - letterCenter);

      // Proximity logic: letters closer to mouse get higher weight
      const intensity = Math.exp(-(distance ** 2) / 2000);
      // const targetWeight = min + (max - min) * intensity;

      const targetWeight = min + (max - min) * intensity;

      gsap.to(letter, {
        duration: 0.3,
        ease: "power2.out",
        // Use camelCase for GSAP
        fontVariationSettings: `'wght' ${targetWeight}`,
        overwrite: "auto", // Efficiently handles fast mouse movement
      });
    });
  };

  const handleMouseLeave = () => {
    // Reset all letters to base weight when mouse leaves the container
    gsap.to(letters, {
      duration: 0.5,
      fontVariationSettings: `'wght' ${base}`,
      overwrite: true,
    });
  };

  // MUST attach the listeners to the element
  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  // Return a cleanup function to be used in useGSAP
  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  };
};

const Welcome = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useGSAP(() => {
    // Initialize both sections and store cleanup functions
    const cleanupTitle = setupTextHover(titleRef.current, "title");
    const cleanupSubtitle = setupTextHover(subtitleRef.current, "subtitle");

    return () => {
      cleanupTitle();
      cleanupSubtitle();
    };
  }, []);

  return (
    <section
      id="welcome"
      className="min-h-screen flex flex-col justify-center p-10 select-none"
    >
      <div ref={subtitleRef}>
        {renderText(
          "Hey, I'm Mohammed! Welcome to my",
          "text-3xl font-georama",
          100,
        )}
      </div>
      <h1 ref={titleRef} className="mt-7">
        {renderText("portfolio", "text-9xl italic font-georama", 400)}
      </h1>

      <div className="hidden max-md:block mt-10">
        <p>This Portfolio is designed for desktop/tablet screens only.</p>
      </div>
    </section>
  );
};
export default Welcome;
