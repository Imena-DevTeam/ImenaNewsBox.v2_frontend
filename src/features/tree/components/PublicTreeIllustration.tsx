"use client";

import { useState } from "react";
import {
  TREE_CARDS,
  TREE_NEXT_PAIR,
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

  const handleCardClick = (cardLabel: string) => {
    let targetGen: PromotionYear | null = null;
    if (cardLabel.includes("2019")) targetGen = "2019-2021";
    else if (cardLabel.includes("2021") || cardLabel.includes("Roots"))
      targetGen = "2021-2022";
    else if (cardLabel.includes("2022")) targetGen = "2022-2023";
    else if (cardLabel.includes("2023")) targetGen = "2023-2024";
    else if (cardLabel.includes("2024")) targetGen = "2024-2025";
    else if (cardLabel.includes("2025")) targetGen = "2025-2026";

    if (targetGen && onSelectYear) {
      onSelectYear(targetGen);
      const el = document.getElementById("promotion-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl px-2 select-none sm:px-4">
      <svg
        viewBox="0 0 960 1100"
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
            ORGANIC CONNECTING BRANCHES (Strictly matching Image Two)
        ------------------------------------------------------------- */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Branch 1: Top-left entry into Benon circle */}
          <path
            d="M 15 90 C 70 90, 160 110, 190 182"
            stroke="#1e2025"
            strokeWidth={2.5}
          />

          {/* Branch 2A & 2B: From Benon bottom split to Sylvain & Honette (2019-2021) */}
          <path
            d="M 175 315 C 175 365, 205 385, 225 391"
            stroke={isGenActiveOrHovered("2019-2021") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2019-2021") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2019-2021")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />
          <path
            d="M 205 315 C 235 345, 280 365, 300 391"
            stroke={isGenActiveOrHovered("2019-2021") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2019-2021") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2019-2021")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />

          {/* Branch 3: Sweep from Honette down and curving UP to Innocent & Jolie (2019-2021 / 2021-2022) */}
          <path
            d="M 334 425 C 385 435, 410 370, 425 245"
            stroke={isGenActiveOrHovered("2021-2022") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2021-2022") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2021-2022")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />

          {/* Branch 4A & 4B: Under Innocent & Jolie joining at (455, 245) */}
          <path
            d="M 420 194 C 420 225, 440 240, 455 245"
            stroke={isGenActiveOrHovered("2021-2022") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2021-2022") ? 3.8 : 2.5}
            className="transition-all duration-300"
          />
          <path
            d="M 495 209 C 495 235, 470 245, 455 245"
            stroke={isGenActiveOrHovered("2021-2022") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2021-2022") ? 3.8 : 2.5}
            className="transition-all duration-300"
          />

          {/* Branch 5: Long branch from (455, 245) heading straight down between cards into Elua & Joyeuse */}
          <path
            d="M 455 245 C 455 350, 410 440, 410 521"
            stroke={isGenActiveOrHovered("2023-2024") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2023-2024") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2023-2024")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />

          {/* Branch 6: Connection looping from Jolie across to Patrick & Francine (2022-2023) */}
          <path
            d="M 529 175 C 570 175, 610 145, 645 105"
            stroke={isGenActiveOrHovered("2022-2023") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2022-2023") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2022-2023")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />

          {/* Branch 7A & 7B: Under Patrick & Francine joining at (665, 215) */}
          <path
            d="M 645 139 C 645 180, 655 205, 665 215"
            stroke={isGenActiveOrHovered("2022-2023") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2022-2023") ? 3.8 : 2.5}
            className="transition-all duration-300"
          />
          <path
            d="M 720 164 C 720 195, 685 210, 665 215"
            stroke={isGenActiveOrHovered("2022-2023") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2022-2023") ? 3.8 : 2.5}
            className="transition-all duration-300"
          />

          {/* Branch 8: Long curve from Patrick & Francine junction sweeping down-left into Elua/Joyeuse */}
          <path
            d="M 665 215 C 665 380, 590 580, 535 635 C 500 665, 440 655, 410 589"
            stroke={isGenActiveOrHovered("2023-2024") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2023-2024") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2023-2024")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />

          {/* Branch 9: Outer right arch from Francine sweeping down into Thierry & Liliane (2024-2025) */}
          <path
            d="M 754 130 C 785 180, 775 380, 730 515"
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
            d="M 730 515 C 710 525, 690 530, 680 545"
            stroke={isGenActiveOrHovered("2024-2025") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2024-2025") ? 3.8 : 2.5}
            className="transition-all duration-300"
          />
          <path
            d="M 730 515 C 740 525, 750 535, 755 555"
            stroke={isGenActiveOrHovered("2024-2025") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2024-2025") ? 3.8 : 2.5}
            className="transition-all duration-300"
          />

          {/* Branch 10: Under Elua & Joyeuse joining together */}
          <path
            d="M 410 589 C 410 625, 435 640, 448 645"
            stroke={isGenActiveOrHovered("2023-2024") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2023-2024") ? 3.8 : 2.5}
            className="transition-all duration-300"
          />
          <path
            d="M 485 584 C 485 625, 465 640, 448 645"
            stroke={isGenActiveOrHovered("2023-2024") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2023-2024") ? 3.8 : 2.5}
            className="transition-all duration-300"
          />

          {/* Branch 11: Long sweep from Thierry & Liliane down-left to Pacifique & Hyguette (2025-2026) */}
          <path
            d="M 690 580 C 660 620, 550 720, 480 770"
            stroke={isGenActiveOrHovered("2025-2026") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2025-2026") ? 3.8 : 2.5}
            filter={
              isGenActiveOrHovered("2025-2026")
                ? "url(#branch-glow)"
                : undefined
            }
            className="transition-all duration-300"
          />
          <path
            d="M 480 770 C 420 800, 365 810, 350 825"
            stroke={isGenActiveOrHovered("2025-2026") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2025-2026") ? 3.8 : 2.5}
            className="transition-all duration-300"
          />
          <path
            d="M 480 770 C 470 800, 445 815, 435 830"
            stroke={isGenActiveOrHovered("2025-2026") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2025-2026") ? 3.8 : 2.5}
            className="transition-all duration-300"
          />

          {/* Branch 12: Under Pacifique & Hyguette into card c7 (2025-2026) */}
          <path
            d="M 390 895 C 420 920, 450 920, 480 900"
            stroke={isGenActiveOrHovered("2025-2026") ? "#0d1aba" : "#1e2025"}
            strokeWidth={isGenActiveOrHovered("2025-2026") ? 3.8 : 2.5}
            className="transition-all duration-300"
          />

          {/* Branch 13: out of the 2025-2026 card, curving right and down
              into the pair that follows it, with a limb to the second. */}
          <path
            d="M 705 901 C 770 901, 800 918, 800 950"
            stroke="#1e2025"
            strokeWidth={2.5}
          />
          <path
            d="M 752 905 C 815 898, 872 918, 880 955"
            stroke="#1e2025"
            strokeWidth={2.5}
          />
        </g>

        {/* -------------------------------------------------------------
            THE NEXT PAIR (2026-2027): not named yet, so blank portraits and
            a label, and nothing to open.
        ------------------------------------------------------------- */}
        <g role="img" aria-label={`${TREE_NEXT_PAIR.label}, not yet named`}>
          {TREE_NEXT_PAIR.nodes.map((node) => (
            <g key={node.id}>
              <clipPath id={`clip-${node.id}`}>
                <circle cx={node.cx} cy={node.cy} r={TREE_NEXT_PAIR.r} />
              </clipPath>
              <circle
                cx={node.cx}
                cy={node.cy}
                r={TREE_NEXT_PAIR.r}
                fill="#e2e8f0"
                filter="url(#node-shadow)"
              />
              <g clipPath={`url(#clip-${node.id})`}>
                <circle
                  cx={node.cx}
                  cy={node.cy - 6}
                  r={TREE_NEXT_PAIR.r * 0.38}
                  fill="#94a3b8"
                />
                <ellipse
                  cx={node.cx}
                  cy={node.cy + TREE_NEXT_PAIR.r * 0.75}
                  rx={TREE_NEXT_PAIR.r * 0.65}
                  ry={TREE_NEXT_PAIR.r * 0.45}
                  fill="#94a3b8"
                />
              </g>
              <circle
                cx={node.cx}
                cy={node.cy}
                r={TREE_NEXT_PAIR.r}
                fill="none"
                stroke="#1e2025"
                strokeWidth={2}
              />
            </g>
          ))}
          <rect
            x={TREE_NEXT_PAIR.card.x}
            y={TREE_NEXT_PAIR.card.y}
            width={TREE_NEXT_PAIR.card.w}
            height={TREE_NEXT_PAIR.card.h}
            rx="16"
            fill="#e6e9f0"
            stroke="#c9ced8"
            strokeWidth="1.2"
          />
          <text
            x={TREE_NEXT_PAIR.card.x + TREE_NEXT_PAIR.card.w / 2}
            y={TREE_NEXT_PAIR.card.y + TREE_NEXT_PAIR.card.h / 2 + 4.5}
            textAnchor="middle"
            fontSize="13"
            fontWeight="800"
            fontFamily="var(--font-sans), sans-serif"
            className="fill-text tracking-wide select-none"
          >
            {TREE_NEXT_PAIR.label}
          </text>
        </g>

        {/* -------------------------------------------------------------
            ROUNDED RECTANGLE CARDS (with Meaningful Generation Labels)
        ------------------------------------------------------------- */}
        <g fill="#e6e9f0" stroke="#c9ced8" strokeWidth="1.2">
          {TREE_CARDS.map((card) => (
            <g
              key={card.id}
              role="button"
              tabIndex={0}
              className="cursor-pointer"
              aria-label={`View ${card.label} generation`}
              onClick={() => handleCardClick(card.label)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(card.label);
                }
              }}
            >
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
                stroke="none"
                fontSize="13"
                fontWeight="800"
                fontFamily="var(--font-sans), sans-serif"
                className="fill-text pointer-events-none tracking-wide select-none"
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
