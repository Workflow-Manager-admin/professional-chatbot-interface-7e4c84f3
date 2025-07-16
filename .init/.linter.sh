#!/bin/bash
cd /home/kavia/workspace/code-generation/professional-chatbot-interface-7e4c84f3/web_chatbot_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

