export const getServerTimestamp = async () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const resp = await fetch(`/timestamp?tz=${encodeURIComponent(timezone)}`);
    if (!resp.ok) {
      throw new Error();
    }
    const data = await resp.json();
    return data.timestamp;
  } catch (error) {
    console.error("Failed to get server timestamp:", error);
    const now = new Date();
    return now.toISOString().replace("T", " ").slice(0, 19);
  }
};

export const applyDateWatermarkToCanvas = (canvas, dateString) => {
  return new Promise((resolve) => {
    const context = canvas.getContext("2d");
    if (!context) {
      resolve(canvas);
      return;
    }

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    const fontSize = Math.max(12, Math.floor(canvas.height * 0.08)); // NOTE: based on image height
    context.font = `${fontSize}px Arial`;
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "bottom";

    const textX = canvas.width / 2;
    const textY = canvas.height - 4;

    context.fillText(dateString, textX, textY);
    context.restore();
    resolve(canvas);
  });
};
