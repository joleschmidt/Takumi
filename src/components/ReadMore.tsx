"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ReadMoreProps {
  text: string;
  maxLines?: number;
  className?: string;
}

export function ReadMore({ text, maxLines = 4, className = "" }: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text || typeof text !== 'string') {
    return <p className={`whitespace-pre-line ${className}`}>{text || ''}</p>;
  }

  // Simple check: if text has more than approximately maxLines * 80 characters, it likely needs truncation
  // This is a heuristic - CSS line-clamp will handle the actual visual truncation
  const estimatedLines = Math.ceil(text.length / 80);
  const likelyNeedsTruncation = estimatedLines > maxLines;

  return (
    <div className={className}>
      <p 
        className={`whitespace-pre-line ${
          !isExpanded ? `line-clamp-${maxLines}` : ''
        }`}
        style={!isExpanded ? {
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        } : {}}
      >
        {text}
      </p>
      {likelyNeedsTruncation && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#6B7F59] hover:text-black transition-colors group"
        >
          {isExpanded ? "Weniger anzeigen" : "Mehr lesen"}
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
        </button>
      )}
    </div>
  );
}
