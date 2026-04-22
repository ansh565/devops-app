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



## 🪜 Step 7: Create GitHub Actions Workflow

Create the following file in your repository:
```
.github/workflows/deploy.yml
```



## 🪜 Step 8: Add CI Pipeline (GitHub Actions)
``` yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v2

      - name: Login to Docker Hub
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

      - name: Build Docker Image
        run: docker build -t ansh51/devops-app:latest .

      - name: Push Docker Image
        run: docker push ansh51/devops-app:latest


  deploy:
    needs: build
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ec2-user
          key: ${{ secrets.EC2_KEY }}
          script: |
            docker pull ansh51/devops-app:latest
            docker stop app || true
            docker rm app || true
            docker run -d -p 3000:3000 --name app ansh51/devops-app:latest
```



## 🪜 Step 9: Add GitHub Secrets

Go to:

GitHub Repository → Settings → Secrets and Variables → Actions

Add:
```
DOCKER_USERNAME = ansh51
DOCKER_PASSWORD = <your docker token>
EC2_HOST = <your-ec2-public-ip>
EC2_KEY = <paste full content of EC2 key pair (.pem file)>
```



## 🪜 Step 10: Create AWS CloudFormation Template

In this step, we define infrastructure as code using AWS CloudFormation to automatically create:

- EC2 Instance
- Security Group
- Docker installation setup

---

### 📄 CloudFormation Template

```yaml
Resources:

  MySecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Allow SSH and HTTP access for Docker app
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0

        - IpProtocol: tcp
          FromPort: 3000
          ToPort: 3000
          CidrIp: 0.0.0.0/0

  MyEC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: t3.micro
      ImageId: ami-0c02fb55956c7d316   # Amazon Linux 2 (us-east-1)
      KeyName: key6

      SecurityGroups:
        - !Ref MySecurityGroup

      UserData:
        Fn::Base64: |
          #!/bin/bash
          yum update -y
          yum install -y docker
          systemctl start docker
          systemctl enable docker

          docker run -d -p 3000:3000 ansh51/devops-app:latest
```
Outputs:
  InstancePublicIP:
  
    Description: Public IP of EC2 instance
    
    Value: !GetAtt MyEC2Instance.PublicIp



## 🪜 Step 11: Deploy CloudFormation Stack

### Navigate to CloudFormation

1. Go to the [AWS CloudFormation Console](https://console.aws.amazon.com/cloudformation)
2. Click on **Create Stack**
3. Select **With new resources (standard)**

---

### Upload Template

1. Choose **Upload a template file**
2. Click **Choose file**
3. Upload your YAML template file
4. Click **Next**

---

### ⚙️ Configure Stack

Provide the following details:

- **Stack Name**: `devops-stack`
- **Key Pair**: Select your EC2 key pair (used during instance creation)

Click **Next**

---

### Review and Create

1. Review all configurations
2. Click **Create Stack**

---

### ⏳ Wait for Deployment

- Monitor the stack status
- Wait until it shows **CREATE_COMPLETE**

✔ This indicates your infrastructure is successfully deployed



## 🪜 Step 12: Verify Stack Creation

After a few minutes:

- Stack status should be **CREATE_COMPLETE**
- EC2 instance will be automatically provisioned
- Security Group will be automatically attached

---

## 🪜 Step 13: Get Public IP of EC2 Instance

1. Go to **CloudFormation → Stacks**
2. Select your stack (`devops-stack`)
3. Open the **Outputs** tab
4. Copy the value of:
   - **InstancePublicIP**

---

## 🪜 Step 14: Access Application

Open your browser and enter:

`http://<Public-IP>:3000`

✔ If deployment is successful, your application will be accessible



## 🪜 Step 15: Test CI/CD by Making a Code Change

To verify that the CI/CD pipeline is working correctly, modify the application and observe automatic deployment.

### ✏️ Modify Application Code

1. Open `index.js` in your repository

**Before:**
```javascript
res.end("Hello from Docker App");
```
**After:**
```javascript
res.end("Hello from Docker App - CI/CD Test");
```
### 📤 Commit Changes via GitHub

- Click **Edit (✏️)** on the file  
- Make the changes  
- Click **Commit changes**

---

### 🌐 Verify Output

Open in browser:
```
http://<InstancePublicIP>:3000
```

---

### ✔ Updated message should be visible

### 🎉 Confirms CI/CD pipeline is working correctly
