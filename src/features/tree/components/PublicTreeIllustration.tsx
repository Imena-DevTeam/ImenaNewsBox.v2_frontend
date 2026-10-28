"use client";

import { useState } from "react";
import {
  TREE_CARDS,
  TREE_PORTRAIT_NODES,
  TREE_ROOT_BENON,
  type PromotionYear,
  type TreeNodeData,
} from "@/features/tree/publicTreeData";

interface PublicTreeIllustrationProps {
  activeYear?: PromotionYear;
  onSelectYear?: (year: PromotionYear) => void;
}

export function PublicTreeIllustration({
  activeYear,
  onSelectYear,
}: PublicTreeIllustrationProps) {
  const [hoveredNode, setHoveredNode] = useState<TreeNodeData | null>(null);

  const handleNodeClick = (node: TreeNodeData) => {
    if (onSelectYear && node.generation) {
      onSelectYear(node.generation);
      const el = document.getElementById("promotion-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isGenActiveOrHovered = (gen: string) => {
    return hoveredNode?.generation === gen || activeYear === gen;
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl px-2 select-none sm:px-4">
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
              floodOpacity="0.14"
            />
          </filter>

          {/* Soft violet lineage glow for active/hovered branch */}
          <filter id="branch-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* -------------------------------------------------------------
            ORGANIC CONNECTING BRANCHES (with Lineage Glowing on Hover)
        ------------------------------------------------------------- */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Branch 1: Top-left entry into Benon circle */}
          <path
            d="M 25 150 C 70 150, 110 160, 130 180"
            stroke="#1e2025"
            strokeWidth={2.5}
          />

          {/* Branch 2: From Benon down to Sylvain & Honette (2019-2021) */}
          <path
            d="M 190 270 C 190 310, 215 310, 240 310"
            stroke={isGenActiveOrHovered("2019-2021") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2019-2021") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2019-2021")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />

          {/* Branch 3: Under Sylvain and Honette to card c1 */}
          <path
            d="M 277 310 C 277 335, 270 350, 267 360"
            stroke={isGenActiveOrHovered("2019-2021") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2019-2021") ? 3.8 : 2.5}
            className="transition-all duration-300"
          />

          {/* Branch 4: Loop from Benon rightwards to Innocent & Jolie (2021-2022) */}
          <path
            d="M 260 200 C 330 200, 360 175, 425 175"
            stroke={isGenActiveOrHovered("2021-2022") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2021-2022") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2021-2022")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />

          {/* Branch 5: Top center entry into Innocent & Jolie */}
          <path
            d="M 425 100 C 425 130, 425 150, 425 175"
            stroke="#1e2025"
            strokeWidth={2.5}
          />

          {/* Branch 6: Connecting down to Elua & Joyeuse (2023-2024) */}
          <path
            d="M 425 209 C 425 260, 415 295, 415 345"
            stroke={isGenActiveOrHovered("2023-2024") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2023-2024") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2023-2024")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />
          <path
            d="M 498 209 C 498 260, 490 295, 490 345"
            stroke={isGenActiveOrHovered("2023-2024") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2023-2024") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2023-2024")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />

          {/* Branch 7: Loop across to Patrick & Francine (2022-2023) */}
          <path
            d="M 498 175 C 550 175, 610 155, 665 155"
            stroke={isGenActiveOrHovered("2022-2023") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2022-2023") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2022-2023")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />

          {/* Branch 8: Connecting from Patrick & Francine down to Thierry & Liliane (2024-2025) */}
          <path
            d="M 665 189 C 665 240, 705 290, 705 345"
            stroke={isGenActiveOrHovered("2024-2025") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2024-2025") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2024-2025")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />
          <path
            d="M 740 199 C 740 240, 778 290, 778 345"
            stroke={isGenActiveOrHovered("2024-2025") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2024-2025") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2024-2025")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />

          {/* Branch 9: Long sweep from right looping down into lower tier */}
          <path
            d="M 778 379 C 778 440, 720 460, 600 470 C 520 475, 480 485, 445 485"
            stroke={isGenActiveOrHovered("2025-2026") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2025-2026") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2025-2026")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />

          {/* Branch 10: Downward connection from Elua & Joyeuse to Pacifique & Hyguette (2025-2026) */}
          <path
            d="M 415 379 C 415 425, 370 440, 370 485"
            stroke={isGenActiveOrHovered("2025-2026") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2025-2026") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2025-2026")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />

          {/* Branch 11: Under Pacifique & Hyguette into card c7 */}
          <path
            d="M 407 519 C 407 545, 460 550, 500 535"
            stroke={isGenActiveOrHovered("2025-2026") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2025-2026") ? 3.8 : 2.5}
            className="transition-all duration-300"
          />
        </g>

        {/* -------------------------------------------------------------
            ROUNDED RECTANGLE CARDS (with Meaningful Generation Labels)
        ------------------------------------------------------------- */}
        <g fill="#e6e9f0" stroke="#c9ced8" strokeWidth="1.2">
          {TREE_CARDS.map((card) => (
            <g key={card.id}>
              <rect
                x={card.x}
                y={card.y}
                width={card.w}
                height={card.h}
                rx="16"
                className="transition-colors hover:fill-[#d8dce6]"
              />
              <text
                x={card.x + card.w / 2}
                y={card.y + card.h / 2 + 4.5}
                textAnchor="middle"
                fill="#64748b"
                fontSize="11.5"
                fontWeight="700"
                fontFamily="var(--font-sans), sans-serif"
                className="pointer-events-none tracking-wide select-none"
              >
                {card.label}
              </text>
            </g>
          ))}
        </g>

        {/* -------------------------------------------------------------
            PORTRAIT NODES (Strictly Grandpere & Grandmere from each generation)
            Single name shows ONLY on hover via the tooltip!
        ------------------------------------------------------------- */}
        {TREE_PORTRAIT_NODES.map((node) => {
          const isHovered = hoveredNode?.id === node.id;
          const isSelected = activeYear === node.generation;
          return (
            <g
              key={node.id}
              className="cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label={`${node.role} ${node.name} (${node.generation}). Click to view generation.`}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              onFocus={() => setHoveredNode(node)}
              onBlur={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node)}
            >
              <title>{`${node.name} · ${node.role} (${node.generation})`}</title>

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

              {/* Outer stroke ring (glows when hovered or selected) */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                fill="none"
                stroke={
                  isHovered ? "#0d1aba" : isSelected ? "#5a36da" : "#1e2025"
                }
                strokeWidth={isHovered ? 4 : isSelected ? 3 : 2}
                className="transition-all duration-200"
              />

              {/* 100% Reliable Hitbox capturing mouse events */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r + 6}
                fill="#ffffff"
                opacity="0.001"
                style={{ cursor: "pointer", pointerEvents: "all" }}
              />
            </g>
          );
        })}

        {/* -------------------------------------------------------------
            THE FIRST CIRCLE: ROOT (BENON)
            Blank/silhouette avatar, and ONLY on hover shows "Benon"
        ------------------------------------------------------------- */}
        <g
          className="cursor-pointer"
          tabIndex={0}
          role="button"
          aria-label="Root ancestor Benon"
          onMouseEnter={() =>
            setHoveredNode(TREE_ROOT_BENON as unknown as TreeNodeData)
          }
          onMouseLeave={() => setHoveredNode(null)}
          onFocus={() =>
            setHoveredNode(TREE_ROOT_BENON as unknown as TreeNodeData)
          }
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

          {/* Clean Silhouette Icon */}
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

          {/* 100% Reliable Hitbox */}
          <circle
            cx={TREE_ROOT_BENON.cx}
            cy={TREE_ROOT_BENON.cy}
            r={TREE_ROOT_BENON.r + 8}
            fill="#ffffff"
            opacity="0.001"
            style={{ cursor: "pointer", pointerEvents: "all" }}
          />
        </g>

        {/* -------------------------------------------------------------
            FLOATING TOOLTIP: Displays SINGLE NAME on hover
        ------------------------------------------------------------- */}
        {hoveredNode && (
          <g
            className="pointer-events-none transition-all duration-150"
            transform={`translate(${hoveredNode.cx}, ${hoveredNode.cy - hoveredNode.r - 20})`}
          >
            <rect
              x="-52"
              y="-16"
              width="104"
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
