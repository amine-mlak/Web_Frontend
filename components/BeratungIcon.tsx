import type { ReactNode } from "react";

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      className="h-full w-full"
    >
      {children}
    </svg>
  );
}

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

const icons: Record<string, ReactNode> = {
  "shape-einzeilig": (
    <Frame>
      <path d="M16 52h48v10H16z" {...stroke} />
      <path d="M18 42h44v10H18z" {...stroke} />
    </Frame>
  ),
  "shape-zweizeilig": (
    <Frame>
      <path d="M16 22h48v10H16z" {...stroke} />
      <path d="M18 18h44v8H18z" {...stroke} />
      <path d="M16 52h48v10H16z" {...stroke} />
      <path d="M18 46h44v8H18z" {...stroke} />
    </Frame>
  ),
  "shape-l": (
    <Frame>
      <path d="M18 18h14v44H18z" {...stroke} />
      <path d="M18 52h46v10H18z" {...stroke} />
    </Frame>
  ),
  "shape-u": (
    <Frame>
      <path d="M16 18h12v44H16z" {...stroke} />
      <path d="M52 18h12v44H52z" {...stroke} />
      <path d="M16 52h48v10H16z" {...stroke} />
    </Frame>
  ),
  "shape-insel": (
    <Frame>
      <path d="M16 18h48v10H16z" {...stroke} />
      <rect x="30" y="40" width="20" height="18" {...stroke} />
    </Frame>
  ),
  "shape-offen": (
    <Frame>
      <rect x="16" y="34" width="12" height="12" {...stroke} />
      <rect x="34" y="28" width="12" height="18" {...stroke} />
      <rect x="52" y="36" width="12" height="10" {...stroke} />
    </Frame>
  ),
  "room-geschlossen": (
    <Frame>
      <rect x="18" y="18" width="44" height="44" {...stroke} />
      <path d="M18 40h44M40 18v44" {...stroke} strokeWidth={1.1} />
    </Frame>
  ),
  "room-offen": (
    <Frame>
      <path d="M18 18h44v44H18V32" {...stroke} />
      <path d="M18 32h-8" {...stroke} />
    </Frame>
  ),
  "room-planung": (
    <Frame>
      <rect
        x="18"
        y="18"
        width="44"
        height="44"
        {...stroke}
        strokeDasharray="4 3"
      />
    </Frame>
  ),
  "style-modern": (
    <Frame>
      <rect x="22" y="14" width="36" height="52" {...stroke} />
      <path d="M22 40h36" {...stroke} />
    </Frame>
  ),
  "style-landhaus": (
    <Frame>
      <rect x="22" y="14" width="36" height="52" {...stroke} />
      <rect x="28" y="20" width="24" height="18" {...stroke} />
      <rect x="28" y="42" width="24" height="18" {...stroke} />
    </Frame>
  ),
  "style-design": (
    <Frame>
      <rect x="24" y="12" width="32" height="56" {...stroke} />
      <path d="M24 12l32 56" {...stroke} strokeWidth={1.1} />
    </Frame>
  ),
  "style-holz": (
    <Frame>
      <rect x="18" y="22" width="44" height="36" {...stroke} />
      <path d="M18 34c8 6 16 6 22 0s14-6 22 0M18 46c8 6 16 6 22 0s14-6 22 0" {...stroke} />
    </Frame>
  ),
  "style-offen": (
    <Frame>
      <circle cx="40" cy="40" r="16" {...stroke} />
      <path d="M40 28v4M40 48v4M28 40h4M48 40h4" {...stroke} />
    </Frame>
  ),
  "handle-grifflos": (
    <Frame>
      <rect x="24" y="12" width="32" height="56" {...stroke} />
      <path d="M52 38v8" {...stroke} />
    </Frame>
  ),
  "handle-griff": (
    <Frame>
      <rect x="22" y="12" width="30" height="56" {...stroke} />
      <rect x="54" y="30" width="4" height="20" {...stroke} />
    </Frame>
  ),
  "handle-touch": (
    <Frame>
      <rect x="24" y="12" width="32" height="56" {...stroke} />
      <circle cx="48" cy="28" r="3.5" {...stroke} />
    </Frame>
  ),
  "colour-hell": (
    <Frame>
      <rect x="18" y="18" width="44" height="44" {...stroke} />
      <rect x="24" y="24" width="32" height="32" fill="currentColor" opacity="0.18" />
    </Frame>
  ),
  "colour-dunkel": (
    <Frame>
      <rect x="18" y="18" width="44" height="44" fill="currentColor" {...stroke} />
    </Frame>
  ),
  "colour-farbig": (
    <Frame>
      <circle cx="28" cy="40" r="10" {...stroke} />
      <circle cx="42" cy="32" r="10" {...stroke} />
      <circle cx="52" cy="46" r="10" {...stroke} />
    </Frame>
  ),
  "worktop-kunststoff": (
    <Frame>
      <path d="M12 50h56l-8-16H20z" {...stroke} />
      <path d="M20 34V26h40v8" {...stroke} />
    </Frame>
  ),
  "worktop-naturstein": (
    <Frame>
      <path d="M12 50h56l-8-16H20z" {...stroke} />
      <path d="M24 42c8-6 14 4 22-2s12 2 18 0" {...stroke} />
    </Frame>
  ),
  "worktop-keramik": (
    <Frame>
      <path d="M12 50h56l-8-16H20z" {...stroke} />
      <path d="M26 38h8v8h-8zM38 38h8v8h-8zM50 38h8v8h-8z" {...stroke} />
    </Frame>
  ),
  "worktop-edelstahl": (
    <Frame>
      <path d="M12 50h56l-8-16H20z" {...stroke} />
      <path d="M22 40h36M22 44h36" {...stroke} />
    </Frame>
  ),
  "appliance-fridge": (
    <Frame>
      <rect x="26" y="12" width="28" height="56" {...stroke} />
      <path d="M26 32h28" {...stroke} />
      <path d="M50 20v6M50 40v10" {...stroke} />
    </Frame>
  ),
  "appliance-fridge-free": (
    <Frame>
      <rect x="22" y="16" width="24" height="48" {...stroke} />
      <rect x="42" y="28" width="16" height="36" {...stroke} />
    </Frame>
  ),
  "appliance-dishwasher": (
    <Frame>
      <rect x="18" y="18" width="44" height="46" {...stroke} />
      <path d="M18 28h44" {...stroke} />
      <rect x="28" y="36" width="24" height="18" {...stroke} />
    </Frame>
  ),
  "appliance-hood": (
    <Frame>
      <rect x="16" y="44" width="48" height="10" {...stroke} />
      <path d="M28 44V28h24v16" {...stroke} />
      <path d="M36 28V18h8v10" {...stroke} />
    </Frame>
  ),
  "appliance-steam": (
    <Frame>
      <rect x="18" y="26" width="44" height="32" {...stroke} />
      <path d="M30 22c0-6 20-6 20 0M34 18c0-5 12-5 12 0" {...stroke} />
    </Frame>
  ),
  "appliance-teppan": (
    <Frame>
      <rect x="14" y="28" width="52" height="24" {...stroke} />
      <path d="M22 36h36" {...stroke} />
    </Frame>
  ),
  "appliance-wine": (
    <Frame>
      <rect x="28" y="12" width="24" height="56" {...stroke} />
      <path d="M34 24h12M34 36h12M34 48h12" {...stroke} />
    </Frame>
  ),
  "appliance-drawer": (
    <Frame>
      <rect x="16" y="28" width="48" height="14" {...stroke} />
      <rect x="16" y="44" width="48" height="14" {...stroke} />
      <path d="M36 35h8M36 51h8" {...stroke} />
    </Frame>
  ),
  "appliance-none": (
    <Frame>
      <circle cx="40" cy="40" r="16" {...stroke} />
      <path d="M30 50l20-20" {...stroke} />
    </Frame>
  ),
  "cooking-alleine": (
    <Frame>
      <circle cx="40" cy="28" r="8" {...stroke} />
      <path d="M24 58c2-12 10-18 16-18s14 6 16 18" {...stroke} />
    </Frame>
  ),
  "cooking-zweit": (
    <Frame>
      <circle cx="30" cy="28" r="7" {...stroke} />
      <circle cx="50" cy="28" r="7" {...stroke} />
      <path d="M16 58c2-12 8-16 14-16s12 4 14 16" {...stroke} />
      <path d="M36 58c2-12 8-16 14-16s12 4 14 16" {...stroke} />
    </Frame>
  ),
  "cooking-kinder": (
    <Frame>
      <circle cx="32" cy="26" r="7" {...stroke} />
      <circle cx="52" cy="34" r="5" {...stroke} />
      <path d="M18 58c2-12 8-16 14-16s12 4 14 16" {...stroke} />
      <path d="M42 58c1-8 5-12 10-12s9 4 10 12" {...stroke} />
    </Frame>
  ),
  "cooking-freunde": (
    <Frame>
      <circle cx="26" cy="30" r="6" {...stroke} />
      <circle cx="40" cy="24" r="6" {...stroke} />
      <circle cx="54" cy="30" r="6" {...stroke} />
      <path d="M14 60c2-10 7-14 12-14s10 4 12 14M28 60c2-12 7-16 12-16s10 4 12 16M42 60c2-10 7-14 12-14s10 4 12 14" {...stroke} />
    </Frame>
  ),
  "occasion-renovieren": (
    <Frame>
      <path d="M18 42l22-18 22 18v22H18z" {...stroke} />
      <path d="M28 64V48h12v16" {...stroke} />
    </Frame>
  ),
  "occasion-umzug": (
    <Frame>
      <rect x="14" y="30" width="28" height="24" {...stroke} />
      <path d="M42 38h16l8 10v6H42z" {...stroke} />
      <circle cx="26" cy="58" r="5" {...stroke} />
      <circle cx="56" cy="58" r="5" {...stroke} />
    </Frame>
  ),
  "occasion-neubau": (
    <Frame>
      <path d="M16 40l24-20 24 20v24H16z" {...stroke} />
      <path d="M40 20v-8" {...stroke} />
    </Frame>
  ),
  "occasion-bestehend": (
    <Frame>
      <rect x="18" y="22" width="44" height="40" {...stroke} />
      <path d="M18 36h44" {...stroke} />
    </Frame>
  ),
  "occasion-moebel": (
    <Frame>
      <rect x="16" y="34" width="48" height="18" {...stroke} />
      <path d="M22 52v8M58 52v8M16 42h48" {...stroke} />
    </Frame>
  ),
  "occasion-anders": (
    <Frame>
      <circle cx="40" cy="40" r="16" {...stroke} />
      <path d="M40 28v16M40 50v2" {...stroke} />
    </Frame>
  ),
  "prep-inspiration": (
    <Frame>
      <rect x="22" y="16" width="36" height="48" {...stroke} />
      <path d="M30 28h20M30 38h20M30 48h12" {...stroke} />
    </Frame>
  ),
  "prep-studio": (
    <Frame>
      <path d="M16 58V30l24-12 24 12v28z" {...stroke} />
      <path d="M34 58V42h12v16" {...stroke} />
    </Frame>
  ),
  "prep-architekt": (
    <Frame>
      <path d="M20 58l20-40 20 40z" {...stroke} />
      <path d="M28 42h24" {...stroke} />
    </Frame>
  ),
  "prep-grundriss": (
    <Frame>
      <rect x="18" y="16" width="44" height="48" {...stroke} />
      <path d="M18 44h20v20" {...stroke} />
    </Frame>
  ),
  "prep-angebote": (
    <Frame>
      <rect x="20" y="18" width="32" height="42" {...stroke} />
      <rect x="28" y="26" width="32" height="42" {...stroke} />
    </Frame>
  ),
  "prep-keine": (
    <Frame>
      <circle cx="40" cy="40" r="16" {...stroke} />
    </Frame>
  ),
  "timing-1": (
    <Frame>
      <rect x="18" y="20" width="44" height="44" {...stroke} />
      <path d="M18 32h44M30 20v-8M50 20v-8" {...stroke} />
      <path d="M40 40v10h8" {...stroke} />
    </Frame>
  ),
  "timing-2": (
    <Frame>
      <rect x="18" y="20" width="44" height="44" {...stroke} />
      <path d="M18 32h44M30 20v-8M50 20v-8" {...stroke} />
      <circle cx="40" cy="48" r="8" {...stroke} />
    </Frame>
  ),
  "timing-3": (
    <Frame>
      <rect x="18" y="20" width="44" height="44" {...stroke} />
      <path d="M18 32h44M30 20v-8M50 20v-8" {...stroke} />
      <path d="M32 46h16M40 40v16" {...stroke} />
    </Frame>
  ),
  "timing-4": (
    <Frame>
      <rect x="18" y="20" width="44" height="44" {...stroke} />
      <path d="M18 32h44M30 20v-8M50 20v-8" {...stroke} />
      <path d="M32 42l16 12M48 42L32 54" {...stroke} />
    </Frame>
  ),
  "budget-1": (
    <Frame>
      <circle cx="40" cy="40" r="18" {...stroke} />
      <path d="M40 28v24M32 34h12c4 0 6 3 6 6s-2 6-6 6H32" {...stroke} />
    </Frame>
  ),
  "budget-2": (
    <Frame>
      <circle cx="32" cy="40" r="14" {...stroke} />
      <circle cx="50" cy="40" r="14" {...stroke} />
    </Frame>
  ),
  "budget-3": (
    <Frame>
      <circle cx="26" cy="42" r="12" {...stroke} />
      <circle cx="40" cy="34" r="12" {...stroke} />
      <circle cx="54" cy="42" r="12" {...stroke} />
    </Frame>
  ),
  "budget-offen": (
    <Frame>
      <circle cx="40" cy="40" r="18" {...stroke} />
      <path d="M32 40h16" {...stroke} />
    </Frame>
  ),
  "floorplan-ja": (
    <Frame>
      <rect x="20" y="14" width="40" height="52" {...stroke} />
      <path d="M28 40l8 8 16-18" {...stroke} />
    </Frame>
  ),
  "floorplan-nein": (
    <Frame>
      <rect x="20" y="14" width="40" height="52" {...stroke} />
      <path d="M32 32l16 16M48 32L32 48" {...stroke} />
    </Frame>
  ),
  "place-studio": (
    <Frame>
      <path d="M12 58V34h56v24z" {...stroke} />
      <path d="M12 34l28-16 28 16" {...stroke} />
      <rect x="22" y="40" width="14" height="18" {...stroke} />
      <rect x="44" y="40" width="14" height="18" {...stroke} />
    </Frame>
  ),
  "place-home": (
    <Frame>
      <path d="M16 40l24-18 24 18v22H16z" {...stroke} />
      <rect x="34" y="44" width="12" height="18" {...stroke} />
    </Frame>
  ),
};

export function BeratungIcon({ name }: { name: string }) {
  return icons[name] ?? icons["style-offen"];
}
