/** @schema 2.10 */
const cols = 18;
const rows = 7;
const cell = 12;
const gap = 3;

const palette = [
  "#EEF2FB", "#EEF2FB", "#EEF2FB", "#EEF2FB", "#EEF2FB",
  "#EEF2FB", "#EEF2FB", "#EEF2FB",
  "#2C5BD140",
  "#2C5BD180",
  "#2C5BD1CC",
  "#2C5BD1",
  "#8EC5FF",
];

const nodes = [];
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const idx = Math.floor(Math.random() * palette.length);
    nodes.push({
      type: "rectangle",
      x: c * (cell + gap),
      y: r * (cell + gap),
      width: cell,
      height: cell,
      cornerRadius: 3,
      fill: palette[idx],
    });
  }
}

return nodes;
