export default function SelectionTarget(props) {
  if (!props.mousePos) return null;

  const mousePos = props.mousePos;
  const mouseDown = props.mouseDown;
  const selectedType = props.selectedType;
  const divSize = props.divSize;
  let mouseX = mousePos.x - divSize / 2;
  let mouseY = mousePos.y - divSize / 2;
  return (
    <div
      style={{
        border: "2px solid",
        backgroundColor: mouseDown ? selectedType.color : "rgba(0,0,0,0)",
        borderColor: selectedType.color,
        color: selectedType.color,
        borderRadius: "15%",
        position: "fixed",
        zIndex: 1,
        pointerEvents: "none",
        width: divSize,
        height: divSize,
        left: mouseX || 0,
        top: mouseY || 0,
      }}
    >
      <div
        style={{
          //  put the type name left to the div
          position: "absolute",
          left: divSize + 5,
          top: divSize / 2,
          transform: "translate(0, -50%)",
          color:
            // if the color is too dark, use white text
            selectedType.color[0] * 0.299 +
              selectedType.color[1] * 0.587 +
              selectedType.color[2] * 0.114 >
            186
              ? "black"
              : "white",
          backgroundColor: selectedType.color,
          padding: "0 5px",
          borderRadius: "5px",
          fontSize: "12px",
          whiteSpace: "nowrap",
        }}
      >
        {selectedType.name || "No type selected"}

        <br />
      </div>
    </div>
  );
}
