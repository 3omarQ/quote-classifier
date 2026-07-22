import React from "react";
import { FaGithub } from "react-icons/fa";
import { SiGooglecolab } from "react-icons/si";

function Footer() {
  return (
    <div className="bg-white border border-gray-200 shadow-md p-8 flex flex-col md:flex-row justify-between gap-4 text-sm">
      <a
        href="https://github.com/3omarQ/quote-classifier"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-700 hover:text-gray-950 underline inline-flex items-center gap-2"
      >
        <FaGithub className="w-5 h-5 shrink-0" />
        See how this website was built (GitHub)
      </a>
      <a
        href="https://colab.research.google.com/drive/1XrGvmO_4ZPR6bzYuKkndMATRoWpkXm-9?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-700 hover:text-gray-950 underline inline-flex items-center gap-2"
      >
        <SiGooglecolab className="w-5 h-5 shrink-0" />
        See how the model was created (Google Colab)
      </a>
    </div>
  );
}

export default Footer;
