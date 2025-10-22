#!/bin/bash

# Firebase Deployment Script for Civic Vigilance
# This script deploys Firestore rules, Storage rules, and indexes to Firebase

set -e  # Exit on error

echo "🚀 Firebase Deployment Script"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found${NC}"
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo -e "${GREEN}✅ Firebase CLI installed${NC}"
echo ""

# Check if user is logged in
echo "Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Firebase${NC}"
    echo "Please log in to Firebase..."
    firebase login
fi

echo -e "${GREEN}✅ Logged in to Firebase${NC}"
echo ""

# Verify project ID
echo "Current Firebase project: civic-vigilance"
echo ""

# Ask user what to deploy
echo "What would you like to deploy?"
echo ""
echo "  1) Firestore Rules only"
echo "  2) Firestore Indexes only"
echo "  3) Storage Rules only"
echo "  4) All of the above (recommended)"
echo "  5) Cancel"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}📝 Deploying Firestore Rules...${NC}"
        firebase deploy --only firestore:rules --project civic-vigilance
        echo -e "${GREEN}✅ Firestore Rules deployed!${NC}"
        ;;
    2)
        echo ""
        echo -e "${YELLOW}📊 Deploying Firestore Indexes...${NC}"
        firebase deploy --only firestore:indexes --project civic-vigilance
        echo -e "${GREEN}✅ Firestore Indexes deployed!${NC}"
        ;;
    3)
        echo ""
        echo -e "${YELLOW}🗄️  Deploying Storage Rules...${NC}"
        firebase deploy --only storage --project civic-vigilance
        echo -e "${GREEN}✅ Storage Rules deployed!${NC}"
        ;;
    4)
        echo ""
        echo -e "${YELLOW}🚀 Deploying everything...${NC}"
        echo ""
        echo "1/3: Deploying Firestore Rules..."
        firebase deploy --only firestore:rules --project civic-vigilance
        echo ""
        echo "2/3: Deploying Firestore Indexes..."
        firebase deploy --only firestore:indexes --project civic-vigilance
        echo ""
        echo "3/3: Deploying Storage Rules..."
        firebase deploy --only storage --project civic-vigilance
        echo ""
        echo -e "${GREEN}✅ All Firebase configurations deployed!${NC}"
        ;;
    5)
        echo "Deployment cancelled."
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}=============================="
echo "🎉 Deployment Complete!"
echo -e "==============================${NC}"
echo ""
echo "Next steps:"
echo "  1. Go to Firebase Console: https://console.firebase.google.com/project/civic-vigilance"
echo "  2. Enable Email/Password authentication (if not done yet)"
echo "  3. Create Firestore Database (if not done yet)"
echo "  4. Create Storage bucket (if not done yet)"
echo ""
echo "Then restart your app:"
echo "  npm start"
echo ""
