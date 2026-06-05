#!/bin/bash
# Exit on error
set -e

echo "============================================="
echo "  Deploying Portfolio to GitHub & Vercel     "
echo "============================================="

echo ""
echo "1. Staging and committing changes..."
git add .
git commit -m "fix: navigation links, standardize index.html, update linkedin profile" || echo "No new changes to commit"

echo ""
echo "2. Pushing to GitHub (origin/main)..."
git push origin main

echo ""
echo "3. Deploying to Vercel..."
npx vercel --prod --name thakurvikas9

echo ""
echo "============================================="
echo "  Deployment Complete!                       "
echo "  Visit: https://thakurvikas9.vercel.app      "
echo "============================================="
