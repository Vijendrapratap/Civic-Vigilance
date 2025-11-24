#!/bin/bash
# CI Setup Script for Civic Vigilance

set -e

echo "🚀 Setting up CI/CD for Civic Vigilance..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run type check
echo "🔍 Running type check..."
npm run typecheck

# Run tests
echo "🧪 Running tests..."
npm test -- --coverage --watchAll=false

# Build success
echo "✅ CI setup complete!"
