// Original chords (code-safe)
const chords = {
  C: ["C", "Dm", "Em", "F", "G", "Am", "Bdim", "Edim", "F#dim"],
  G: ["G", "Am", "Bm", "C", "D", "Em", "F#dim", "Bdim", "C#dim"],
  D: ["D", "Em", "F#m", "G", "A", "Bm", "C#dim", "F#dim", "G#dim"],
  A: ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim", "C#dim", "D#dim"],
  E: ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim", "G#dim", "A#dim"],
  B: ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim", "D#dim", "Fdim"],
  "F#": ["F#", "G#m", "A#m", "B", "C#", "D#m", "Fdim", "A#dim", "Cdim"],
  Db: ["Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim", "Fdim", "Gdim"],
  Ab: ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim", "Cdim", "Ddim"],
  Eb: ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim", "Gdim", "Adim"],
  Bb: ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim", "Ddim", "Edim"],
  F: ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim", "Adim", "Bdim"]
};

// Layout mapping
const layout = {
  0: "r1c2",
  1: "r2c1",
  2: "r2c3",
  3: "r1c1",
  4: "r1c3",
  5: "r2c2",
  6: "r3c2",
  7: "r3c1",
  8: "r3c3"
};

// Buttons and containers
const buttons = document.querySelectorAll(".button-container button");
const keyName = document.getElementById("keyName");
const singleTableContainer = document.getElementById("singleTableContainer");
const allTablesContainer = document.getElementById("allTablesContainer");

// --------------------
// Display conversion
// --------------------
function toDisplayChord(chord) {
  return chord.replace(/b/g, "♭").replace(/#/g, "♯");
}

function convertChordsForDisplay(chordsObj) {
  const displayChords = {};
  for (const key in chordsObj) {
    displayChords[key] = chordsObj[key].map(toDisplayChord);
  }
  return displayChords;
}

const displayChords = convertChordsForDisplay(chords);

// --------------------
// Generate table HTML
// --------------------
function generateTableHTML(chordList, originalChordList) {
  let html = `<table>`;
  for (let r = 1; r <= 3; r++) {
    html += `<tr>`;
    for (let c = 1; c <= 3; c++) {
      html += `<td id="r${r}c${c}"></td>`;
    }
    html += `</tr>`;
  }
  html += `</table>`;

  const table = document.createElement("div");
  table.innerHTML = html;

  chordList.forEach((chord, i) => {
    const cellId = layout[i];
    if (cellId) {
      const cell = table.querySelector(`#${cellId}`);
      if (cellId === "r3c1" || cellId === "r3c3") {
        cell.textContent = chord;
      } else {
        cell.innerHTML = `<div class="index-label">${i + 1}</div>${chord}`;
      }

      // Use original chord for CSS classes
      const originalChord = originalChordList[i];
      if (originalChord.includes("#")) cell.classList.add("sharp");
      else if (originalChord.includes("b")) cell.classList.add("flat");
    }
  });

  return table.innerHTML;
}

// --------------------
// Button click logic
// --------------------
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.textContent;
    keyName.textContent = "";
    singleTableContainer.innerHTML = "";
    allTablesContainer.innerHTML = "";
    allTablesContainer.style.display = "none";

    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    if (key === "All") {
      allTablesContainer.style.display = "grid";
      for (const k in displayChords) {
        const tableDiv = document.createElement("div");
        tableDiv.classList.add("table-container");
        tableDiv.innerHTML = `<div class='key-title'>${k}</div>${generateTableHTML(
          displayChords[k],
          chords[k]
        )}`;
        allTablesContainer.appendChild(tableDiv);
      }
    } else {
      keyName.textContent = `Key of ${key}`;
      singleTableContainer.innerHTML = generateTableHTML(
        displayChords[key],
        chords[key]
      );
    }
  });
});

// --------------------
// Default load: Key C
// --------------------
window.addEventListener("DOMContentLoaded", () => {
  const defaultButton = Array.from(buttons).find(
    (btn) => btn.textContent === "C"
  );
  if (defaultButton) {
    defaultButton.classList.add("active");
    keyName.textContent = "Key of C";
    singleTableContainer.innerHTML = generateTableHTML(
      displayChords["C"],
      chords["C"]
    );
  }
});
