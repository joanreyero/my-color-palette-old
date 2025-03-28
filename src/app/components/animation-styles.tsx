"use client";

/**
 * Client component that provides global animation styles
 * This allows us to use styled-jsx in a client component instead of a server component
 */
export function AnimationStyles() {
  return (
    <style jsx global>{`
      .animate-spin-slow {
        animation: spin 18s linear infinite;
      }

      .animate-spin-slow-reverse {
        animation: spin 15s linear infinite reverse;
      }

      .animate-rotate-slow {
        animation: rotate 20s ease-in-out infinite alternate;
      }

      .animate-rotate-slow-reverse {
        animation: rotate 25s ease-in-out infinite alternate-reverse;
      }

      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(45deg);
        }
      }

      .animate-ping-slow {
        animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
      }

      @keyframes ping {
        0% {
          transform: scale(1);
          opacity: 0.8;
        }
        75%,
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .animate-float-slow {
        animation: float 8s ease-in-out infinite;
      }

      .animate-float-medium {
        animation: float 6s ease-in-out infinite;
      }

      .animate-float-fast {
        animation: float 4s ease-in-out infinite;
      }

      @keyframes float {
        0% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-20px);
        }
        100% {
          transform: translateY(0);
        }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes fadeInSlide {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes growBarWidth {
        from {
          transform: scaleX(0);
        }
        to {
          transform: scaleX(1);
        }
      }
    `}</style>
  );
}
