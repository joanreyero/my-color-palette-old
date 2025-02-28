"use client";

export default function Animations() {
  return (
    <style jsx global>{`
      @keyframes float-slow {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-20px);
        }
      }
      @keyframes float-medium {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-15px);
        }
      }
      @keyframes float-fast {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      .animate-float-slow {
        animation: float-slow 8s ease-in-out infinite;
      }
      .animate-float-medium {
        animation: float-medium 6s ease-in-out infinite;
      }
      .animate-float-fast {
        animation: float-fast 4s ease-in-out infinite;
      }
    `}</style>
  );
}
