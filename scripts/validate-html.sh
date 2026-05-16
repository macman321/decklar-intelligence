#!/bin/bash
# HTML Validator for Decklar Blog
# Prevents broken CSS/JS links from being committed

echo "🔍 Validating HTML files..."

ERRORS=0

# Check all HTML files for malformed link/script tags
for file in $(find ~/decklar-intelligence/gavin/blog/_site -name "*.html"); do
    # Check for malformed CSS links (missing >)
    if grep -n 'rel="stylesheet"[^>]*$' "$file" | grep -v '>$' | grep -v 'href='; then
        echo "❌ ERROR: $file has malformed CSS link tag"
        grep -n 'rel="stylesheet"[^>]*$' "$file" | head -3
        ERRORS=$((ERRORS + 1))
    fi
    
    # Check for malformed script tags
    if grep -n '<script[^>]*src=' "$file" | grep -v '></script>'; then
        echo "❌ ERROR: $file has malformed script tag"
        grep -n '<script[^>]*src=' "$file" | grep -v '></script>' | head -3
        ERRORS=$((ERRORS + 1))
    fi
    
    # Check for unclosed tags in head
    if sed -n '/<head>/,/<\/head>/p' "$file" | grep -E '<link[^>]*[^/]>$' | head -1; then
        echo "❌ ERROR: $file has unclosed link tag in head"
        ERRORS=$((ERRORS + 1))
    fi
done

if [ $ERRORS -eq 0 ]; then
    echo "✅ All HTML files validated successfully"
    exit 0
else
    echo "❌ Found $ERRORS validation errors"
    exit 1
fi
