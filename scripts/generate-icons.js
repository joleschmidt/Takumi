const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const svgPath = path.join(__dirname, '../src/app/icon.svg');
const outputDir = path.join(__dirname, '../chrome-extension');

// Read SVG file
const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Sizes needed for Chrome extension
const sizes = [16, 48, 128];

// Generate PNG for each size
sizes.forEach(size => {
  const resvg = new Resvg(svgContent, {
    fitTo: {
      mode: 'width',
      value: size,
    },
  });
  
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  
  const outputPath = path.join(outputDir, `icon${size}.png`);
  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`✓ Generated icon${size}.png`);
});

console.log('\n✅ All icons generated successfully!');

