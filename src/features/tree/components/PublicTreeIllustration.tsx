"use client";

import { useState } from "react";
import {
  HeartsOrnament,
  HouseOrnament,
  TreeOrnament,
} from "@/components/ui/Ornaments";
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

/* The drawing is laid out on the design's own 1440px grid. */
const VIEW_W = 1440;
const VIEW_H = 1560;

/* The branches, traced off the design. Each belongs to the promotion it leads
   into, so it lights up with that promotion; the first one, into Benon,
   belongs to none. */
const BRANCHES: { d: string; generation?: PromotionYear }[] = [
  { d: "M36 89C179 83 286 119 280 251" },
  { d: "M262 448C252 505 276 552 300 585", generation: "2019-2021" },
  { d: "M318 441C381 476 434 524 443 574", generation: "2019-2021" },
  { d: "M494 643C595 607 625 476 612 247", generation: "2021-2022" },
  { d: "M718 271C720 345 666 375 613 381", generation: "2021-2022" },
  { d: "M1060 190C1065 250 1012 286 952 292", generation: "2022-2023" },
  { d: "M768 244C791 333 785 536 712 784", generation: "2023-2024" },
  {
    d: "M966 152C940 500 857 952 720 1021C666 1035 628 952 613 907",
    generation: "2023-2024",
  },
  { d: "M750 875C750 940 690 958 643 964", generation: "2023-2024" },
  { d: "M1128 129C1178 202 1178 476 1077 809", generation: "2024-2025" },
  { d: "M1058 846C952 976 774 1131 541 1262", generation: "2025-2026" },
  { d: "M726 1148C774 1190 768 1261 690 1308", generation: "2025-2026" },
];

/* Ornaments around the drawing, placed as a share of it so they keep their
   place at every width: [left, top, width] in viewBox units. */
const pct = (x: number, total: number) => `${(x / total) * 100}%`;

export function PublicTreeIllustration({
  activeYear,
  onSelectYear,
}: PublicTreeIllustrationProps) {
  const [hoveredNode, setHoveredNode] = useState<TreeNodeData | null>(null);

  const selectYear = (year: PromotionYear) => {
    if (!onSelectYear) return;
    onSelectYear(year);
    document
      .getElementById("promotion-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const isLit = (gen?: string) =>
    !!gen && (hoveredNode?.generation === gen || activeYear === gen);

  const benonHovered = hoveredNode?.id === TREE_ROOT_BENON.id;

  return (
    <div className="relative mx-auto w-full max-w-[1440px] select-none">
      <HouseOrnament
        className="absolute -rotate-[22deg]"
        style={{
          left: pct(48, VIEW_W),
          top: pct(880, VIEW_H),
          width: pct(172, VIEW_W),
        }}
      />
      <TreeOrnament
        className="absolute -rotate-[14deg]"
        style={{
          left: pct(1136, VIEW_W),
          top: pct(1220, VIEW_H),
          width: pct(203, VIEW_W),
        }}
      />
      <HeartsOrnament
        className="absolute"
        style={{
          left: pct(143, VIEW_W),
          top: pct(1446, VIEW_H),
          width: pct(107, VIEW_W),
        }}
      />

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="relative h-auto w-full overflow-visible"
        role="group"
        aria-label="The IMENA family tree, from Benon to the current promotion"
      >
        <defs>
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
          <filter id="node-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="5"
              floodColor="#000000"
              floodOpacity="0.12"
            />
          </filter>
        </defs>

        {/* Branches: the design's thin dark curves, brand blue and a little
            heavier along the promotion that is open or pointed at. */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {BRANCHES.map(({ d, generation }) => (
            <path
              key={d}
              d={d}
              stroke={isLit(generation) ? "var(--color-primary)" : "#111111"}
              strokeWidth={isLit(generation) ? 4.5 : 2.75}
              className="transition-all duration-300"
            />
          ))}
        </g>

        {/* The label cards: the promotion and the couple who led it. */}
        {TREE_CARDS.map((card) => (
          <g
            key={card.id}
            role="button"
            tabIndex={0}
            className="group cursor-pointer outline-none"
            aria-label={`Open the ${card.label} promotion`}
            onClick={() => selectYear(card.generation)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectYear(card.generation);
              }
            }}
          >
            <rect
              x={card.x}
              y={card.y}
              width={card.w}
              height={card.h}
              rx="24"
              className="fill-tree-box group-hover:fill-tree-box-hover group-focus-visible:stroke-primary transition-colors group-focus-visible:stroke-[3]"
            />
            <text
              x={card.x + card.w / 2}
              y={card.y + card.h / 2 - 4}
              textAnchor="middle"
              className="fill-tree-ink font-heading pointer-events-none text-[30px] font-bold max-md:hidden"
            >
              {card.label}
            </text>
            <text
              x={card.x + card.w / 2}
              y={card.y + card.h / 2 + 30}
              textAnchor="middle"
              className="fill-tree-quote pointer-events-none font-sans text-[21px] max-md:hidden"
            >
              {card.caption}
            </text>
          </g>
        ))}

        {/* The grandparents of each promotion. Names show on hover. */}
        {TREE_PORTRAIT_NODES.map((node) => {
          const isHovered = hoveredNode?.id === node.id;
          const isSelected = activeYear === node.generation;
          return (
            <g
              key={node.id}
              className="cursor-pointer outline-none"
              tabIndex={0}
              role="button"
              aria-label={`${node.name}, ${node.role} of the ${node.generation} promotion`}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              onFocus={() => setHoveredNode(node)}
              onBlur={() => setHoveredNode(null)}
              onClick={() => selectYear(node.generation)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  selectYear(node.generation);
                }
              }}
            >
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                className="fill-story-rule"
                filter="url(#node-shadow)"
              />
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
                <g
                  clipPath={`url(#clip-${node.id})`}
                  className="fill-tree-silhouette"
                >
                  <circle cx={node.cx} cy={node.cy - 9} r={node.r * 0.38} />
                  <ellipse
                    cx={node.cx}
                    cy={node.cy + node.r * 0.75}
                    rx={node.r * 0.65}
                    ry={node.r * 0.45}
                  />
                </g>
              )}
              {/* A ring appears only for the open or pointed-at promotion;
                  otherwise the circles sit bare, as in the design. */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                fill="none"
                stroke={
                  isHovered ? "var(--color-primary)" : "var(--color-heading)"
                }
                strokeWidth={isHovered ? 5 : isSelected ? 4 : 0}
                className="transition-all duration-200"
              />
            </g>
          );
        })}

        {/* Benon, the root. A silhouette; his name shows on hover. */}
        <g
          className="cursor-default outline-none"
          tabIndex={0}
          role="img"
          aria-label="Benon, the root of the family"
          onMouseEnter={() =>
            setHoveredNode(TREE_ROOT_BENON as unknown as TreeNodeData)
          }
          onMouseLeave={() => setHoveredNode(null)}
          onFocus={() =>
            setHoveredNode(TREE_ROOT_BENON as unknown as TreeNodeData)
          }
          onBlur={() => setHoveredNode(null)}
        >
          <circle
            cx={TREE_ROOT_BENON.cx}
            cy={TREE_ROOT_BENON.cy}
            r={TREE_ROOT_BENON.r}
            className="fill-story-rule"
            filter="url(#node-shadow)"
            stroke="var(--color-primary)"
            strokeWidth={benonHovered ? 5 : 0}
          />
          <g clipPath="url(#clip-benon)" className="fill-tree-silhouette">
            <circle
              cx={TREE_ROOT_BENON.cx}
              cy={TREE_ROOT_BENON.cy - 20}
              r={38}
            />
            <ellipse
              cx={TREE_ROOT_BENON.cx}
              cy={TREE_ROOT_BENON.cy + 75}
              rx={72}
              ry={52}
            />
          </g>
        </g>

        {/* The name, in a small brand-blue badge above the circle. */}
        {hoveredNode && (
          <g
            className="pointer-events-none"
            transform={`translate(${hoveredNode.cx}, ${hoveredNode.cy - hoveredNode.r - 34})`}
          >
            <rect
              x="-84"
              y="-25"
              width="168"
              height="50"
              rx="25"
              className="fill-primary"
              filter="url(#node-shadow)"
            />
            <text
              x="0"
              y="8"
              textAnchor="middle"
              className="font-sans text-[22px] font-bold"
              fill="#ffffff"
            >
              {hoveredNode.name}
            </text>
            <path d="M-8 25h16l-8 9Z" className="fill-primary" />
          </g>
        )}
      </svg>
    </div>
  );
}
