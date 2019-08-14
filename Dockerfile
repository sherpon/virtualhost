FROM sherpon/pre-greenlock

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# https://docs.npmjs.com/cli/ci.html
# RUN npm install
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 80 443 7000

CMD [ "npm", "run", "https" ]