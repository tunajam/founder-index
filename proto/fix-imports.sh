#!/bin/bash
# Fix .js imports in generated TS files (buf generates .js but we have .ts)
find ../frontend/src/gen -name "*.ts" -exec sed -i '' 's/\.js"/"/g' {} +
