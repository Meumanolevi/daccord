import sharp from "sharp";

const [inputPath, outputPath, scaleArgument = "1"] = process.argv.slice(2);
const scale = Number.parseFloat(scaleArgument);

if (!inputPath || !outputPath || !Number.isFinite(scale) || scale < 1) {
  throw new Error("Usage: node scripts/extract-white-background.mjs <input> <output> [scale>=1]");
}

const metadata = await sharp(inputPath).metadata();
const source = sharp(inputPath);

if (scale > 1 && metadata.width && metadata.height) {
  source.resize({
    width: Math.round(metadata.width * scale),
    height: Math.round(metadata.height * scale),
    kernel: sharp.kernel.lanczos3,
  });
}

const { data, info } = await source
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const pixelCount = width * height;
const connectedBackground = new Uint8Array(pixelCount);
const queue = new Int32Array(pixelCount);
let head = 0;
let tail = 0;

const canBelongToBackground = (index) => {
  const offset = index * channels;
  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];
  const darkest = Math.min(red, green, blue);
  const lightest = Math.max(red, green, blue);

  return darkest >= 226 && lightest - darkest <= 44;
};

const enqueue = (index) => {
  if (connectedBackground[index] || !canBelongToBackground(index)) return;
  connectedBackground[index] = 1;
  queue[tail++] = index;
};

for (let x = 0; x < width; x += 1) {
  enqueue(x);
  enqueue((height - 1) * width + x);
}

for (let y = 0; y < height; y += 1) {
  enqueue(y * width);
  enqueue(y * width + width - 1);
}

while (head < tail) {
  const index = queue[head++];
  const x = index % width;
  const y = Math.floor(index / width);

  if (x > 0) enqueue(index - 1);
  if (x + 1 < width) enqueue(index + 1);
  if (y > 0) enqueue(index - width);
  if (y + 1 < height) enqueue(index + width);
}

const edgeRadius = Math.round(12 * scale);
const edgeDistance = new Uint8Array(pixelCount);
head = 0;
tail = 0;

for (let index = 0; index < pixelCount; index += 1) {
  if (!connectedBackground[index]) continue;
  edgeDistance[index] = 1;
  queue[tail++] = index;
}

while (head < tail) {
  const index = queue[head++];
  const distance = edgeDistance[index];
  if (distance > edgeRadius) continue;

  const x = index % width;
  const y = Math.floor(index / width);
  const visit = (neighbor) => {
    if (edgeDistance[neighbor]) return;
    edgeDistance[neighbor] = distance + 1;
    queue[tail++] = neighbor;
  };

  if (x > 0) visit(index - 1);
  if (x + 1 < width) visit(index + 1);
  if (y > 0) visit(index - width);
  if (y + 1 < height) visit(index + width);
}

for (let index = 0; index < pixelCount; index += 1) {
  const offset = index * channels;

  if (connectedBackground[index]) {
    data[offset + 3] = 0;
    continue;
  }

  const distance = edgeDistance[index] - 1;
  if (distance < 1 || distance > edgeRadius) continue;

  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];
  const darkest = Math.min(red, green, blue);
  const lightest = Math.max(red, green, blue);
  const chroma = lightest - darkest;

  if (darkest <= 168 || chroma > 100) continue;

  const alpha = Math.max(0, Math.min(255, Math.round(((190 - darkest) / 22) * 255)));
  data[offset + 3] = alpha;

  if (alpha > 0 && alpha < 255) {
    const normalizedAlpha = alpha / 255;
    for (let channel = 0; channel < 3; channel += 1) {
      data[offset + channel] = Math.max(
        0,
        Math.min(255, Math.round((data[offset + channel] - 255 * (1 - normalizedAlpha)) / normalizedAlpha)),
      );
    }
  }
}

await sharp(data, { raw: { width, height, channels } })
  .png({ compressionLevel: 9 })
  .toFile(outputPath);
