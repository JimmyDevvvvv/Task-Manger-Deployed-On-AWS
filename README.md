Cloud Computing Project - Task Management System on AWS
Project Objectives
Develop a fully functional task management application hosted on AWS.

Implement secure user authentication and resource access control.

Utilize both relational and NoSQL databases for data storage.

Leverage serverless computing for backend logic and API management.

Monitor application performance and handle asynchronous tasks effectively.

Gain practical skills in cloud architecture, security, and cost management.

Project Overview
The project involves designing and implementing a web-based Task Management System using Amazon Web Services (AWS).
The system allows users to sign up, log in, create tasks, update task statuses, attach files to tasks, and receive notifications for task updates.

Key Features:
User Authentication and Management: Secure sign-up, sign-in, and profile management for users using Amazon Cognito.

Task Management: Create, update, delete, and view tasks.

File Attachments: Support for uploading and attaching files to tasks (stored in S3).

Notifications: Asynchronous notifications (e.g., email) for task updates via SQS.

Monitoring and Logging: Real-time tracking of application performance and issues using CloudWatch.

AWS Services Utilized
Amazon Cognito: User authentication and identity management.

IAM (Identity and Access Management): Secure access control for AWS resources.

EC2 (Elastic Compute Cloud): Hosts the web application.

VPCs (Virtual Private Clouds): Secure networking for EC2 instances.

Amazon S3: Storage for task attachments and user-uploaded files.

Amazon DynamoDB: Non-relational database for task metadata.

Amazon RDS: Relational database for user profiles and task relationships.

AWS Lambda: Serverless backend logic for task operations.

API Gateway: RESTful API management for the application.

Amazon CloudWatch: Performance monitoring and logging.

Amazon SQS: Asynchronous task processing (e.g., email notifications).

Project Architecture
User Flow:
User signs up or logs in via Cognito.

User creates a task through the web interface.

Request is routed to API Gateway, triggering a Lambda function.

Lambda function saves task data to DynamoDB and relational details to RDS.

If an attachment is included, it is uploaded to S3.

Upon task updates, SQS queues a notification message for email delivery.

CloudWatch monitors the process, logging metrics and errors.

Data Management:
RDS: Relational data (user profiles, task relationships).

DynamoDB: Non-relational data (task metadata).

S3: Task attachments.

Backend Logic and APIs:
REST APIs via API Gateway for task CRUD operations.

Lambda functions handle API requests and data processing.

Asynchronous Processing:
SQS queues messages for background tasks, such as sending email notifications.

Monitoring and Logging:
CloudWatch tracks application performance, logs errors, and provides actionable insights.

Project Requirements
Functional Application: Deployed AWS-based task management system.

Documentation:

Architecture Diagram

Setup Guide: Step-by-step AWS deployment instructions.

User Manual: Guide for application usage.

Presentation: Detailed report of design decisions, challenges, and key takeaways.

Deadline:
20/05/2025

Contributors
Mohamed Gamal - Project Leader, AWS Architect, Backend Developer

Contact
For questions or concerns, please reach out to jimmyfr6@gmail.com.
