"""Build the high-resolution transparent D'Accord hero model asset.

The source portrait is preserved pixel-for-pixel below the original crop. Only
the missing crown is supplied by the generated reference, aligned to the face
and blended behind the original photograph.
"""

from __future__ import annotations

import sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1] / ".tools" / "rembg"
sys.path.insert(0, str(TOOLS))

import numpy as np
from PIL import Image
from scipy import ndimage as ndi


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "docs" / "brand-assets" / "hero-recut-v13"
ORIGINAL = ASSET_DIR / "figma-hero-original.png"
ORIGINAL_CUTOUT = ASSET_DIR / "figma-hero-original-cutout.png"
GENERATED = ASSET_DIR / "hero-model-cutout-v13-source.png"
GENERATED_CUTOUT = ASSET_DIR / "hero-model-generated-cutout.png"
MASTER = ASSET_DIR / "hero-model-hd-v13-master.png"
PUBLIC = ROOT / "public" / "images" / "hero-model-hd-v13.png"


def keep_largest_component(alpha: np.ndarray) -> np.ndarray:
    labels, count = ndi.label(alpha > 8)
    if count == 0:
        return np.zeros_like(alpha)
    sizes = np.bincount(labels.ravel())
    subject = int(np.argmax(sizes[1:]) + 1)
    return np.where(labels == subject, alpha, 0).astype(np.uint8)


def checker_alpha(rgb: np.ndarray) -> np.ndarray:
    """Recover alpha from the neutral checkerboard baked into the AI reference."""
    work = rgb.astype(np.float32)
    value = work.mean(axis=2)
    chroma = work.max(axis=2) - work.min(axis=2)
    # The generated preview contains a baked light checkerboard. Conservative
    # thresholds intentionally discard its gray edge residue; the dark hair and
    # warm skin remain well separated from that neutral background.
    darkness = np.clip((202.0 - value) / 48.0, 0.0, 1.0)
    color = np.clip((chroma - 16.0) / 34.0, 0.0, 1.0)
    alpha = np.maximum(darkness, color)
    alpha = ndi.gaussian_filter(alpha, sigma=0.55)
    alpha[alpha < 0.09] = 0
    return np.clip(alpha * 255.0, 0, 255).astype(np.uint8)


def decontaminate(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """Remove the source background color from semitransparent edge pixels."""
    a = alpha.astype(np.float32) / 255.0
    inside = a > 0.01
    _, nearest = ndi.distance_transform_edt(inside, return_indices=True)
    background = rgb[nearest[0], nearest[1]].astype(np.float32)
    color = rgb.astype(np.float32)
    edge = (a > 0.035) & (a < 0.985)
    safe_alpha = np.maximum(a, 0.08)[..., None]
    recovered = (color - (1.0 - a[..., None]) * background) / safe_alpha
    recovered = np.clip(recovered, 0, 255)
    result = color.copy()
    result[edge] = recovered[edge]
    return result.astype(np.uint8)


def rgba_from_source(image_path: Path, alpha: np.ndarray) -> Image.Image:
    rgb = np.asarray(Image.open(image_path).convert("RGB"))
    clean_rgb = decontaminate(rgb, alpha)
    return Image.fromarray(np.dstack((clean_rgb, alpha)), "RGBA")


def main() -> None:
    original_alpha = np.asarray(Image.open(ORIGINAL_CUTOUT).convert("RGBA"))[:, :, 3]
    original_alpha = keep_largest_component(original_alpha)
    original = rgba_from_source(ORIGINAL, original_alpha)

    generated_rgb = np.asarray(Image.open(GENERATED).convert("RGB"))
    if GENERATED_CUTOUT.exists():
        raw_alpha = np.asarray(Image.open(GENERATED_CUTOUT).convert("RGBA"))[:, :, 3]
        raw_alpha = keep_largest_component(raw_alpha)
        core = raw_alpha > 205
        source_work = generated_rgb.astype(np.float32)
        source_value = source_work.mean(axis=2)
        source_chroma = source_work.max(axis=2) - source_work.min(axis=2)
        source_edge_distance = ndi.distance_transform_edt(core)
        matte_residue = (
            core
            & (source_value > 65)
            & (source_chroma < 50)
            & (source_edge_distance < 34)
        )
        core &= ~matte_residue
        # The AI outpaint includes fine flyaways and a few checkerboard-colored
        # islands near the crown. Close tiny gaps and discard one-pixel residue
        # so the silhouette stays clean on white and pale-pink backgrounds.
        core = ndi.binary_closing(core, structure=np.ones((3, 3), dtype=bool))
        core = ndi.binary_opening(core, structure=np.ones((3, 3), dtype=bool))
        core = keep_largest_component(core.astype(np.uint8) * 255) > 0
        generated_alpha = np.clip(
            ndi.gaussian_filter(core.astype(np.float32), sigma=0.72) * 255.0,
            0,
            255,
        ).astype(np.uint8)
        generated_alpha[generated_alpha < 58] = 0
        _, nearest_core = ndi.distance_transform_edt(~core, return_indices=True)
        generated_clean = generated_rgb.copy()
        fringe = (~core) & (generated_alpha > 0)
        nearest_color = generated_rgb[nearest_core[0], nearest_core[1]]
        generated_clean[fringe] = nearest_color[fringe]
    else:
        generated_alpha = checker_alpha(generated_rgb)
        generated_clean = decontaminate(generated_rgb, generated_alpha)
    generated_a = generated_alpha.astype(np.float32) / 255.0
    hair_edge = (generated_alpha > 0) & (generated_alpha < 242)
    edge_factor = np.square(0.13 + (0.87 * generated_a))
    generated_clean[hair_edge] = np.clip(
        generated_clean[hair_edge].astype(np.float32) * edge_factor[hair_edge, None],
        0,
        255,
    ).astype(np.uint8)
    generated = Image.fromarray(np.dstack((generated_clean, generated_alpha)), "RGBA")

    # Landmark-derived similarity mapping from the generated reference to the
    # original Figma portrait. The output is a tight, responsive model canvas.
    canvas_size = (1000, 1130)
    original_crop_x = 700
    original_shift_y = 150
    scale = 0.95
    generated_x = int(round(587 - original_crop_x))
    generated_y = int(round(-293 + original_shift_y))

    generated = generated.resize(
        (int(round(generated.width * scale)), int(round(generated.height * scale))),
        Image.Resampling.LANCZOS,
    )
    crown = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    crown.alpha_composite(generated, (generated_x, generated_y))
    crown_data = np.asarray(crown).copy()
    y = np.arange(canvas_size[1], dtype=np.float32)[:, None]
    # Keep the generated reference only through the forehead, then fade it out
    # before the eyes. This avoids exposing the hard top edge of the original
    # crop while keeping the original face and skin untouched below the blend.
    vertical = np.clip((450.0 - y) / 90.0, 0.0, 1.0)
    crown_data[:, :, 3] = np.clip(
        crown_data[:, :, 3].astype(np.float32) * vertical,
        0,
        255,
    ).astype(np.uint8)
    crown = Image.fromarray(crown_data, "RGBA")

    original_canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    original_canvas.alpha_composite(original, (-original_crop_x, original_shift_y))
    original_data = np.asarray(original_canvas).copy()
    original_support = ndi.binary_dilation(
        original_data[:, :, 3] > 8,
        iterations=12,
    )
    top_blend = np.clip((y - 285.0) / 115.0, 0.0, 1.0)
    original_data[:, :, 3] = np.clip(
        original_data[:, :, 3].astype(np.float32) * top_blend,
        0,
        255,
    ).astype(np.uint8)
    original_canvas = Image.fromarray(original_data, "RGBA")

    # Below the completed crown, the generated layer may only overlap the
    # original subject silhouette. This prevents a secondary outline from
    # appearing beside the hair while keeping the new top fully visible.
    crown_data = np.asarray(crown).copy()
    support_mix = np.clip((y - 245.0) / 105.0, 0.0, 1.0)
    support_alpha = (
        (1.0 - support_mix)
        + (support_mix * original_support.astype(np.float32))
    )
    crown_data[:, :, 3] = np.clip(
        crown_data[:, :, 3].astype(np.float32) * support_alpha,
        0,
        255,
    ).astype(np.uint8)
    crown = Image.fromarray(crown_data, "RGBA")

    master = Image.alpha_composite(crown, original_canvas)
    master.save(MASTER, optimize=True)

    high_res = master.resize((2000, 2260), Image.Resampling.LANCZOS)
    PUBLIC.parent.mkdir(parents=True, exist_ok=True)
    high_res.save(PUBLIC, optimize=True)

    for name, color in (
        ("qa-hero-model-on-white.png", (255, 255, 255, 255)),
        ("qa-hero-model-on-pink.png", (247, 216, 224, 255)),
        ("qa-hero-model-on-plum.png", (43, 25, 36, 255)),
    ):
        plate = Image.new("RGBA", high_res.size, color)
        plate.alpha_composite(high_res)
        plate.convert("RGB").save(ASSET_DIR / name, quality=94, optimize=True)

    bbox = high_res.getbbox()
    print(f"master={MASTER}")
    print(f"public={PUBLIC}")
    print(f"size={high_res.width}x{high_res.height} bbox={bbox}")


if __name__ == "__main__":
    main()
