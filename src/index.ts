/*
  Generative Twitter Handle Image
  By: PseudoRAM

  Create unique images by changing url query parameters!
  example: https://0ub9g.sse.codesandbox.io/?handle=ramcoding
*/

import Jimp from "jimp";
import express from "express";
import fs from "fs";

const app = express();
const port = 3000;

const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 628;

// Load background
let jimpBG: Jimp | null = null;
fs.readFile("./assets/twitter.jpg", async (_error, bgFile) => {
  jimpBG = await Jimp.read(bgFile);
});

// Load font
let twitterFont = null;
Jimp.loadFont("./assets/font.fnt").then(font => (twitterFont = font));

// Create
const generateImage = async (handle: string): Promise<Buffer> => {
  const img: Jimp = new Jimp(IMAGE_WIDTH, IMAGE_HEIGHT);

  // Apply background
  img.blit(jimpBG, 0, 0);

  // Get text details
  const text: string = `@${handle}`;
  const textWidth: number = Jimp.measureText(twitterFont, text);
  const textHeight: number = Jimp.measureTextHeight(
    twitterFont,
    text,
    textWidth
  );

  // Apply text
  img.print(
    twitterFont,
    IMAGE_WIDTH / 2 - textWidth / 2,
    IMAGE_HEIGHT / 2 - textHeight / 2,
    text
  );

  return img.getBufferAsync(Jimp.MIME_JPEG);
};

// Set express endpoint
app.get("/", async (req, res) => {
  const handle: string = `${req.query.handle || "ramcoding"}`;
  const img: Buffer = await generateImage(handle);

  res.writeHead(200, {
    "Content-Type": "image/jpeg",
    "Cache-Control": "public, max-age=2592000",
    "Content-Length": img.length
  });

  res.end(img);
});

app.listen(port, () =>
  console.log(`Generative images listening at http://localhost:${port}`)
);
