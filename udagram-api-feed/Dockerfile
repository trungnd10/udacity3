FROM node:12

ENV AWS_ACCESS_KEY_ID=AKIATGDHN4LTI25Q67CA
ENV AWS_SECRET_ACCESS_KEY=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
ENV AWS_DEFAULT_REGION=udacity_learning_3_ok

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied where available (npm@5+)
COPY package*.json ./
RUN npm i nodemon -g
RUN npm ci 
# Bundle app source
COPY . .
EXPOSE 8080:8080
CMD [ "npm", "start" ]