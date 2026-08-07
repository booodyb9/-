#!/bin/bash
pkill node || true
export PORT=3000
node server.js &
SERVER_PID=$!
sleep 5
curl -s http://localhost:3000/ > page_content.html
node test_stack_trace.js
kill $SERVER_PID
