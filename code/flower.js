// One of Echo's flowers. o = 1: wide open (Echo is fine) ... 0: closed and drooping (Echo is not well).
const Flower = (() => {
  function svg(o, size) {
    o = Math.max(0, Math.min(1, o));
    const wilt = o < 0.3, color = wilt ? "#8a6a9a" : (o < 0.6 ? "#e08fd0" : "#ff8fd8");
    let petals = "";
    for (let i = 0; i < 6; i++) {
      const base = -150 + i * 60, ang = base * (0.12 + 0.88 * o), L = 6 + 4 * o, rx = 2.6 + 1.4 * o;
      petals += `<ellipse cx="20" cy="${(20 - L).toFixed(1)}" rx="${rx.toFixed(1)}" ry="6.5" transform="rotate(${ang.toFixed(1)} 20 20)" fill="${color}" opacity="${wilt ? 0.75 : 0.92}"/>`;
    }
    const heart = o > 0.4 ? '<circle cx="20" cy="20" r="3.6" fill="#fff6a8"/>' : "";
    const droop = wilt ? ` style="transform:rotate(${Math.round((0.3 - o) * 160)}deg);transform-origin:50% 90%"` : "";
    const dim = size ? ` width="${size}" height="${size}"` : "";
    return `<svg viewBox="0 0 40 40"${dim}${droop}>${petals}${heart}</svg>`;
  }
  // A withered flower: bent stem, head hanging down, a petal fallen on the ground
  function wilted(size) {
    const dim = size ? ` width="${size}" height="${size}"` : "";
    let petals = "";
    for (let i = 0; i < 5; i++) petals += `<ellipse cx="31" cy="16" rx="2.3" ry="5.6" transform="rotate(${-48 + i * 24} 31 22)" fill="#7d6490" opacity=".85"/>`;
    return `<svg viewBox="0 0 40 40"${dim}>
      <path d="M13 39 C13 19 17 8 26 9 C30 10 31 13 31 18" fill="none" stroke="#5d7a6a" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M13.5 30 C9 29 7 26 7 23 C11 23 13 25 13.5 30Z" fill="#5d7a6a" opacity=".7"/>
      <g transform="rotate(180 31 22)">${petals}<circle cx="31" cy="22" r="2.2" fill="#a08a6a"/></g>
      <ellipse cx="24" cy="37.5" rx="2.6" ry="1.3" transform="rotate(-20 24 37.5)" fill="#7d6490" opacity=".7"/>
    </svg>`;
  }
  return { svg, wilted };
})();
