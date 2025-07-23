#!/bin/bash

# Usage: ./optimize-glb.sh model.glb
INPUT="$1"
if [ -z "$INPUT" ]; then
  echo "❌ Please provide a .glb file."
  exit 1
fi

BASENAME=$(basename "$INPUT" .glb)
DIR=$(dirname "$INPUT")
cd "$DIR" || exit 1

# --------- Common Clean Step ---------
echo "🧹 Pruning unused data..."
gltf-transform prune "$INPUT" "temp-pruned.glb"

HAS_UV=$(gltf-transform inspect temp-pruned.glb | grep TEXCOORD_0)

if [ -z "$HAS_UV" ]; then
  echo "No UVs found — generating UVs..."
  gltf-transform unwrap temp-pruned.glb temp-unwrap.glb --verbose
  rm temp-pruned.glb
  mv temp-unwrap.glb temp-pruned.glb
  echo "✅ UVs added and compressed → temp-pruned.glb"
else
  echo "✅ Model already has UVs — skipping unwrap."
fi

# ===== Desktop Version =====
echo "🖥 Optimizing desktop version..."
gltf-transform resize temp-pruned.glb temp-desktop-resize.glb --width 2048 --height 2048
gltf-transform webp temp-desktop-resize.glb temp-desktop-textures.glb --slots "{baseColorTexture}"
gltfpack -i temp-desktop-textures.glb -o "${BASENAME}-desktop.glb" -cc -si 1

# ===== Mobile Version =====
echo "📱 Optimizing mobile version..."
gltf-transform resize temp-pruned.glb temp-mobile-resize.glb --width 512 --height 512
gltf-transform webp temp-mobile-resize.glb temp-mobile-textures.glb --slots "{baseColorTexture}"
gltfpack -i temp-mobile-textures.glb -o "${BASENAME}-mobile.glb" -cc -si 0.3

# --------- Cleanup ---------
rm temp-*.glb

echo "✅ Done!"
echo " - Desktop: ${BASENAME}-desktop.glb"
echo " - Mobile:  ${BASENAME}-mobile.glb"

#--------- Note ---------
# gltf-transform meshopt vs gltfpack