"use client";

import { useState } from "react";
import {
  TREE_CARDS,
  TREE_PORTRAIT_NODES,
  TREE_ROOT_BENON,
  type TreeNodeData,
} from "@/features/tree/publicTreeData";

export function PublicTreeIllustration() {
  const [hoveredNode, setHoveredNode] = useState<TreeNodeData | null>(null);

  return (
    <div className="relative mx-auto w-full max-w-5xl select-none px-2 sm:px-4">
      <svg
        viewBox="0 0 1000 680"
        className="h-auto w-full overflow-visible"
        aria-label="IMENA Family Tree Branches Illustration"
      >
        <defs>
          {/* Clip paths for each circular portrait */}
          {TREE_PORTRAIT_NODES.map((node) => (
            <clipPath key={`clip-${node.id}`} id={`clip-${node.id}`}>
              <circle cx={node.cx} cy={node.cy} r={node.r} />
            </clipPath>
          ))}
          <clipPath id="clip-benon">
            <circle
              cx={TREE_ROOT_BENON.cx}
              cy={TREE_ROOT_BENON.cy}
              r={TREE_ROOT_BENON.r}
            />
          </clipPath>

          {/* Soft drop shadow for nodes & tooltips */}
          <filter id="node-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="3"
              floodColor="#000000"
              floodOpacity="0.15"
            />
          </filter>
        </defs>

        {/* -------------------------------------------------------------
            BACKGROUND OUTLINE ORNAMENTS (Sun, House, Tree)
        ------------------------------------------------------------- */}
        <g stroke="#cbd5e1" strokeWidth="2.5" fill="none" opacity="0.75">
          {/* Sun in top-left */}
          <g transform="translate(25, 75)">
            <circle cx="45" cy="45" r="22" />
            <line x1="45" y1="12" x2="45" y2="2" />
            <line x1="45" y1="78" x2="45" y2="88" />
            <line x1="12" y1="45" x2="2" y2="45" />
            <line x1="78" y1="45" x2="88" y2="45" />
            <line x1="22" y1="22" x2="15" y2="15" />
            <line x1="68" y1="68" x2="75" y2="75" />
            <line x1="22" y1="68" x2="15" y2="75" />
            <line x1="68" y1="22" x2="75" y2="15" />
          </g>

          {/* House in bottom-left */}
          <g transform="translate(30, 480)">
            <path
              d="M15 50 L45 18 L75 50 L75 85 L15 85 Z"
              strokeLinejoin="round"
            />
            <path d="M35 85 L35 58 L55 58 L55 85" strokeLinejoin="round" />
          </g>

          {/* Tree in bottom-right */}
          <g transform="translate(805, 500)">
            <path
              d="M48 20 C32 20 20 32 20 48 C20 62 30 72 42 75 L42 105 L54 105 L54 75 C66 72 76 62 76 48 C76 32 64 20 48 20 Z"
              strokeLinejoin="round"
            />
            <line x1="28" y1="105" x2="68" y2="105" />
          </g>
        </g>

        {/* -------------------------------------------------------------
            ORGANIC CONNECTING BRANCHES (matching media_1793182339302.png)
        ------------------------------------------------------------- */}
        <g
          stroke="#1e2025"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Branch 1: Top-left entry into Benon circle */}
          <path d="M 25 150 C 70 150, 110 160, 130 180" />

          {/* Branch 2: From Benon down to Pacifique & Patience pair */}
          <path d="M 190 277 C 190 320, 210 320, 232 295" />

          {/* Branch 3: Under Pacifique and Patience to lower card */}
          <path d="M 271 295 C 271 360, 290 400, 310 440" />

          {/* Branch 4: Loop from Benon rightwards into upper middle branch */}
          <path d="M 262 205 C 340 220, 370 200, 425 175" />

          {/* Branch 5: Top center entry down to Laurent & Celia */}
          <path d="M 425 100 C 425 140, 425 150, 425 175" />
          <path d="M 425 211 C 425 290, 415 320, 415 355" />
          <path d="M 462 178 C 462 280, 492 310, 492 350" />

          {/* Branch 6: Deep looping branch under Laurent & Celia to Prince & Loic */}
          <path d="M 500 218 C 500 320, 560 410, 620 370 C 660 340, 665 240, 675 191" />

          {/* Branch 7: From Prince & Loic down towards Frank & Bernice */}
          <path d="M 675 191 C 675 260, 690 300, 710 350" />
          <path d="M 750 201 C 750 260, 765 300, 782 350" />

          {/* Branch 8: Right long curve from Loic down to lower cards */}
          <path d="M 786 165 C 830 180, 840 290, 770 360 C 720 400, 620 420, 500 480" />

          {/* Branch 9: Connecting lower pair (Shallon & Joella) */}
          <path d="M 415 425 C 415 470, 385 490, 365 520" />
          <path d="M 365 556 C 390 600, 430 600, 455 566" />
          <path d="M 455 566 C 475 540, 490 540, 500 545" />
        </g>

        {/* -------------------------------------------------------------
            ROUNDED RECTANGLE CARDS
        ------------------------------------------------------------- */}
        <g fill="#e2e5eb" stroke="#c9ced8" strokeWidth="1.2">
          {TREE_CARDS.map((card) => (
            <rect
              key={card.id}
              x={card.x}
              y={card.y}
              width={card.w}
              height={card.h}
              rx="15"
              className="transition-colors hover:fill-[#d5d9e2]"
            />
          ))}
        </g>

        {/* -------------------------------------------------------------
            PORTRAIT NODES (Family Members: Photo + Single Name)
        ------------------------------------------------------------- */}
        {TREE_PORTRAIT_NODES.map((node) => {
          const isHovered = hoveredNode?.id === node.id;
          return (
            <g
              key={node.id}
              className="cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label={`Family member ${node.name}`}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              onFocus={() => setHoveredNode(node)}
              onBlur={() => setHoveredNode(null)}
            >
              <title>{node.name}</title>

              {/* White backing & shadow */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                fill="#ffffff"
                filter="url(#node-shadow)"
              />

              {/* Photo */}
              {node.imageUrl ? (
                <image
                  href={node.imageUrl}
                  x={node.cx - node.r}
                  y={node.cy - node.r}
                  width={node.r * 2}
                  height={node.r * 2}
                  clipPath={`url(#clip-${node.id})`}
                  preserveAspectRatio="xMidYMid slice"
                />
              ) : (
                /* Fallback clean avatar */
                <g clipPath={`url(#clip-${node.id})`}>
                  <rect
                    x={node.cx - node.r}
                    y={node.cy - node.r}
                    width={node.r * 2}
                    height={node.r * 2}
                    fill="#e2e8f0"
                  />
                  <circle
                    cx={node.cx}
                    cy={node.cy - 6}
                    r={node.r * 0.38}
                    fill="#94a3b8"
                  />
                  <ellipse
                    cx={node.cx}
                    cy={node.cy + node.r * 0.75}
                    rx={node.r * 0.65}
                    ry={node.r * 0.45}
                    fill="#94a3b8"
                  />
                </g>
              )}

              {/* Outer stroke ring */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                fill="none"
                stroke={isHovered ? "#0d1aba" : "#1e2025"}
                strokeWidth={isHovered ? 3.5 : 2}
                className="transition-all duration-200"
              />

              {/* Single Name label */}
              <text
                x={node.cx}
                y={node.cy + node.r + 17}
                textAnchor="middle"
                fontSize="12.5"
                fontWeight="700"
                fill={isHovered ? "#0d1aba" : "#1e2025"}
                className="transition-colors duration-150"
              >
                {node.name}
              </text>

              {/* 100% Guaranteed Mouse Hitbox */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r + 8}
                fill="#ffffff"
                opacity="0.001"
                style={{ cursor: "pointer", pointerEvents: "all" }}
              />
            </g>
          );
        })}

        {/* -------------------------------------------------------------
            THE FIRST CIRCLE: ROOT (BENON)
            "on the image i uploaded .. the first circle .. u may leave it
            blank .. or add icon of no profile page icon ... and when a
            perso hovers it shows a text called Benon...."
        ------------------------------------------------------------- */}
        <g
          className="cursor-pointer"
          tabIndex={0}
          role="button"
          aria-label="Root ancestor Benon"
          onMouseEnter={() => setHoveredNode(TREE_ROOT_BENON)}
          onMouseLeave={() => setHoveredNode(null)}
          onFocus={() => setHoveredNode(TREE_ROOT_BENON)}
          onBlur={() => setHoveredNode(null)}
        >
          <title>Benon</title>

          {/* Large circular node */}
          <circle
            cx={TREE_ROOT_BENON.cx}
            cy={TREE_ROOT_BENON.cy}
            r={TREE_ROOT_BENON.r}
            fill="#e2e8f0"
            filter="url(#node-shadow)"
            stroke={hoveredNode?.id === "benon-root" ? "#0d1aba" : "#1e2025"}
            strokeWidth={hoveredNode?.id === "benon-root" ? 4 : 2.5}
            className="transition-all duration-200"
          />

          {/* Clean No-Profile Avatar Silhouette Icon */}
          <g clipPath="url(#clip-benon)">
            <circle
              cx={TREE_ROOT_BENON.cx}
              cy={TREE_ROOT_BENON.cy - 14}
              r={26}
              fill="#94a3b8"
            />
            <ellipse
              cx={TREE_ROOT_BENON.cx}
              cy={TREE_ROOT_BENON.cy + 50}
              rx={50}
              ry={35}
              fill="#94a3b8"
            />
          </g>

          {/* 100% Guaranteed Mouse Hitbox */}
          <circle
            cx={TREE_ROOT_BENON.cx}
            cy={TREE_ROOT_BENON.cy}
            r={TREE_ROOT_BENON.r + 10}
            fill="#ffffff"
            opacity="0.001"
            style={{ cursor: "pointer", pointerEvents: "all" }}
          />
        </g>

        {/* -------------------------------------------------------------
            FLOATING TOOLTIP (Direct SVG element above hovered node)
        ------------------------------------------------------------- */}
        {hoveredNode && (
          <g
            className="pointer-events-none transition-all duration-150"
            transform={`translate(${hoveredNode.cx}, ${hoveredNode.cy - hoveredNode.r - 20})`}
          >
            <rect
              x="-50"
              y="-16"
              width="100"
              height="32"
              rx="16"
              fill="#0d1aba"
              filter="url(#node-shadow)"
            />
            <text
              x="0"
              y="4.5"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="13"
              fontWeight="700"
              fontFamily="var(--font-sans), sans-serif"
            >
              {hoveredNode.name}
            </text>
            <polygon points="-5,16 5,16 0,22" fill="#0d1aba" />
          </g>
        )}
      </svg>
    </div>
  );
}
