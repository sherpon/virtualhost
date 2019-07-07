FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# before, I got the below error:
# Error: Could not locate the bindings file. Tried:
# → C:\Users\Admin_Ajay\edi_blockchain\node_modules\ursa\build\ursaNative.node
# ...
# the below piece of code is from here: https://github.com/nodejs/docker-node/issues/384#issuecomment-305208112
# So, first I put 'npm install --save ursa', and then this code
## RUN apk --no-cache add --virtual native-deps \
##  g++ gcc libgcc libstdc++ linux-headers make python && \
##  npm install --quiet node-gyp -g &&\
##  npm install --quiet && \
##  apk del native-deps
# End of code

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 80 443 7000

CMD [ "npm", "start" ]