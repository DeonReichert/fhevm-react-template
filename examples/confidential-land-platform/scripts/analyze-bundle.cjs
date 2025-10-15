#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes production build for performance and security
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeDirectory(dirPath) {
  const files = [];

  function walkDir(currentPath) {
    const items = fs.readdirSync(currentPath);

    items.forEach((item) => {
      const fullPath = path.join(currentPath, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        walkDir(fullPath);
      } else if (stats.isFile()) {
        files.push({
          path: path.relative(dirPath, fullPath),
          size: stats.size,
          ext: path.extname(fullPath),
        });
      }
    });
  }

  walkDir(dirPath);
  return files;
}

function categorizeFiles(files) {
  const categories = {
    js: [],
    css: [],
    html: [],
    assets: [],
    other: [],
  };

  files.forEach((file) => {
    if (file.ext === '.js') categories.js.push(file);
    else if (file.ext === '.css') categories.css.push(file);
    else if (file.ext === '.html') categories.html.push(file);
    else if (['.png', '.jpg', '.jpeg', '.svg', '.ico', '.webp'].includes(file.ext))
      categories.assets.push(file);
    else categories.other.push(file);
  });

  return categories;
}

function analyzeBundle() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}   📊 Bundle Analysis Report${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════${colors.reset}\n`);

  const distPath = path.join(process.cwd(), 'dist');

  if (!fs.existsSync(distPath)) {
    console.error(`${colors.red}❌ Error: dist/ directory not found${colors.reset}`);
    console.log(`   Run 'npm run build' first\n`);
    process.exit(1);
  }

  const files = analyzeDirectory(distPath);
  const categories = categorizeFiles(files);

  // Total size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  console.log(`${colors.blue}📦 Total Bundle Size: ${colors.green}${formatBytes(totalSize)}${colors.reset}\n`);

  // JavaScript files
  console.log(`${colors.yellow}🔸 JavaScript Files (${categories.js.length})${colors.reset}`);
  const jsTotalSize = categories.js.reduce((sum, file) => sum + file.size, 0);
  console.log(`   Total: ${formatBytes(jsTotalSize)}\n`);

  categories.js
    .sort((a, b) => b.size - a.size)
    .forEach((file) => {
      const sizeWarning = file.size > 600 * 1024 ? `${colors.red}⚠️ ` : '';
      console.log(`   ${sizeWarning}${file.path.padEnd(40)} ${formatBytes(file.size)}${colors.reset}`);
    });

  // CSS files
  if (categories.css.length > 0) {
    console.log(`\n${colors.yellow}🔸 CSS Files (${categories.css.length})${colors.reset}`);
    const cssTotalSize = categories.css.reduce((sum, file) => sum + file.size, 0);
    console.log(`   Total: ${formatBytes(cssTotalSize)}\n`);

    categories.css
      .sort((a, b) => b.size - a.size)
      .forEach((file) => {
        console.log(`   ${file.path.padEnd(40)} ${formatBytes(file.size)}`);
      });
  }

  // HTML files
  if (categories.html.length > 0) {
    console.log(`\n${colors.yellow}🔸 HTML Files (${categories.html.length})${colors.reset}`);
    const htmlTotalSize = categories.html.reduce((sum, file) => sum + file.size, 0);
    console.log(`   Total: ${formatBytes(htmlTotalSize)}\n`);

    categories.html.forEach((file) => {
      console.log(`   ${file.path.padEnd(40)} ${formatBytes(file.size)}`);
    });
  }

  // Assets
  if (categories.assets.length > 0) {
    console.log(`\n${colors.yellow}🔸 Assets (${categories.assets.length})${colors.reset}`);
    const assetsTotalSize = categories.assets.reduce((sum, file) => sum + file.size, 0);
    console.log(`   Total: ${formatBytes(assetsTotalSize)}\n`);

    categories.assets
      .sort((a, b) => b.size - a.size)
      .slice(0, 5)
      .forEach((file) => {
        console.log(`   ${file.path.padEnd(40)} ${formatBytes(file.size)}`);
      });

    if (categories.assets.length > 5) {
      console.log(`   ... and ${categories.assets.length - 5} more`);
    }
  }

  // Performance recommendations
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}   ⚡ Performance Recommendations${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════${colors.reset}\n`);

  const recommendations = [];

  // Check chunk sizes
  const largeChunks = categories.js.filter((file) => file.size > 600 * 1024);
  if (largeChunks.length > 0) {
    recommendations.push(
      `${colors.yellow}⚠️  Large JS chunks detected (> 600KB)${colors.reset}`,
      '   Consider splitting these chunks further or lazy loading'
    );
  }

  // Check total size
  if (totalSize > 3 * 1024 * 1024) {
    recommendations.push(
      `${colors.yellow}⚠️  Total bundle size exceeds 3MB${colors.reset}`,
      '   Consider code splitting and lazy loading'
    );
  }

  // Gzip estimation
  const estimatedGzipSize = Math.round(totalSize * 0.3); // ~30% compression ratio
  console.log(`${colors.blue}📊 Estimated Gzipped Size: ${formatBytes(estimatedGzipSize)}${colors.reset}`);

  if (estimatedGzipSize < 500 * 1024) {
    console.log(`${colors.green}✅ Excellent bundle size (< 500KB gzipped)${colors.reset}`);
  } else if (estimatedGzipSize < 1024 * 1024) {
    console.log(`${colors.yellow}⚠️  Good bundle size (< 1MB gzipped)${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Large bundle size (> 1MB gzipped)${colors.reset}`);
  }

  if (recommendations.length > 0) {
    console.log('');
    recommendations.forEach((rec) => console.log(rec));
  } else {
    console.log(`\n${colors.green}✅ No performance issues detected!${colors.reset}`);
  }

  // Security checks
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}   🔒 Security Checks${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════${colors.reset}\n`);

  // Check for source maps in production
  const sourceMaps = files.filter((file) => file.ext === '.map');
  if (sourceMaps.length > 0) {
    console.log(`${colors.red}❌ Source maps found in production build${colors.reset}`);
    console.log('   Remove source maps to prevent code exposure\n');
  } else {
    console.log(`${colors.green}✅ No source maps in production${colors.reset}\n`);
  }

  // Check for unminified files
  const suspiciouslyLarge = categories.js.filter((file) => {
    const sizePerChar = file.size / (file.path.length || 1);
    return sizePerChar > 1000; // Heuristic for unminified files
  });

  if (suspiciouslyLarge.length > 0) {
    console.log(`${colors.yellow}⚠️  Possibly unminified files detected${colors.reset}`);
    console.log('   Ensure minification is enabled\n');
  } else {
    console.log(`${colors.green}✅ All files appear minified${colors.reset}\n`);
  }

  console.log(`${colors.cyan}═══════════════════════════════════════════════${colors.reset}\n`);

  // Summary
  const summary = {
    totalSize: formatBytes(totalSize),
    estimatedGzipSize: formatBytes(estimatedGzipSize),
    fileCount: files.length,
    jsFiles: categories.js.length,
    cssFiles: categories.css.length,
    assetFiles: categories.assets.length,
    largeChunks: largeChunks.length,
    sourceMaps: sourceMaps.length,
  };

  // Save report
  const reportPath = path.join(process.cwd(), 'bundle-analysis.json');
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log(`${colors.blue}📄 Report saved to: bundle-analysis.json${colors.reset}\n`);

  // Exit with error if critical issues found
  if (largeChunks.length > 3 || sourceMaps.length > 0) {
    process.exit(1);
  }
}

// Run analysis
try {
  analyzeBundle();
} catch (error) {
  console.error(`${colors.red}❌ Error analyzing bundle:${colors.reset}`, error.message);
  process.exit(1);
}
