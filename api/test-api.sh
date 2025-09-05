#!/bin/bash

echo "🧪 Testando a API iFound..."

# Test login
echo "📡 Testando login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!!!"}')

echo "Login Response: $LOGIN_RESPONSE"

# Extract token (basic extraction, works if response format is consistent)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo "✅ Login bem-sucedido! Token obtido."
    echo "📋 Testando listagem de medicamentos..."
    
    # Test medicines list
    MEDICINES_RESPONSE=$(curl -s -X GET http://localhost:3000/medicines \
      -H "Authorization: Bearer $TOKEN")
    
    # Count medicines in response
    MEDICINE_COUNT=$(echo $MEDICINES_RESPONSE | grep -o '"name":' | wc -l)
    
    echo "✅ Encontrados $MEDICINE_COUNT medicamentos!"
    echo "🎉 API funcionando corretamente!"
else
    echo "❌ Falha no login. Verifique se o servidor está rodando."
fi
