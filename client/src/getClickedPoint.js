export default function getClickedPoint(x, y, dataOnPlot) {
    const allPoints = Array.from(document.querySelectorAll(".custom-dot"));
  
    for (let i = 0; i < allPoints.length; i++) {
      const { chartX, chartY, xValue, yValue, radius } = allPoints[i].dataset;
  
      // calculate distance between 2 points
      const pointX = Number(chartX);
      const pointY = Number(chartY);
      const deltaX = x - pointX;
      const deltaY = y - pointY;
      const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  
      // if distance <= radius, then clicked on a dot
      if (distance <= Number(radius)) {
        const dataPoint = dataOnPlot.find(
          (d) => d.x === Number(xValue) && d.y === Number(yValue)
        );
        if (dataPoint) {
          return dataPoint;
        }
      }
    }
  }
  