export const VEGGIE_ICONS: Record<string, string> = {
  Bean: "🫘", Bitter_Gourd: "🥒", Bottle_Gourd: "🍐", Brinjal: "🍆", Broccoli: "🥦",
  Cabbage: "🥬", Capsicum: "🫑", Carrot: "🥕", Cauliflower: "🌸", Cucumber: "🥒",
  Papaya: "🍈", Potato: "🥔", Pumpkin: "🎃", Radish: "🔴", Tomato: "🍅",
};

export const ALL_CLASSES = Object.keys(VEGGIE_ICONS);

export const MODEL_INFO: Record<string, { label: string; tag: string; color: string; desc: string }> = {
  baseline: {
    label: "Base", tag: "PHASE A", color: "#f59e0b",
    desc: "Entraînement standard — EfficientNet-B0",
  },
  hardened: {
    label: "Durci", tag: "PHASE C", color: "#22c55e",
    desc: "Adversarial Training PGD — résistant aux attaques",
  },
};
