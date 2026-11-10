import type { ReactNode } from "react";

/**
 * Small floor plans of the six kitchen layouts, seen from above: walls as thin lines, the
 * worktop as a tinted run, hob and sink as marks on it. Drawn by hand for this site; they
 * show the idea of a layout, not a real room. The colour comes from the text colour.
 */

const WALL = { stroke: "currentColor", strokeWidth: 1, opacity: 0.45, fill: "none" } as const;
const TOP = { stroke: "currentColor", strokeWidth: 1.5, fill: "currentColor", fillOpacity: 0.1, strokeLinejoin: "round" } as const;
const MARK = { stroke: "currentColor", strokeWidth: 1, fill: "none" } as const;

/** A hob: a square with two rings. `x`, `y` is its top left corner. */
function Hob({ x, y }: { x: number; y: number }) {
  return (
    <g {...MARK}>
      <rect x={x} y={y} width={12} height={8} rx={1} />
      <circle cx={x + 3.5} cy={y + 4} r={1.6} />
      <circle cx={x + 8.5} cy={y + 4} r={1.6} />
    </g>
  );
}

/** A sink, lying along a wall or standing along a side run. */
function Sink({ x, y, upright = false }: { x: number; y: number; upright?: boolean }) {
  return <rect {...MARK} x={x} y={y} width={upright ? 7 : 12} height={upright ? 12 : 7} rx={2} />;
}

const DRAWINGS: Record<string, ReactNode> = {
  // One run along the wall.
  zeile: (
    <>
      <path {...WALL} d="M6 66V6h84v60" />
      <rect {...TOP} x={10} y={10} width={76} height={13} />
      <Hob x={24} y={12.5} />
      <Sink x={58} y={13} />
    </>
  ),
  // Two runs over a corner.
  "l-form": (
    <>
      <path {...WALL} d="M6 66V6h84v60" />
      <path {...TOP} d="M10 10h76v13H23v39H10z" />
      <Hob x={52} y={12.5} />
      <Sink x={13} y={36} upright />
    </>
  ),
  // Three runs around the cook.
  "u-form": (
    <>
      <path {...WALL} d="M6 66V6h84v60" />
      <path {...TOP} d="M10 10h76v52H73V23H23v39H10z" />
      <Hob x={42} y={12.5} />
      <Sink x={13} y={36} upright />
    </>
  ),
  // A run along the wall and a block standing free in front of it.
  insel: (
    <>
      <path {...WALL} d="M6 66V6h84v60" />
      <rect {...TOP} x={10} y={10} width={76} height={13} />
      <rect {...TOP} x={25} y={40} width={46} height={16} />
      <Hob x={42} y={44} />
      <Sink x={58} y={13} />
    </>
  ),
  // The kitchen and the table share one room: no wall between them.
  offen: (
    <>
      <path {...WALL} d="M6 66V6h84" />
      <path {...WALL} d="M90 6v60" strokeDasharray="3 4" />
      <path {...TOP} d="M10 10h44v13H23v29H10z" />
      <Hob x={30} y={12.5} />
      <Sink x={13} y={32} upright />
      <rect {...MARK} x={54} y={40} width={26} height={14} rx={2} />
      <path {...MARK} d="M59 36.5h6M69 36.5h6M59 57.5h6M69 57.5h6" strokeLinecap="round" />
    </>
  ),
  // A small room, used on two walls.
  klein: (
    <>
      <path {...WALL} d="M40 62H22V10h52v52H56" />
      <path {...TOP} d="M26 14h44v12H38v24H26z" />
      <Hob x={50} y={16} />
      <Sink x={28.5} y={32} upright />
    </>
  ),
};

/** True when a layout has a drawing (the slug of a topic under /kuechen/formen). */
export function hasPlanDrawing(form?: string) {
  return Boolean(form && DRAWINGS[form]);
}

export default function PlanDrawing({ form, className }: { form?: string; className?: string }) {
  const drawing = form ? DRAWINGS[form] : null;
  if (!drawing) return null;
  return (
    <svg viewBox="0 0 96 72" className={className} aria-hidden="true" focusable="false">
      {drawing}
    </svg>
  );
}
