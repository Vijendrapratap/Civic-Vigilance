#!/bin/bash
# Deployment script for Civic Vigilance

set -e

# Check if environment is specified
if [ -z "$1" ]; then
  echo "Usage: ./deploy.sh [development|preview|production]"
  exit 1
fi

ENVIRONMENT=$1

echo "🚀 Deploying to $ENVIRONMENT environment..."

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
  export $(cat .env.$ENVIRONMENT | grep -v '^#' | xargs)
fi

# Run tests
echo "🧪 Running tests..."
npm test -- --watchAll=false

# Type check
echo "🔍 Type checking..."
npm run typecheck

# Deploy EAS Update
echo "📤 Publishing EAS update..."
eas update --branch $ENVIRONMENT --message "Deploy from script"

# Build if production
if [ "$ENVIRONMENT" = "production" ]; then
  echo "🏗️ Building production apps..."
  read -p "Build Android? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    eas build --platform android --profile production
  fi

  read -p "Build iOS? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    eas build --platform ios --profile production
  fi
fi

echo "✅ Deployment complete!"
