FROM node:12-alpine

COPY . /app_service
WORKDIR /app_service

EXPOSE 80 9229 9230

#the entire setup, from installing packages in client and backend, and running app
#is encapsulated in production script in npm in root directory
CMD ["npm", "run", "production"]