const puppeteer = require("puppeteer");
const { createCanvas, loadImage } = require("canvas");
const connectToPrinter = require("./connectToPrinter");

// Function to capture screenshot of widget containing text
async function captureWidgetScreenshot(text) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(`<div>${text}</div>`);

  // Capture a screenshot of the widget
  const screenshotBuffer = await page.screenshot({ fullPage: true });
  await browser.close();

  return screenshotBuffer;
}

function convertScreenshotToUint8Array(screenshotBuffer) {
  return new Uint8Array(screenshotBuffer);
}

// Function to print Uint8 image
async function posPrint(uint8Image, ipAddress) {
  try {
    // Connect to the printer and send the image data
    await connectToPrinter(ipAddress, 9100, uint8Image);
    console.log("Image printed successfully");
  } catch (error) {
    console.error("Error printing image:", error);
  }
}

// Sample data
const sampleData = "Hello, this is a sample text!";
const printerIPAddress = "192.168.1.168"; // Replace with your printer's IP address

// Main function to execute the steps
async function main() {
  try {
    // Step 1: Capture screenshot of the widget containing text
    const screenshotBuffer = await captureWidgetScreenshot(sampleData);
    console.log("Captured Screenshot Buffer:", screenshotBuffer);

    // Step 2: Convert image buffer to Uint8 format
    const uint8Image = convertScreenshotToUint8Array(screenshotBuffer);
    // console.log("convertScreenshotToUint8Array:", uint8Image);

    // Step 3: Print Uint8 image
    await posPrint(uint8Image, printerIPAddress);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Execute main function
main();
