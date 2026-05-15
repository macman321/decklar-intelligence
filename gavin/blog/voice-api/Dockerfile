FROM node:18-alpine

WORKDIR /app

# Copy voice server
COPY voice-server.js .

# Set environment variables (override at runtime)
ENV NODE_ENV=production
ENV PORT=4005
ENV VOICE_API_PORT=4005

EXPOSE 4005

CMD ["node", "voice-server.js"]
