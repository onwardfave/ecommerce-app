# Backend Engineering Challenge - E-Commerce Microservices Application

## Introduction

This document provides instructions and insights into the microservices-based e-commerce application designed to manage user authentication, product management, and order processing. The architecture emphasizes concurrency control and high availability through clustering.

## System Overview

The system follows a microservices architecture pattern, with distinct services for user authentication, product management, and order processing. These services are containerized using Docker and orchestrated with Kubernetes for high availability. The application is designed to scale horizontally, ensuring reliability and fault tolerance.

## Running the Code

### Setting up the deployment:

Make a copy of
deployment\ecommerce-secret copy.yml

And save it as deployment\ecommerce-secret.yml, and change the variables therein accordingly. Make sure the values are base 64 encoded.

To run the app, you need docker installed. You can install and configure docker for development from the official docker site: https://docs.docker.com/engine/install/

Once docker is installed, you also need to install kubernetes and configure a local cluster, let's name it docker-desktop

Under settings in docker desktop app, select kubernetes and then select "Enable Kubernetes." Follow the prompts to set up kubernetes for docker.

To ensure that you have a local kubernetes context installed, run this docker command and you should see the local context listed (probably among others that you may have configured prior)

`kubectl config current-context`

![Alt text](./images/currentcontextkube.PNG)

To set up the kubernetes database config map to create the relevant databases (ecommerceDB, ordersDB, productsDB, and authDB), run this command:

`kubectl create configmap mysql-init-db --from-file=sql-scripts\init-db.sql`

Once that is done, open the deployments folder, and set up the environment variables such as MYSQL_ROOT_PASSWORD under the deployment/ecommerce-secret.yml file you created earlier.

[Config File](deployment/ecommerce-config.yml)

These variables are named in a way that is easy to understand, but they essentially include database names.

Again, set up the environment variables in the github repository for the github CI/CD pipeline.

Once that is done, you can run the kubernetes cluster on the docker-desktop context by running the containers using the following commands:

`kubectl apply -f ./deployment`

![Deployment Image](images/kubectldeploy.PNG)

This will execute the kubernetes deployment and services files.

After a few seconds, all the pods and services should be running and you can check if all services and pods are running thus:

`kubectl get svc -o wide`

The output of the same should look like this:

![Services Image](images/services.PNG)

Check that all pods are up and running:
`kubectl get pods -o wide`

You should be able to see an output similar to this:
![Pods Image](./images/deployments.PNG)

Please notice that in the respective deployments yaml files for the auth, order, and product services, we specified 2 replicas per service, and that each has two replicas running.

Now, if any of the replicas is stopped for any reason, the system still functions as the kubernetes engine creates a new one to meet the specified threshhold.

## Requirements Implemented

### Microservices Architecture

The application is broken down into three main microservices:
Auth Service: Manages user registration and authentication.
Product Service: Handles CRUD operations for products.
Order Service: Processes orders and maintains order history.
Each service is built using Node.js and Express for ease of development and deployment.

### Concurrency Control

Optimistic locking is implemented in the Product Service to manage concurrent updates to product information safely. Each product entry, for instance, maintains a version number that gets updated every time a change is made, to prevent multiple users from modifying the same product at the same time.

### Clustering and High Availability

Kubernetes is used for clustering the microservices, ensuring the application remains available even if a node goes down.
The application is configured to deploy on multiple nodes using Kubernetes' deployment and service definitions.

### Load Balancing

The Nginx load balancer plays a crucial role in the microservices architecture of the e-commerce application. It sits in front of the user authentication, product management, and order processing services as a reverse proxy, directing incoming HTTP requests to the appropriate service based on the request path. Here's how it integrates with the system:

### Database Integration

MySQL database is used for persistent storage.
Each service connects to the database via Sequelize ORM, with a well-defined schema for users, products, and orders.

### APIs and Communication

RESTful APIs are developed for each microservice, facilitating inter-service communication.
Synchronous HTTP calls are used for direct service-to-service communication.
Each of the microservices maintains its own database for loose coupling, and synchronous calls are made between the microservices to retrieve the relevant data.

### Authentication and Authorization

JWT-based authentication is implemented to secure endpoints.
Authorization logic ensures users can only access their data.

## General Requirements Met

### Code Quality

The codebase is clean, consistently formatted, and well-documented.
Expressive variable names and clear function definitions are used throughout the application.

### Version Control

Git is utilized for version control, with a structured commit history that reflects the development process.

### Error Handling

Comprehensive error handling is in place, with consistent error responses and logging for debugging.

The auth microservice, as a demonstration of this feature uses a standard error format for catching errors downstream. The wiston logger is used for this purpose:

This configuration is under

auth-service\src\utils\logger.ts

### Testing

Unit tests are written for key components, particularly around concurrency control mechanisms.
Jest test suites are configured under each microservice, and can be run using the command
`npm run test`
under each microservice folder.

### Deployment

Docker Compose is used for local development and testing.

To run all docker containers to test in development mode, you can run:

`docker-compose --env-file .env.dev up --build`

Kubernetes manifests are provided for deployment on clusters.

### Bonus Features

API rate limiting was considered but not implemented within the scope of this project.

### Repository and Deployment Instructions

The project is hosted on GitHub at [GitHub Repository Link]. To set up and run the microservices:

Ensure Docker and Kubernetes (Docker Desktop's Kubernetes or Minikube) are installed and running.
Clone the repository using git clone [Repository URL].
Navigate to each service directory and build Docker images with docker build -t [service-name]:[tag] ..
Apply Kubernetes manifests using kubectl apply -f [manifest-file].yml for each service.
The services will be accessible on the configured ports after the pods are running.

## Assessment and Assumptions

The application meets the core objectives laid out in the assignment. Due to time constraints, some advanced features like caching and message queues are not implemented. These are recommended areas for future development.

The primary assumption is that the Kubernetes cluster is already configured and accessible. For local development, the system uses port forwarding to expose services.

## Conclusion

The e-commerce microservices application demonstrates the use of modern backend technologies to create a scalable, fault-tolerant system. With the foundation laid out, the system can be expanded with additional features and integrations.
