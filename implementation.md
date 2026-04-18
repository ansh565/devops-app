# 🚀 PROJECT: Docker CI/CD Deployment on AWS EC2 using GitHub Actions

---

## 🧠 Step 0: Project Overview

This project demonstrates a fully automated CI/CD pipeline that deploys a Dockerized Node.js application to an AWS EC2 instance using GitHub Actions and Docker Hub.

### 🔄 Architecture Flow

GitHub Repository → GitHub Actions → Docker Hub → EC2 Instance → Running Container

---

## 🪜 Step 1: Create Node.js Application

1. Create a project folder
2. Create a file named `index.js`

```js
const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Hello from Docker App - CI/CD Deployment");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
```



## 🪜 Step 2: Create package.json

Create a `package.json` file to define the Node.js project dependencies.

```json
{
  "name": "devops-app",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {}
}
```



## 🪜 Step 3: Create Dockerfile

Create a Dockerfile to containerize the application.

``` Dockerfile
FROM node:18

WORKDIR /app

COPY package.json .
COPY index.js .

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
```



## 🪜 Step 4: Build Docker Image (Local Testing)

In this step, we build the Docker image from the application source code.

### 🔧 Build Docker Image

```bash
docker build -t devops-app .
```
### ▶️ Run Docker Container

Run the container using the built Docker image:

```bash
docker run -d -p 3000:3000 devops-app
```
### 🌐 Test Application

Open the application in your browser:
```bash
http://localhost:3000
```



## 🪜 Step 5: Push Docker Image to Docker Hub

### Login to Docker Hub:
```
docker login
```
### Tag the image:
```
docker tag devops-app ansh51/devops-app:latest
```
### Push the image:
```
docker push ansh51/devops-app:latest
```



## 🪜 Step 6: Create GitHub Repository
### Go to GitHub
Create a new repository: devops-app

Push your code:
index.js
package.json
Dockerfile
