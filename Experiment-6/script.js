const svgCanvas = document.getElementById("drawingCanvas");
let isDrawing = false;
let currentPath;

svgCanvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  const { x, y } = getMousePosition(e);
  currentPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  currentPath.setAttribute("stroke", "black");
  currentPath.setAttribute("stroke-width", "2");
  currentPath.setAttribute("fill", "none");
  currentPath.setAttribute("d", `M${x},${y}`); // Start the path
  svgCanvas.appendChild(currentPath);
});

svgCanvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  const { x, y } = getMousePosition(e);
  const d = currentPath.getAttribute("d");
  currentPath.setAttribute("d", `${d} L${x},${y}`);
});

svgCanvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

svgCanvas.addEventListener("mouseleave", () => {
  isDrawing = false;
});

// Helper function to get relative mouse position
function getMousePosition(evt) {
  const rect = svgCanvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}