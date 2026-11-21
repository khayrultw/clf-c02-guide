# CLF-C02 service comparison tables

**Verified November 20, 2026** · [AWS CLF-C02 exam guide](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html), [revision 1.3, published October 29, 2026](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html).

Use the scenario clue to choose the tool that solves the stated problem. Several options can work together; the best choice depends on the job the question asks you to do.

## Security, compliance, and access

### 1. CloudTrail vs. CloudWatch vs. Config

**Review:** [Task 2.2 — Security, governance, and compliance](./02-domain-2-security-compliance.md#task-2-2)

| Service | Main job | Scenario clue |
|---|---|---|
| [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) | Record AWS account activity, including API calls. | Find which identity deleted a bucket and when. |
| [Amazon CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) | Monitor metrics and logs and trigger alarms. | Alert when EC2 CPU stays above a threshold. |
| [AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html) | Record resource configuration history and evaluate it against rules. | Look up how a security group was configured and check whether it met a rule. |

### 2. GuardDuty vs. Inspector vs. Macie

**Review:** [Task 2.2 — Security, governance, and compliance](./02-domain-2-security-compliance.md#task-2-2) · [Task 2.4 — Security components and resources](./02-domain-2-security-compliance.md#task-2-4)

| Service | Main job | Scenario clue |
|---|---|---|
| [Amazon GuardDuty](https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html) | Detect suspicious activity and potential threats. | Flag activity that suggests compromised AWS credentials. |
| [Amazon Inspector](https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html) | Scan supported workloads for software vulnerabilities and, where supported, unintended network exposure. | Find a vulnerable package in an EC2 instance or an Amazon ECR image. |
| [Amazon Macie](https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html) | Discover sensitive data in Amazon S3. | Find objects that contain personal information. |

### 3. KMS vs. ACM vs. Secrets Manager

**Review:** [Task 2.2 — Security, governance, and compliance](./02-domain-2-security-compliance.md#task-2-2)

| Service | What it manages | Scenario clue |
|---|---|---|
| [AWS Key Management Service (AWS KMS)](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html) | Cryptographic keys and access to use them. | Control who can use the key that encrypts stored data. |
| [AWS Certificate Manager (ACM)](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html) | TLS certificates for supported integrations, such as an Application Load Balancer. | Enable HTTPS with a managed certificate. |
| [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) | Secret values, including storage, retrieval, and supported rotation. | Rotate a database password. Secrets Manager can use KMS to encrypt the stored secret. |

### 4. IAM user vs. group vs. role vs. policy

**Review:** [Task 2.3 — Access management](./02-domain-2-security-compliance.md#task-2-3) · AWS docs: [IAM identities](https://docs.aws.amazon.com/IAM/latest/UserGuide/id.html), [IAM policies and permissions](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html).

| IAM concept | What it is | Scenario clue |
|---|---|---|
| User | An identity in one AWS account that can have long-term credentials. | Recognize an account-specific identity with its own credentials. For human access, prefer federation and temporary credentials where possible. |
| Group | A collection of IAM users for assigning common permissions. It is not a sign-in identity. | Grant several IAM users the same read-only permissions. |
| Role | An identity that a trusted principal assumes to obtain temporary credentials. | Let an EC2 application read S3 without embedding access keys. |
| Policy | A document that defines permissions; it is not an identity. | Specify which S3 actions are allowed on particular resources. |

### 5. Security group vs. network ACL

**Review:** [Task 3.5 — Network services](./03-domain-3-cloud-technology-services.md#task-3-5)

| VPC control | Scope and rules | Scenario clue |
|---|---|---|
| [Security group](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) | Applies to associated resources or network interfaces. Stateful, with allow rules only. Return traffic for an allowed flow is automatically permitted. | Allow HTTPS to a specific load balancer. |
| [Network access control list (network ACL)](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html) | Applies to a subnet. Stateless, with ordered allow and deny rules. Inbound and outbound traffic are evaluated separately. | Deny a source IP range at the subnet boundary. |

## Infrastructure and networking

### 6. Region vs. Availability Zone vs. edge location

**Review:** [Task 3.2 — AWS global infrastructure](./03-domain-3-cloud-technology-services.md#task-3-2) · AWS docs: [Regions and Availability Zones](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions-availability-zones.html), [CloudFront and edge locations](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html).

| Term | What it is | Scenario clue |
|---|---|---|
| Region | A separate geographic area with multiple Availability Zones. | Choose where to deploy based on residency requirements, latency, or service availability. |
| Availability Zone (AZ) | One or more discrete data centers in a Region, isolated from other AZs and connected to them by low-latency links. | Put redundant application instances in different AZs within one Region. |
| Edge location | A point of presence close to users, used by services such as CloudFront. | Serve cached static content near viewers without deploying the application in a new Region. |

### 7. Site-to-Site VPN vs. Client VPN vs. Direct Connect

**Review:** [Task 3.5 — Network services](./03-domain-3-cloud-technology-services.md#task-3-5)

| Service | What it connects | Scenario clue |
|---|---|---|
| [AWS Site-to-Site VPN](https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html) | A network to AWS using encrypted IPsec tunnels, commonly over the public internet. | Connect a branch office or data center network to a VPC. |
| [AWS Client VPN](https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/what-is.html) | Individual users to AWS and, with routing, connected networks over an encrypted VPN. | Give remote employees secure access from their laptops. |
| [AWS Direct Connect](https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html) | An on-premises network to AWS over a dedicated network connection rather than the public internet. | Require consistent network connectivity without using the public internet. Do not assume the link encrypts traffic; see [Direct Connect encryption](https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html). |

### 8. CloudFront vs. Global Accelerator vs. Route 53

**Review:** [Task 3.2 — AWS global infrastructure](./03-domain-3-cloud-technology-services.md#task-3-2) · [Task 3.5 — Network services](./03-domain-3-cloud-technology-services.md#task-3-5)

| Service | Main job | Scenario clue |
|---|---|---|
| [Amazon CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) | Deliver content through a CDN, with edge caching where configured. | Cache website images and videos closer to viewers. |
| [AWS Global Accelerator](https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html) | Provide static entry-point IP addresses and route traffic over the AWS global network to healthy regional endpoints. It does not cache content. | Give a TCP or UDP application fixed public IP addresses and route around unhealthy endpoints. |
| [Amazon Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html) | Provide DNS, domain registration, and health checks. DNS routing returns answers; it does not carry application traffic. | Map a domain name to an endpoint or use DNS-based failover. |

### 9. Multiple Availability Zones vs. multiple Regions

**Review:** [Task 3.2 — AWS global infrastructure](./03-domain-3-cloud-technology-services.md#task-3-2) · AWS docs: [AWS fault isolation boundaries](https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/), [AWS Well-Architected: disaster recovery](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/plan-for-disaster-recovery-dr.html).

| Design | Best fit | What not to assume |
|---|---|---|
| Multiple AZs in one Region | High availability when one AZ fails. | The design stays in one Region; it does not by itself protect against a Region-wide outage. |
| Multiple Regions | Recovery from Region-wide disruption, lower latency for far-apart users, or geographic placement requirements. | A second Region does not automatically replicate data or provide failover. Plan both where needed, check residency rules before copying data, and account for added cost and complexity. |

## Compute, data, and integration

### 10. SNS vs. SQS vs. EventBridge

**Review:** [Task 3.8 — Other in-scope service categories](./03-domain-3-cloud-technology-services.md#task-3-8) · AWS guide: [Choosing a messaging service](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html).

| Service | Main job | Scenario clue |
|---|---|---|
| Amazon Simple Notification Service (Amazon SNS) | Publish a message to a topic for delivery to subscribers. | Fan out one notification to multiple destinations. |
| Amazon Simple Queue Service (Amazon SQS) | Buffer messages in a queue until consumers can process them. | Let workers process orders at their own pace during a traffic spike. |
| Amazon EventBridge | Match events against rules and route them to targets. | Send only matching application or AWS service events to a workflow. |

### 11. S3 vs. EBS vs. EFS vs. FSx

**Review:** [Task 3.6 — Storage services](./03-domain-3-cloud-technology-services.md#task-3-6)

| Service | Storage model | Scenario clue |
|---|---|---|
| [Amazon Simple Storage Service (Amazon S3)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) | Object storage in buckets. | Store backups, static assets, or archives as objects. |
| [Amazon Elastic Block Store (Amazon EBS)](https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html) | Persistent block volumes for EC2, attached in the same AZ as the instance. | Give a virtual machine a boot disk or a disk for a self-managed database. |
| [Amazon Elastic File System (Amazon EFS)](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html) | Elastic shared file storage using NFS. | Let several Linux instances mount the same file system. |
| [Amazon FSx](https://aws.amazon.com/fsx/) | A family of managed file systems, including Windows File Server, Lustre, NetApp ONTAP, and OpenZFS. | Choose FSx for Windows File Server for Windows SMB shares, or FSx for Lustre for high-performance file workloads. |

### 12. RDS vs. Aurora vs. DynamoDB vs. ElastiCache

**Review:** [Task 3.4 — Database services](./03-domain-3-cloud-technology-services.md#task-3-4)

| Service | Data model | Scenario clue |
|---|---|---|
| [Amazon Relational Database Service (Amazon RDS)](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html) | Managed relational databases across several engines. | Run a conventional SQL database, such as SQL Server, without handling routine infrastructure maintenance. |
| [Amazon Aurora](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html) | AWS-built relational engine offered through RDS, compatible with MySQL or PostgreSQL. | Need an AWS-designed relational cluster with MySQL or PostgreSQL compatibility. |
| [Amazon DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) | Serverless NoSQL key-value and document database. | Retrieve large volumes of shopping-cart records by key with consistently low latency. |
| [Amazon ElastiCache](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html) | Managed in-memory caching with Valkey, Redis OSS, or Memcached. | Cache frequently read results to reduce load on the main database. |

Aurora is part of the RDS family. A generic request for managed SQL, MySQL, or PostgreSQL alone does not uniquely distinguish the two.

### 13. EC2 vs. Lambda vs. ECS vs. EKS vs. Fargate

**Review:** [Task 3.3 — Compute services](./03-domain-3-cloud-technology-services.md#task-3-3)

| Service | Role | Scenario clue |
|---|---|---|
| [Amazon Elastic Compute Cloud (Amazon EC2)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html) | Virtual servers with guest OS control. | Install custom OS software or run a workload that needs a VM. |
| [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) | Serverless execution of functions. | Run short code when a file arrives in S3. |
| [Amazon Elastic Container Service (Amazon ECS)](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) | AWS-native container orchestration. | Schedule and manage containers without needing Kubernetes. |
| [Amazon Elastic Kubernetes Service (Amazon EKS)](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html) | Managed Kubernetes. | Run containers that rely on Kubernetes tooling and APIs. |
| [AWS Fargate](https://aws.amazon.com/fargate/) | Serverless compute for supported ECS tasks and EKS pods. | Run containers without provisioning or managing the underlying servers. |

ECS and EKS orchestrate containers. Fargate provides compute capacity; it can be used with either orchestrator and is not a replacement for one.

### 14. DMS vs. SCT vs. Application Migration Service

**Review:** [Task 3.4 — Database services](./03-domain-3-cloud-technology-services.md#task-3-4) · [Task 1.3 — Migration strategies](./01-domain-1-cloud-concepts.md#task-1-3)

| Tool | What it moves or changes | Scenario clue |
|---|---|---|
| [AWS Database Migration Service (AWS DMS)](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html) | Moves database data and can replicate ongoing changes for supported migrations. | Keep a target database up to date before cutover. |
| [AWS Schema Conversion Tool (AWS SCT)](https://docs.aws.amazon.com/SchemaConversionTool/latest/userguide/CHAP_Welcome.html) | Converts schemas and compatible database code between engines; some objects may require manual work. | Adapt Oracle stored procedures for PostgreSQL before moving the data. |
| [AWS Application Migration Service (now AWS Transform MGN)](https://docs.aws.amazon.com/mgn/latest/ug/what-is-mgn.html) | Rehosts whole servers by replicating their disks, including the operating system and applications. | Lift and shift an existing application server to Amazon EC2. |

For a cross-engine database migration, separate schema conversion from data movement. AWS also offers [DMS Schema Conversion](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_SchemaConversion.html) for supported conversions; it is not another name for AWS SCT. AWS documents the [Application Migration Service rename](https://aws.amazon.com/about-aws/whats-new/2026/06/aws-transform-mgn-rebrand/).

### 15. Polly vs. Transcribe vs. Translate vs. Textract

**Review:** [Task 3.7 — AI/ML and analytics services](./03-domain-3-cloud-technology-services.md#task-3-7)

| Service | Input → output | Scenario clue |
|---|---|---|
| [Amazon Polly](https://docs.aws.amazon.com/polly/latest/dg/what-is.html) | Text → spoken audio. | Read a written announcement aloud. |
| [Amazon Transcribe](https://docs.aws.amazon.com/transcribe/latest/dg/what-is.html) | Speech audio → text. | Produce a transcript from a recorded call. |
| [Amazon Translate](https://docs.aws.amazon.com/translate/latest/dg/what-is.html) | Text in one language → text in another. | Translate a product description. |
| [Amazon Textract](https://docs.aws.amazon.com/textract/latest/dg/what-is.html) | Document images or scans → extracted text and structured data. | Extract fields and tables from scanned forms. |

## Billing, pricing, and support

### 16. Budgets vs. Cost Explorer vs. Pricing Calculator

**Review:** [Task 4.2 — Billing, budgets, and cost management](./04-domain-4-billing-pricing-support.md#task-4-2)

| Tool | Main job | Scenario clue |
|---|---|---|
| [AWS Budgets](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html) | Set targets and receive alerts on actual or forecasted spend. | Notify the team when forecasted monthly cost will exceed its budget. An alert alone does not cap spending. |
| [AWS Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html) | Analyze recorded cost and usage and view forecasts based on that history. | Group last month's charges by service to find what drove an increase. |
| [AWS Pricing Calculator](https://calculator.aws/) | Estimate the cost of a proposed configuration and usage pattern. | Compare estimated costs of two deployment designs before launch. |

### 17. On-Demand vs. Reserved Instances vs. Spot vs. Savings Plans

**Review:** [Task 4.1 — Pricing models](./04-domain-4-billing-pricing-support.md#task-4-1) · AWS docs: [EC2 purchasing options](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html), [Regional and Zonal Reserved Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/reserved-instances-scope.html), [Savings Plans](https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html).

| Option | Cost and capacity trade-off | Scenario clue |
|---|---|---|
| On-Demand | Pay for usage without a term commitment. It does not by itself reserve EC2 capacity. | Run a short, uncertain workload that cannot tolerate Spot interruption. |
| EC2 Reserved Instances (RIs) | One- or three-year discount for matching usage. Regional RIs give a discount but do not reserve capacity; Zonal RIs also reserve matching capacity in their AZ. | Predictable EC2 usage with attributes that match the reservation. |
| EC2 Spot Instances | Discounted spare EC2 capacity that AWS can interrupt. | Run fault-tolerant batch jobs that can retry or resume. |
| Savings Plans | Discount on eligible usage for a one- or three-year commitment to a consistent spend rate per hour. They do not reserve capacity. | Cover a steady baseline with Compute Savings Plans when eligible usage may shift across EC2, Fargate, and Lambda. |

If the requirement is capacity rather than a discount, distinguish an [On-Demand Capacity Reservation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html): it holds matching capacity in an AZ and does not itself provide a discount.

### 18. Basic Support vs. Business Support+ vs. Enterprise Support vs. Unified Operations

**Review:** [Task 4.3 — Technical resources and Support](./04-domain-4-billing-pricing-support.md#task-4-3) · AWS docs: [Current Support plan comparison](https://aws.amazon.com/premiumsupport/plans/), [AWS Support User Guide](https://docs.aws.amazon.com/awssupport/latest/user/aws-support-plans.html).

| Plan named in task 4.3 | Main capability | Scenario clue |
|---|---|---|
| Basic Support | Included account and billing help, self-service resources, core Trusted Advisor checks, and AWS Health Dashboard. It does not include technical cases with AWS engineers. | Resolve a billing issue or use documentation and community help. |
| AWS Business Support+ | 24/7 access to AWS technical experts for production workloads. | Need round-the-clock production troubleshooting without a designated Technical Account Manager (TAM). |
| AWS Enterprise Support | A designated TAM and proactive guidance for business-critical workloads. | Need an ongoing technical relationship and help planning for resilience or important events. |
| AWS Unified Operations | Designated specialists, proactive workload support, and Incident Management Engineers for mission-critical operations. | Need specialist-led incident response and monitoring for critical workloads. |

**Legacy plans and regional exceptions:** The [AWS transition notice](https://docs.aws.amazon.com/awssupport/latest/user/support-plans-eos.html) schedules Developer Support, Business Support (not Business Support+), and Enterprise On-Ramp to end on January 1, 2027, and says they remain available in AWS GovCloud (US). The [AWS China Support comparison](https://www.amazonaws.cn/en/support/) lists a separate Developer, Business, and Enterprise lineup. Use the task 4.3 names for blueprint study. Avoid unqualified “minimum plan” questions: state the applicable lineup, region, and date if the answer depends on them.

## Official scope and preparation references

- Task statements: [Domain 1](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain1.html), [Domain 2](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain2.html), [Domain 3](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain3.html), and [Domain 4](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain4.html).
- Scope: [Technologies and Concepts](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-technologies-concepts.html), [In-Scope Services](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html), and [Out-of-Scope Services](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-out-of-scope-services.html). The service lists are not exhaustive; task statements guide the depth of study.
- Preparation: [AWS certification page](https://aws.amazon.com/certification/certified-cloud-practitioner/), [Skill Builder Exam Prep Plan](https://skillbuilder.aws/learning-plan/8UUCEZGNX4/exam-prep-plan-aws-certified-cloud-practitioner-clfc02--english/1J2VTQSGU2), and [Official Practice Question Set](https://skillbuilder.aws/learn/E4W52ZKK6P/official-practice-question-set-aws-certified-cloud-practitioner-clfc02--english/RJSZKD3MG3?parentId=1J2VTQSGU2). The supplied Skill Builder pages did not expose gated content. No practice questions were used; for exam format use the public exam guide.
