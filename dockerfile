FROM node:16.13.2
# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /src/app
# Installing dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps
# Copying source files
COPY . .
# Building app
RUN npm run build
EXPOSE 80
