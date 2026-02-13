export const VEGGIE_ICONS: Record<string, string> = {
  Bean: "🫘", Bitter_Gourd: "🥒", Bottle_Gourd: "🍐", Brinjal: "🍆", Broccoli: "🥦",
  Cabbage: "🥬", Capsicum: "🫑", Carrot: "🥕", Cauliflower: "🌸", Cucumber: "🥒",
  Papaya: "🍈", Potato: "🥔", Pumpkin: "🎃", Radish: "🔴", Tomato: "🍅",
};

export const ALL_CLASSES = Object.keys(VEGGIE_ICONS);

export const MODEL_META: Record<string, { label: string; tag: string; color: string }> = {
  baseline: { label: "Base",  tag: "PHASE A", color: "#f59e0b" },
  hardened: { label: "Durci", tag: "PHASE C", color: "#22c55e" },
};
