"use client";

export default function Footer() {
  return (
    <footer className="border-t-8 border-[#121217] bg-[#121217] py-16 px-4 text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-black mb-2 uppercase italic">
            Game of Sol
          </h2>
          <p className="text-gray-600 text-xs tracking-widest uppercase italic">
            The Collectibles
          </p>
        </div>

        {/* Social Links */}
        <div className="flex gap-10">
          <a
            href="https://x.com/GOScollectibles"
            className="hover:text-[#913f8d] transition-colors"
            target="_blank"
            rel="noopener noreferrer" // Sigurnija opcija za rel
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z"></path>
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-[10px] text-gray-600 uppercase tracking-widest leading-loose">
          © 2026 Game of Sol
          <br />
          All Rights Reserved
        </div>
      </div>
    </footer>
  );
}