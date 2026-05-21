#!/bin/bash

# GitHub Push Script for Capital Project Coordinator
# This script will push the repository to GitHub

echo "🚀 Pushing Capital Project Coordinator to GitHub..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project directory"
    echo "Please run this script from the capital-project-coordinator directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git not initialized"
    echo "Run: git init"
    exit 1
fi

echo "📋 Step 1: Checking git status..."
git status

echo ""
echo "📋 Step 2: You need to create the repository on GitHub first:"
echo "   1. Go to: https://github.com/rjbhavar"
echo "   2. Click 'New repository'"
echo "   3. Name: capital-project-coordinator"
echo "   4. Description: Enterprise AI Dashboard for MREF Capital Project Management"
echo "   5. Choose Public or Private"
echo "   6. Do NOT initialize with README"
echo "   7. Click 'Create repository'"
echo ""
read -p "Have you created the repository on GitHub? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please create the repository first, then run this script again"
    exit 1
fi

echo ""
echo "📋 Step 3: Adding remote origin..."
git remote add origin https://github.com/rjbhavar/capital-project-coordinator.git 2>/dev/null || echo "Remote already exists"

echo ""
echo "📋 Step 4: Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Repository pushed to GitHub"
    echo ""
    echo "🔗 View your repository at:"
    echo "   https://github.com/rjbhavar/capital-project-coordinator"
    echo ""
    echo "📖 Next steps:"
    echo "   1. Verify all files are on GitHub"
    echo "   2. Read continuation-context/START_HERE.md"
    echo "   3. Connect VPN and test live API"
    echo ""
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "   - Repository doesn't exist on GitHub"
    echo "   - Authentication failed (need to login)"
    echo "   - Network connection issue"
    echo ""
    echo "💡 Try manual push:"
    echo "   git remote add origin https://github.com/rjbhavar/capital-project-coordinator.git"
    echo "   git push -u origin main"
    echo ""
fi

# Made with Bob
