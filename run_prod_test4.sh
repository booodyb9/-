#!/bin/bash
pkill node || true
export PORT=3000
npm run build
node server.js &
SERVER_PID=$!
sleep 5
node test_stack_trace.js
kill $SERVER_PID
