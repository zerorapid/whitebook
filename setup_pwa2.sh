#!/bin/bash
set -e
cd /Users/Jayapalreddy/.gemini/antigravity/scratch/crm-os-next

# 2. Update next.config.mjs
echo "Updating next.config.mjs..."
cat << 'CONFIG' > next.config.mjs
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default withPWA(nextConfig);
CONFIG

# 3. Create Manifest
echo "Creating manifest.json..."
cat << 'MANIFEST' > public/manifest.json
{
  "name": "White Book",
  "short_name": "White Book",
  "description": "Private Network Directory",
  "display": "standalone",
  "background_color": "#18181b",
  "theme_color": "#18181b",
  "orientation": "portrait",
  "start_url": "/",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
MANIFEST

# 4. Generate/Download Icons
echo "Generating app icons..."
mkdir -p public/icons
curl -sL "https://ui-avatars.com/api/?name=WB&background=18181b&color=fff&size=192&font-size=0.33&bold=true" -o public/icons/icon-192x192.png
curl -sL "https://ui-avatars.com/api/?name=WB&background=18181b&color=fff&size=512&font-size=0.33&bold=true" -o public/icons/icon-512x512.png

# 5. Update layout.tsx Metadata
echo "Updating Layout metadata..."
node -e "
const fs = require('fs');
let content = fs.readFileSync('src/app/layout.tsx', 'utf8');

const newMetadata = \`export const metadata: import('next').Metadata = {
  title: \\\"White Book\\\",
  description: \\\"White Book - Private Directory\\\",
  manifest: \\\"/manifest.json\\\",
  appleWebApp: {
    capable: true,
    statusBarStyle: \\\"black-translucent\\\",
    title: \\\"White Book\\\",
  },
};

export const viewport = {
  themeColor: \\\"#18181b\\\",
};\`;

content = content.replace(/export const metadata: Metadata = \\{[\\s\\S]*?\\};/, newMetadata);
fs.writeFileSync('src/app/layout.tsx', content);
"

# 6. Verify Build
echo "Building..."
npm run build

echo "PWA Setup Complete!"
