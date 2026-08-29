import sharp from "sharp";

const [inputPath, outputPath, scaleArgument = "1"] = process.argv.slice(2);
const scale = Number.parseFloat(scaleArgument);

if (!inputPath || !outputPath || !Number.isFinite(scale) || scale < 1) {
  throw new Error("Usage: node scripts/extract-chroma-green.mjs <input> <output> [scale>=1]");
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
const fullyOpaqueAt = 0;
const fullyTransparentAt = 168;

for (let offset = 0; offset < data.length; offset += channels) {
  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];
  const greenDominance = green - Math.max(red, blue);

  if (greenDominance <= fullyOpaqueAt) {
    data[offset + 3] = 255;
    continue;
  }

  if (greenDominance >= fullyTransparentAt) {
    data[offset] = 0;
    data[offset + 1] = 0;
    data[offset + 2] = 0;
    data[offset + 3] = 0;
    continue;
  }

  const alpha = Math.max(
    0,
    Math.min(
      255,
      Math.round(
        ((fullyTransparentAt - greenDominance) / (fullyTransparentAt - fullyOpaqueAt)) * 255,
      ),
    ),
  );
  const normalizedAlpha = alpha / 255;

  data[offset] = Math.max(0, Math.min(255, Math.round(red / normalizedAlpha)));
  data[offset + 1] = Math.max(
    0,
    Math.min(255, Math.round((green - 255 * (1 - normalizedAlpha)) / normalizedAlpha)),
  );
  data[offset + 2] = Math.max(0, Math.min(255, Math.round(blue / normalizedAlpha)));

  const neutralMix = Math.max(0, Math.min(1, (210 - alpha) / 210));
  const neutralHair = Math.min(
    72,
    Math.round((data[offset] + data[offset + 1] + data[offset + 2]) / 3),
  );

  for (let channel = 0; channel < 3; channel += 1) {
    data[offset + channel] = Math.round(
      data[offset + channel] * (1 - neutralMix) + neutralHair * neutralMix,
    );
  }

  data[offset + 3] = alpha;
}

// Blur premultiplied color and alpha together. This gives the matte a smooth,
// subpixel transition without pulling chroma green into hair or skin edges.
const premultiplied = Buffer.from(data);

for (let offset = 0; offset < premultiplied.length; offset += channels) {
  const alpha = premultiplied[offset + 3] / 255;
  premultiplied[offset] = Math.round(premultiplied[offset] * alpha);
  premultiplied[offset + 1] = Math.round(premultiplied[offset + 1] * alpha);
  premultiplied[offset + 2] = Math.round(premultiplied[offset + 2] * alpha);
}

const smoothed = await sharp(premultiplied, {
  raw: { width, height, channels },
})
  .blur(0.62)
  .raw()
  .toBuffer();

for (let offset = 0; offset < smoothed.length; offset += channels) {
  const alpha = smoothed[offset + 3];

  if (alpha === 0) {
    smoothed[offset] = 0;
    smoothed[offset + 1] = 0;
    smoothed[offset + 2] = 0;
    continue;
  }

  const normalizedAlpha = alpha / 255;
  smoothed[offset] = Math.min(255, Math.round(smoothed[offset] / normalizedAlpha));
  smoothed[offset + 1] = Math.min(255, Math.round(smoothed[offset + 1] / normalizedAlpha));
  smoothed[offset + 2] = Math.min(255, Math.round(smoothed[offset + 2] / normalizedAlpha));

  // Generated chroma plates can carry a faint magenta fringe. Neutralize only
  // the translucent matte pixels, leaving opaque hair and skin untouched.
  const neutralMix = Math.max(0, Math.min(1, (220 - alpha) / 220));
  const neutralEdge = Math.min(
    64,
    Math.round((smoothed[offset] + smoothed[offset + 1] + smoothed[offset + 2]) / 3),
  );

  for (let channel = 0; channel < 3; channel += 1) {
    smoothed[offset + channel] = Math.round(
      smoothed[offset + channel] * (1 - neutralMix) + neutralEdge * neutralMix,
    );
  }
}

await sharp(smoothed, { raw: { width, height, channels } })
  .png({ compressionLevel: 9 })
  .toFile(outputPath);
