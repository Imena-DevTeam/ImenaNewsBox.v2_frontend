import {
  HeartsOrnament,
  HouseHeartOrnament,
  SunOrnament,
  TreeOrnament,
} from "@/features/story/components/Ornaments";
import { DIAGRAM, TREE_BRANCHES, TREE_NODES } from "@/features/tree/data";

/**
 * The tree itself.
 *
 * One SVG rather than positioned divs, so the branches can be drawn as real
 * curves and the whole thing scales as a piece. Every circle is a family
 * member and every card the name beside them; both come from TREE_NODES, so
 * swapping in the real record is a data change, not a layout one.
 */
export function TreeDiagram() {
  const members = TREE_NODES.flatMap((n) => n.members).length;

  return (
    <section className="relative pt-10 pb-16 md:pt-16 md:pb-24">
      <SunOrnament className="absolute top-6 left-2 size-20 md:size-28" />
      <HouseHeartOrnament className="absolute top-[42%] left-2 hidden size-20 md:block md:size-28" />
      <TreeOrnament className="absolute right-2 bottom-28 hidden size-24 md:block md:size-32" />
      <HeartsOrnament className="absolute bottom-2 left-4 hidden w-20 md:block md:w-28" />

      <svg
        viewBox={`0 0 ${DIAGRAM.width} ${DIAGRAM.height}`}
        className="mx-auto block w-full max-w-6xl px-4"
        role="img"
        aria-label={`A diagram of the family tree, with ${members} members shown as circles joined by branches.`}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          className="text-text"
        >
          {TREE_BRANCHES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        <g className="text-placeholder" fill="currentColor">
          {TREE_NODES.map((node, i) => (
            <g key={i}>
              <rect
                x={node.card.x}
                y={node.card.y}
                width={node.card.width}
                height={node.card.height}
                rx={20}
              />
              {node.members.map((m, j) => (
                <circle key={j} cx={m.cx} cy={m.cy} r={m.r} />
              ))}
            </g>
          ))}
        </g>
      </svg>
    </section>
  );
}
