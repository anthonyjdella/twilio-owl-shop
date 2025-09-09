#!/bin/bash

# Clean up
rm -rf out

# Create out directory
mkdir -p out

# Copy index file
cp .next/server/app/index.html out/index.html

# Create directory structure and copy HTML files
for file in .next/server/app/*.html; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .html)
        if [ "$filename" != "index" ]; then
            mkdir -p "out/$filename"
            cp "$file" "out/$filename/index.html"
        fi
    fi
done

# Handle nested pages
if [ -d ".next/server/app/checkout" ]; then
    mkdir -p out/checkout
    if [ -f ".next/server/app/checkout.html" ]; then
        cp .next/server/app/checkout.html out/checkout/index.html
    fi
    if [ -f ".next/server/app/checkout/success.html" ]; then
        mkdir -p out/checkout/success
        cp .next/server/app/checkout/success.html out/checkout/success/index.html
    fi
fi

if [ -d ".next/server/app/products" ]; then
    mkdir -p out/products
    if [ -f ".next/server/app/products.html" ]; then
        cp .next/server/app/products.html out/products/index.html
    fi
fi

# Copy static assets
mkdir -p out/_next
cp -r .next/static out/_next/ 2>/dev/null || true

# Copy other assets if they exist
if [ -d "public" ]; then
    cp -r public/* out/ 2>/dev/null || true
fi

# Fix asset paths for GitHub Pages
if [ "$NODE_ENV" = "production" ]; then
    echo "Fixing asset paths for GitHub Pages..."
    find out -name "*.html" -type f -exec sed -i '' 's|href="/_next/|href="/twilio-owl-shop/_next/|g' {} \;
    find out -name "*.html" -type f -exec sed -i '' 's|src="/_next/|src="/twilio-owl-shop/_next/|g' {} \;
    echo "Asset paths fixed."
fi

echo "Static export completed in 'out' directory"
