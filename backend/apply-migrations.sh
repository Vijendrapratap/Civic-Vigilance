#!/bin/bash

# Supabase Migration Runner Script
# This script helps you apply all migrations to your Supabase database

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Civic Vigilance - Supabase Migration Runner              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}✗ Supabase CLI not found!${NC}"
    echo ""
    echo "Please install it first:"
    echo "  npm install -g supabase"
    echo ""
    echo "Or run migrations manually:"
    echo "  1. Go to your Supabase dashboard"
    echo "  2. Open SQL Editor"
    echo "  3. Run each migration file in order"
    exit 1
fi

echo -e "${GREEN}✓ Supabase CLI found${NC}"
echo ""

# Check if project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo -e "${YELLOW}⚠ Project not linked to Supabase${NC}"
    echo ""
    echo "Please link your project first:"
    echo "  supabase link --project-ref YOUR_PROJECT_REF"
    echo ""
    echo "You can find your project ref in Supabase Dashboard → Settings → General"
    exit 1
fi

echo -e "${GREEN}✓ Project linked${NC}"
echo ""

# List available migrations
echo -e "${BLUE}Available migrations:${NC}"
echo ""
ls -1 supabase/migrations/*.sql 2>/dev/null || {
    echo -e "${RED}✗ No migration files found in supabase/migrations/${NC}"
    exit 1
}
echo ""

# Ask user which migrations to run
echo -e "${YELLOW}Which migrations do you want to apply?${NC}"
echo "  1) Only new migrations (004, 005, 006)"
echo "  2) All migrations (001, 002, 003, 004, 005, 006)"
echo "  3) Specific migration"
echo "  4) Exit"
echo ""
read -p "Enter your choice [1-4]: " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}Applying new migrations...${NC}"
        echo ""

        migrations=(
            "supabase/migrations/004_add_profiles_table.sql"
            "supabase/migrations/005_update_rls_for_profiles.sql"
            "supabase/migrations/006_optimize_schema.sql"
        )
        ;;
    2)
        echo ""
        echo -e "${BLUE}Applying all migrations...${NC}"
        echo ""

        migrations=(
            "supabase/migrations/001_initial_schema.sql"
            "supabase/migrations/002_row_level_security.sql"
            "supabase/migrations/003_seed_authorities.sql"
            "supabase/migrations/004_add_profiles_table.sql"
            "supabase/migrations/005_update_rls_for_profiles.sql"
            "supabase/migrations/006_optimize_schema.sql"
        )
        ;;
    3)
        echo ""
        echo -e "${BLUE}Available migration files:${NC}"
        select migration in supabase/migrations/*.sql; do
            if [ -n "$migration" ]; then
                migrations=("$migration")
                break
            fi
        done
        ;;
    4)
        echo ""
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo -e "${RED}✗ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${YELLOW}⚠  WARNING: This will modify your database!${NC}"
echo -e "${YELLOW}   Make sure you have a backup before proceeding.${NC}"
echo ""
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo ""
    echo "Cancelled. No changes were made."
    exit 0
fi

echo ""
echo -e "${BLUE}Applying migrations...${NC}"
echo ""

# Apply each migration
for migration in "${migrations[@]}"; do
    if [ -f "$migration" ]; then
        filename=$(basename "$migration")
        echo -e "${BLUE}Applying: $filename${NC}"

        if supabase db push --include "$migration"; then
            echo -e "${GREEN}✓ Successfully applied $filename${NC}"
        else
            echo -e "${RED}✗ Failed to apply $filename${NC}"
            echo -e "${YELLOW}  You can apply it manually in Supabase SQL Editor${NC}"
        fi
        echo ""
    else
        echo -e "${YELLOW}⚠ Migration file not found: $migration${NC}"
        echo ""
    fi
done

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Migrations completed!                                     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo "Next steps:"
echo "  1. Run tests: node test-backend-simple.js"
echo "  2. Check your Supabase dashboard"
echo "  3. Test your app: npm start"
echo ""
