FROM node:12-alpine
WORKDIR /app
COPY . ./
RUN yarn install
RUN yarn build
CMD ["yarn", "start"]
