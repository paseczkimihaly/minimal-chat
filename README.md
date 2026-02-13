# Opensource Minimal Vibecoded Chat app
Nuxt 3, Typescript, Mongodb, BetterAuth

## Env
NUXT_MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

### VPS
Run as background process with PM2
pm2 start .output/server/index.mjs --name nuxt-app
pm2 startup
pm2 save


