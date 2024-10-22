// App.jsx

import React, { useState } from "react";
import escpos from "escpos";

const App = () => {
  const [jsonData, setJsonData] = useState({
    title: "Sample JSON Data",
    items: ["Item 1", "Item 2", "حرل 3"],
  });

  const drawJSONToCanvas = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw JSON content onto canvas
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(jsonData.title, 10, 30);

    ctx.font = "16px Arial";
    for (let i = 0; i < jsonData.items.length; i++) {
      ctx.fillText(jsonData.items[i], 10, 60 + 20 * i);
    }
  };

  const printImage = () => {
    const canvas = document.getElementById("canvas");
    const image = canvas.toDataURL(); // defaults to PNG format

    // Convert image data to ESC/POS raster format
    escpos.Image.load(image, function (imageData) {
      const device = new escpos.Network("192.168.1.168");
      const printer = new escpos.Printer(device);
      printer.image(imageData);
      printer.cut();
      printer.close();
    });
  };

  const connectToPrinter = (host, port, buffer) => {
    return new Promise((resolve, reject) => {
      const device = new WebSocket(`ws://${host}:${port}`);

      device.binaryType = "arraybuffer";

      device.onopen = function () {
        // Convert image data to ArrayBuffer
        const binaryImage = atob(buffer.split(",")[1]);
        const length = binaryImage.length;
        const bufferArray = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          bufferArray[i] = binaryImage.charCodeAt(i);
        }

        // Send image data
        device.send(bufferArray);
      };

      device.onerror = function (error) {
        reject(error);
      };

      device.onclose = function () {
        resolve(true);
      };
    });
  };

  const handleClick = () => {
    drawJSONToCanvas();
    connectToPrinter(
      "192.168.1.168",
      9100,
      document.getElementById("canvas").toDataURL()
    )
      .then(() => {
        console.log("Print job sent successfully.");
      })
      .catch((error) => {
        console.error("Error sending print job:", error);
      });
  };

  return (
    <div>
      <canvas id="canvas" width="576" height="200"></canvas>
      <br />
      <button onClick={handleClick}>Print Image</button>
    </div>
  );
};

export default App;
