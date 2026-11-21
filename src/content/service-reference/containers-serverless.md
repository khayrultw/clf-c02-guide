# Containers and serverless

Optional revision reference. CLF-C02 exam guide [revision **1.3 (October 29, 2026)**](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html); verified **November 20, 2026**. Primary lesson: [3.3 — Compute](../study-material/03-domain-3-cloud-technology-services.md#task-3-3).

## Amazon Elastic Container Registry (Amazon ECR)

[Stores and distributes container images](https://aws.amazon.com/ecr/). Choose when a build needs to publish a versioned image; use ECS or EKS to deploy it. Control access to private images and account for storage charges.

## Amazon Elastic Container Service (Amazon ECS)

[AWS-native container orchestration](https://aws.amazon.com/ecs/) for tasks and services. Choose over EKS when Kubernetes APIs are not required. Manage your images and workload configuration; EC2 capacity and AWS Fargate are different choices for execution.

## Amazon Elastic Kubernetes Service (Amazon EKS)

[Managed Kubernetes](https://aws.amazon.com/eks/) for workloads using Kubernetes APIs and tools. AWS manages the control plane; responsibility for workloads and compute management depends on your configuration. It is not an image registry.

## AWS Fargate

[Serverless compute for ECS and supported EKS workloads](https://aws.amazon.com/fargate/). Choose to run containers without managing worker servers; it does not replace the orchestrator. Container resource allocation and runtime affect cost.

## AWS Lambda

[Serverless functions](https://aws.amazon.com/lambda/) for brief, event-driven work, such as resizing uploaded images. You manage code and permissions, not servers. Requests and execution duration affect charges; choose container or VM compute for continuously running workers that exceed function limits.
