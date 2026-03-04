FROM node:23-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm cache clean --force
RUN npm config set strict-ssl false
RUN npm install

COPY . .

EXPOSE 3000
# El comando por defecto, pero el compose lo sobreescribe con 'npm run dev'
CMD ["node", "index.js"]