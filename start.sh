#!/bin/bash

# EduView Start Script
# Dit script start de development server op een betrouwbare manier

cd "$(dirname "$0")"

echo "🔄 Stoppen van eventuele bestaande servers op poort 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null

echo "📦 Controleren van dependencies..."
if [ ! -d "node_modules" ]; then
    echo "⏳ Installeren van dependencies..."
    npm install
fi

echo "🗄️ Controleren van database..."
if [ ! -f "prisma/dev.db" ]; then
    echo "⏳ Aanmaken van database..."
    npx prisma db push
    echo "⏳ Vullen van database met demo data..."
    npx prisma db seed
fi

echo "🚀 Starten van de development server..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  EduView is beschikbaar op:"
echo "  👉 http://localhost:3000"
echo ""
echo "  Demo accounts:"
echo "  📧 admin@eduview.nl / admin123"
echo "  📧 demo@eduview.nl / demo1234"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run dev
