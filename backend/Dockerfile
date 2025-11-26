FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package manifests first to leverage Docker cache
COPY package*.json ./

# Install dependencies (including dev for development container)
RUN npm install

# Copy app sources
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
