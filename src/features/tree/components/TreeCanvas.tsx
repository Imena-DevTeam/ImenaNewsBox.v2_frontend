"use client";

import "@xyflow/react/dist/style.css";

import Image from "next/image";
import { memo, useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { cn } from "@/lib/cn";
import { HOUSEHOLDS, type Household, type Person } from "@/features/tree/data";

/* SVG paint attributes (the minimap, the dot grid) do not resolve CSS
   variables, so the two tree colours are restated here from globals.css:
   --color-tree-edge and --color-celebration-gold. */
const TREE_EDGE = "#733fdc";
const LINEAGE_GOLD = "#f2c14e";

/* Spacing of the generation rows and of the households along each row. */
const ROW_GAP = 250;
const COLUMN_GAP = 330;
const NODE_WIDTH = 270;

type HouseholdData = {
  household: Household;
  selectedId: string | null;
  lit: boolean;
  dimmed: boolean;
  matches: Set<string>;
  onSelect: (person: Person) => void;
};

type HouseholdNode = Node<HouseholdData, "household">;

/* Each generation is a row, its households ordered under their parents so
   the lines between generations cross as little as possible. */
function layout(): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const generations = [...new Set(HOUSEHOLDS.map((h) => h.generation))].sort(
    (a, b) => a - b,
  );

  for (const generation of generations) {
    const row = HOUSEHOLDS.filter((h) => h.generation === generation).sort(
      (a, b) =>
        (positions.get(a.parent ?? "")?.x ?? a.card.x) -
          (positions.get(b.parent ?? "")?.x ?? b.card.x) || a.card.x - b.card.x,
    );
    row.forEach((household, index) => {
      positions.set(household.id, {
        x: (index - (row.length - 1) / 2) * COLUMN_GAP - NODE_WIDTH / 2,
        y: (generation - 1) * ROW_GAP,
      });
    });
  }
  return positions;
}

const HouseholdCard = memo(function HouseholdCard({
  data,
}: NodeProps<HouseholdNode>) {
  const { household, selectedId, lit, dimmed, matches, onSelect } = data;

  return (
    <div
      className={cn(
        "bg-tree-card w-[270px] rounded-2xl border p-3 shadow-lg transition-[opacity,box-shadow,border-color] duration-300",
        lit
          ? "border-celebration-gold shadow-[0_0_0_3px_rgb(242_193_78/0.35),0_12px_40px_rgb(115_63_220/0.35)]"
          : "border-tree-edge/40",
        dimmed && "opacity-25",
      )}
    >
      <Handle type="target" position={Position.Top} className="opacity-0!" />
      <p className="text-caption-sm text-tree-role px-1 tracking-widest uppercase">
        Generation {household.generation} · {household.people[0]?.subfamily}
      </p>
      <ul className="mt-2 space-y-1">
        {household.people.map((person) => {
          const selected = selectedId === person.id;
          return (
            <li key={person.id}>
              <button
                type="button"
                onClick={() => onSelect(person)}
                className={cn(
                  "nodrag nopan flex w-full items-center gap-3 rounded-xl p-1.5 text-left transition-colors",
                  selected ? "bg-tree-edge/15" : "hover:bg-tree-edge/10",
                  !matches.has(person.id) && "opacity-40",
                )}
                aria-pressed={selected}
              >
                <Image
                  src={person.photo}
                  alt=""
                  width={44}
                  height={44}
                  className={cn(
                    "size-11 shrink-0 rounded-full object-cover ring-2",
                    selected ? "ring-celebration-gold" : "ring-tree-edge/40",
                  )}
                />
                <span className="min-w-0">
                  <span className="text-body-sm text-tree-ink block truncate font-semibold">
                    {person.name}
                  </span>
                  <span className="text-caption text-tree-role block">
                    {person.role}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <Handle type="source" position={Position.Bottom} className="opacity-0!" />
    </div>
  );
});

const NODE_TYPES = { household: HouseholdCard };

/**
 * The family tree as a canvas to explore: wheel or pinch to zoom, drag to
 * pan, a minimap in the corner and zoom controls beside it.
 *
 * Choosing anyone lights their line back to the first generation — the
 * households along it ringed in gold, the lines between them glowing violet
 * and flowing — and dims every branch that is not theirs. A search dims
 * the households with nobody matching.
 */
export function TreeCanvas({
  selectedId,
  litHouseholds,
  matches,
  dimOthers,
  onSelect,
}: {
  selectedId: string | null;
  litHouseholds: Set<string>;
  matches: Set<string>;
  dimOthers: boolean;
  onSelect: (person: Person) => void;
}) {
  const positions = useMemo(() => layout(), []);
  const focusing = litHouseholds.size > 0;

  const nodes: HouseholdNode[] = HOUSEHOLDS.map((household) => {
    const lit = litHouseholds.has(household.id);
    const anyMatch = household.people.some((p) => matches.has(p.id));
    return {
      id: household.id,
      type: "household",
      position: positions.get(household.id) ?? { x: 0, y: 0 },
      data: {
        household,
        selectedId,
        lit,
        dimmed: focusing ? !lit : dimOthers && !anyMatch,
        matches,
        onSelect,
      },
      draggable: false,
      selectable: false,
      /* A node that is neither draggable nor selectable gets no pointer
         events from React Flow; the people inside are buttons, so it must. */
      style: { pointerEvents: "all" },
    };
  });

  const edges: Edge[] = HOUSEHOLDS.filter((h) => h.parent).map((household) => {
    const lit =
      litHouseholds.has(household.id) && litHouseholds.has(household.parent!);
    return {
      id: `${household.parent}-${household.id}`,
      source: household.parent!,
      target: household.id,
      type: "default",
      animated: lit,
      className: lit ? "lineage-lit" : undefined,
      style: {
        stroke: "var(--color-tree-edge)",
        strokeWidth: lit ? 3.5 : 1.75,
        opacity: focusing && !lit ? 0.18 : lit ? 1 : 0.55,
        transition: "opacity 300ms, stroke-width 300ms",
      },
    };
  });

  return (
    <div className="border-tree-edge/25 bg-surface relative h-[70vh] min-h-120 overflow-hidden rounded-2xl border shadow-xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.3}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll
        zoomOnPinch
        panOnDrag
        proOptions={{ hideAttribution: true }}
        aria-label="Family tree canvas"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1.4}
          color={TREE_EDGE}
          className="opacity-20"
        />
        <Controls
          showInteractive={false}
          className="border-tree-edge/20! overflow-hidden rounded-xl! border! shadow-lg!"
        />
        <MiniMap
          pannable
          zoomable
          ariaLabel="Overview of the family tree"
          nodeColor={(node) =>
            litHouseholds.has(node.id) ? LINEAGE_GOLD : `${TREE_EDGE}66`
          }
          nodeStrokeWidth={0}
          nodeBorderRadius={12}
          maskColor="rgb(247 245 252 / 0.75)"
          className="border-tree-edge/20! rounded-xl! border! shadow-lg!"
        />
      </ReactFlow>
    </div>
  );
}
