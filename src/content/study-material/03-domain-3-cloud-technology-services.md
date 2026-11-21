# Domain 3 — Cloud Technology and Services

**34% of scored exam content.** Scope: CLF-C02 exam guide revision **1.3 (October 29, 2026)**; verified **November 20, 2026**. See the official [Domain 3 objectives](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain3.html), [in-scope services](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html), [technologies and concepts](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-technologies-concepts.html), and [revision history](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html). Guide names appear even when AWS now markets a product under a different name.

Start with the job the scenario needs done: place a workload, run code, store data, connect systems, analyze information, or deliver an application. Then look for the constraint that rules out similar services: persistence, network path, data model, operational responsibility, or access frequency.

## 3.1 — Define methods of deploying and operating in the AWS Cloud

### Access and provisioning methods

| Method | Choose it when… | Example or boundary |
| --- | --- | --- |
| AWS Management Console | You want an interactive browser interface to inspect or change a resource. | A learner checks the state of an instance once. Repeating manual changes across environments invites inconsistencies. |
| AWS CLI | An administrator needs terminal access or a short repeatable script. | A scheduled script inventories resources. The CLI calls service APIs and requires the caller to have permission; a script is not automatically infrastructure as code. |
| AWS SDKs | Application code needs AWS access through a language-specific library. | A Python application writes an object to S3. The SDK wraps API calls; it does not grant access. |
| APIs | A system needs a direct programmatic service interface. | An integration invokes a documented AWS operation. The console, CLI, and SDK are different ways to interact with AWS APIs; they do not change the authorization requirement. |
| AWS CloudFormation (infrastructure as code, or IaC) | You need consistent, repeatable environments with changes represented as code. | A versioned template describes a network and application resources as a stack for test and production. Review and maintain the template; provisioned resources can incur charges. |

Choose by frequency **and** consistency needs. A one-time status check is often easiest in the console, while an important one-time deployment can still merit IaC for review and recovery. Use an SDK for AWS calls inside an app; use the CLI for operator automation; use IaC to describe the desired infrastructure.

### Deployment models

| Model | Meaning | Example |
| --- | --- | --- |
| Cloud | The workload runs in cloud infrastructure. | A web app and its database both run on AWS. |
| On-premises | The workload runs in the organization's facilities, with the organization responsible for the local infrastructure it owns. | A factory runs its inventory system in its own data center. |
| Hybrid | Cloud and on-premises systems are connected and work together. | A local plant system sends data to AWS analytics. AWS Outposts can extend supported AWS infrastructure and services to a local site; hybrid does not require Outposts. |

Official sources: [Accessing AWS](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html), [AWS SDKs and tools](https://aws.amazon.com/developer/tools/), [AWS CloudFormation](https://aws.amazon.com/cloudformation/), [deployment models](https://aws.amazon.com/types-of-cloud-computing/).

## 3.2 — Define the AWS global infrastructure

| Component | Relationship and purpose |
| --- | --- |
| AWS Region | A separate geographic area that contains multiple Availability Zones (AZs). Choose Regions for service availability, user latency, compliance and data sovereignty, and cost. |
| Availability Zone | One or more discrete data centers within a Region. AZs have independent power, cooling, and physical security and are linked by low-latency, high-bandwidth networking. AWS designs AZs so that they do not share a single point of failure; an application can still create its own shared dependency. |
| Edge location | A point of presence near users. Amazon CloudFront can serve cached content there, reducing latency and origin load. An edge location is not an AZ or a place to launch ordinary EC2 instances. |
| Local Zone | An extension of a parent Region placed in a large metropolitan area, so supported services such as EC2 can run closer to local users for single-digit-millisecond latency (for example, media rendering or real-time gaming). A Local Zone is AWS-operated, not equipment at the customer's site; compare AWS Outposts in 3.3. |

- **High availability within one Region:** Put redundant application instances in at least two AZs, distribute requests across healthy instances, and avoid a single-AZ dependency in the data tier. If one AZ fails, the other can keep serving if it has capacity and access to the required data. High availability is a design outcome, not a property of just placing one server in a Region.
- **Multiple Regions:** Use another Region for regional disaster recovery and business continuity; serve distant groups from nearby Regions for latency; or separate data by jurisdiction for residency or sovereignty requirements. Check what data can legally cross borders, including replicas and backups. Replication and failover are not automatic for every service, and extra copies, traffic, and operations add cost.
- **Example:** A shop runs its checkout in two AZs, plans recovery in an approved second Region, and uses edge caches for product photos. These choices address AZ failure, regional failure, and delivery latency respectively.

Official sources: [AWS Global Infrastructure](https://aws.amazon.com/about-aws/global-infrastructure/), [Regions and AZs](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/), [AWS Local Zones](https://aws.amazon.com/about-aws/global-infrastructure/localzones/), [Amazon CloudFront](https://aws.amazon.com/cloudfront/).

## 3.3 — Identify AWS compute services

### Compute

| Service or feature | Recognition cue and boundary |
| --- | --- |
| Amazon EC2 | Virtual machines with guest OS and software control. AWS manages the physical host; the customer manages the guest OS, patches, applications, and configuration. |
| AWS Batch | Queues, schedules, and runs batch jobs, such as thousands of nightly image conversions. It runs jobs on underlying compute; it is not a front-end load balancer. |
| AWS Elastic Beanstalk | Deploy a web app on managed infrastructure without assembling every resource yourself. AWS handles environment provisioning and orchestration; you still own the application and pay for underlying resources. |
| Amazon Lightsail | Simplified, bundled virtual servers and related resources for projects like a small website. Choose EC2 for finer infrastructure control. |
| AWS Outposts | AWS-managed hardware that extends supported AWS services to a customer site, for example when processing must stay near factory equipment. It is not a standalone AWS Region and requires a connection to its parent Region for normal operation. |
| AWS Auto Scaling / Amazon EC2 Auto Scaling | Scaling adjusts resource capacity as demand changes, providing elasticity. An EC2 Auto Scaling group adds or removes instances using policies and can replace unhealthy instances. The guide's AWS Auto Scaling name also refers to scaling plans for supported resources; it is not a load balancer. |
| Elastic Load Balancing (ELB) | Distributes incoming traffic to healthy registered targets. An Application Load Balancer routes HTTP(S); a Network Load Balancer handles transport-layer traffic. Routing spreads work; scaling changes available capacity. |

**Pick the EC2 family for the bottleneck.** Families describe hardware, not purchasing options. On-Demand, Reserved Instances, and Spot are pricing or capacity choices, not equivalents of these families.

| Family | Example |
| --- | --- |
| General purpose | Balanced CPU and memory for ordinary web servers. |
| Compute optimized | Extra CPU performance for encoding, modeling, or CPU-heavy batch jobs. |
| Memory optimized | Large memory needs, such as a large in-memory database. |
| Storage optimized | High-throughput or high-IOPS access to local storage, such as temporary data processing with heavy reads/writes. Check persistence requirements before using local disks. |
| Accelerated computing | GPU or other hardware acceleration for ML training or graphics rendering. |

### Containers and serverless

| Service | Recognition cue and boundary |
| --- | --- |
| Amazon Elastic Container Registry (Amazon ECR) | Stores and distributes container images; it does not run them. |
| Amazon Elastic Container Service (Amazon ECS) | AWS-native container orchestration for deploying and maintaining tasks; choose when Kubernetes is not required. |
| Amazon Elastic Kubernetes Service (Amazon EKS) | Managed Kubernetes; choose when the workload needs Kubernetes APIs or tooling. Cluster workload configuration remains your responsibility. |
| AWS Fargate | Serverless compute capacity for supported ECS tasks or EKS pods. You provide the container and resource requirements, not the worker servers. Container runtime resources are billed; serverless does not mean free. |
| AWS Lambda | Runs short-lived code on an event, such as resizing an uploaded photo. AWS manages servers; you manage code and permissions. Duration limits make it a poor fit for a continuously running process. |

**Example:** A store uses EC2 Auto Scaling and ELB to absorb a traffic spike. Its containerized order API can use images from ECR, ECS for orchestration, and Fargate for execution. A small thumbnail task can use Lambda instead of maintaining a permanent worker.

Official sources: [EC2 instance types](https://aws.amazon.com/ec2/instance-types/), [AWS compute](https://aws.amazon.com/products/compute/), [EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html), [Elastic Load Balancing](https://aws.amazon.com/elasticloadbalancing/), [AWS containers](https://aws.amazon.com/containers/), [AWS serverless](https://aws.amazon.com/serverless/).

## 3.4 — Identify AWS database services

### Database choices

**Self-managed on EC2** gives OS-level access and control over versions, extensions, and maintenance schedules. The customer owns backups, patching, replication, and failover. **Managed databases** reduce that work: for example, RDS manages routine infrastructure tasks, supports backups, and offers availability options. Customers still own their data, database users and access, schema, and configuration choices. Choose on requirements, not on a blanket assumption about cost: compare managed service charges against equivalent infrastructure and operating effort.

| Service | Choose it for… | Example or contrast |
| --- | --- | --- |
| Amazon RDS | Managed relational databases using SQL and established engines. | Transactional order tables on managed PostgreSQL instead of installing the engine on EC2. |
| Amazon Aurora | AWS-built managed relational engine compatible with MySQL or PostgreSQL, offered through Amazon RDS. | Keep PostgreSQL compatibility while adopting Aurora's distributed storage architecture; Aurora is not NoSQL. |
| Amazon DynamoDB | Serverless NoSQL key-value and document access at scale. | Retrieve a shopping cart by customer ID, rather than join many relational tables. |
| Amazon ElastiCache | In-memory cache/data store (Valkey, Redis OSS, or Memcached options). | Cache popular product data to reduce database load; a cache is not automatically the durable system of record. |
| Amazon Neptune | Managed graph database for traversing connected data. | Follow several hops in a fraud-ring graph. |
| Amazon DocumentDB | Managed document database with MongoDB compatibility. | Store flexible JSON-like catalog documents using compatible APIs; verify compatibility for features your application needs. |

### Migration and transfer

| Guide service | What it does | Boundary or current name |
| --- | --- | --- |
| AWS Database Migration Service (AWS DMS) | Transfers database data between supported endpoints; can replicate ongoing changes to reduce downtime. | Moves data. A different engine can also require schema and code conversion before cutover. |
| AWS Schema Conversion Tool (AWS SCT) | Assesses and converts supported schema objects and database code for engine changes. | Review items that cannot be converted automatically. DMS Schema Conversion is a separate managed feature for supported conversions; neither is a general server rehost tool. |
| AWS Application Discovery Service | Collects on-premises server inventory, utilization, and dependency data for planning. | Closed to new customers from **November 7, 2025**; existing customers can continue ongoing projects. AWS recommends AWS Transform for new projects. |
| AWS Application Migration Service (AWS Transform MGN) | Replicates and rehosts physical or virtual servers on AWS, with minimal application changes. | Same service renamed **AWS Transform MGN**; distinct from the broader AWS Transform migration experience and from database-engine conversion. |
| Migration Evaluator | Uses server inventory and utilization to estimate AWS capacity and costs for a migration business case. | Estimates cost and sizing; does not copy the workloads. |
| AWS Migration Hub | Centralized visibility into migration progress across tools. | Closed to new customers from **November 7, 2025**; existing customers can finish ongoing projects. AWS recommends AWS Transform for comparable capabilities. |

**Example:** An organization discovers which servers depend on one another and estimates the likely AWS costs before scheduling migration waves. It can rehost a legacy server with AWS Transform MGN, but for an Oracle-to-PostgreSQL project it assesses schema conversion separately from data replication with AWS DMS. Low downtime is not a guarantee of zero downtime.

Official sources: [AWS databases](https://aws.amazon.com/products/databases/), [AWS DMS and schema conversion](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html), [AWS SCT](https://docs.aws.amazon.com/SchemaConversionTool/latest/userguide/CHAP_Welcome.html), [Discovery availability](https://docs.aws.amazon.com/application-discovery/latest/userguide/application-discovery-service-availability-change.html), [MGN rename](https://aws.amazon.com/about-aws/whats-new/2026/06/aws-transform-mgn-rebrand/), [Migration Evaluator](https://aws.amazon.com/migration-evaluator/), [Migration Hub availability](https://docs.aws.amazon.com/migrationhub/latest/ug/migrationhub-availability-change.html).

## 3.5 — Identify AWS network services

### Inside Amazon VPC

| Component | Purpose and boundary |
| --- | --- |
| Amazon VPC | A logically isolated virtual network scoped to one Region; it can span that Region's AZs. |
| Subnet and route table | A subnet divides the VPC address range and belongs to one AZ. Its route table determines where traffic goes. A public subnet has a route to an internet gateway; a private subnet has no direct route to that gateway. |
| Internet gateway | Connects a VPC to the internet. Direct IPv4 connectivity also requires a public address and security rules that allow the traffic; a public subnet alone does not make an instance reachable. |
| NAT gateway | A public NAT gateway lets private-subnet resources initiate IPv4 connections to the internet without allowing unsolicited inbound connections. It is not a substitute for security rules and has usage charges. |
| Security group | Stateful allow rules at supported resources or network interfaces. Return traffic for allowed connections is automatically allowed. |
| Network access control list (network ACL) | Stateless subnet-level rules can allow or deny; inbound and outbound traffic, including replies, are evaluated separately. |
| Amazon Inspector | Assesses supported workloads for software vulnerabilities and unintended network exposure where supported. It reports findings; it does not enforce VPC traffic rules. |

### Connectivity, networking, and content delivery

| Service | Recognition cue and boundary |
| --- | --- |
| AWS VPN | Umbrella for managed encrypted connectivity. Choose the VPN type by whether you connect a network or individual users. |
| AWS Site-to-Site VPN | Links an office or data-center network to AWS with IPsec tunnels, commonly over the internet. |
| AWS Client VPN | Connects individual remote users to AWS or connected networks through a managed client-based VPN. |
| AWS Direct Connect | Dedicated private connectivity for more predictable network performance. A private path is not by itself encryption; plan for lead time and redundancy. |
| AWS Transit Gateway | Regional hub for connecting many VPCs and on-premises networks. It centralizes routing, rather than giving end users a VPN client or exposing a single service. |
| AWS PrivateLink | Privately exposes a supported service to consumers through a VPC endpoint without requiring internet access or broad connectivity between the networks. |
| Amazon Route 53 | Managed DNS and domain registration, with routing policies and health checks. Resolves names to endpoints; it does not cache content or proxy every request. |
| Amazon CloudFront | Content delivery network (CDN) that serves content through edge locations and caches eligible content. Useful for websites, downloads, and video. |
| AWS Global Accelerator | Provides static anycast IP addresses and routes TCP/UDP traffic over the AWS network to healthy regional endpoints. Improves connectivity for applications; it is not a cache. |
| Amazon API Gateway | Publishes and manages API endpoints in front of backends such as Lambda. Think API access control, throttling, and request handling, not DNS or private network links. |

**Example:** A chain uses Site-to-Site VPN for store networks and Client VPN for roaming staff. Route 53 resolves the website name, CloudFront caches product images, and API Gateway exposes the order API. A Global Accelerator scenario instead emphasizes fixed IP addresses or faster network paths for traffic that is not cached.

Official sources: [Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html), [VPC security](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html), [Amazon Inspector](https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html), [AWS networking and content delivery](https://aws.amazon.com/products/networking/), [AWS VPN](https://aws.amazon.com/vpn/).

## 3.6 — Identify AWS storage services

### Choose the storage interface or recovery service

| Service or option | Type and cue | Example or boundary |
| --- | --- | --- |
| Amazon S3 | Object storage: objects are addressed by key in a bucket. | Store backups, logs, static assets, or data-lake files; not a normal attached disk or shared mounted file system. |
| Amazon S3 Glacier | S3 archival storage classes, not a mounted file system. | Retain old audit records; match retrieval time to requirements. |
| Amazon Elastic Block Store (Amazon EBS) | Persistent block volumes for EC2 within an AZ. | Use as a boot or database disk; data can outlive an instance depending on deletion settings. An EBS snapshot is a separate backup copy. |
| EC2 instance store | Temporary local block storage on supported hosts. | Use for scratch data or caches. You can lose data when an instance stops or terminates, or the underlying disk fails. |
| Amazon Elastic File System (Amazon EFS) | Managed elastic NFS file storage. | Share a directory across Linux application instances. |
| Amazon FSx | Managed file systems with specific file system features or protocols. | FSx for Windows File Server for Windows SMB shares; FSx for Lustre for high-performance parallel file workloads. |
| AWS Storage Gateway | Hybrid storage with local access and an AWS backend. | S3 File Gateway presents NFS/SMB file shares with a local cache and stores files as S3 objects. Do not confuse this with cloud-native shared EFS. |
| AWS Backup | Centralized backup policies, scheduling, and retention for supported resources. | Protect EBS and supported databases under a common backup plan. A backup must be restored; it does not actively fail over an application. |
| AWS Elastic Disaster Recovery | Continuous server block replication and recovery into AWS. | Reduce server recovery time and data loss after an outage; this is not an archive or routine backup retention service. |

### Amazon S3 storage classes

| Class | Recognition cue | Trade-off |
| --- | --- | --- |
| S3 Standard | Frequently read objects, such as active website assets. | Multi-AZ, immediate access. |
| S3 Intelligent-Tiering | Access patterns are unknown or change over time. | Automatically tiers eligible objects; monitoring and automation charges apply to eligible objects. Optional archive tiers need restoration. |
| S3 Standard-Infrequent Access (S3 Standard-IA) | Infrequently accessed data needing immediate retrieval. | Multi-AZ; retrieval charges and minimum storage duration apply. |
| S3 One Zone-Infrequent Access (S3 One Zone-IA) | Re-creatable infrequently accessed data needing immediate retrieval. | Lower storage rate than Standard-IA but one AZ; retrieval charges apply. |
| S3 Express One Zone | Consistent low-latency access for high-performance workloads. | Single-AZ directory bucket; not the same as inexpensive infrequent-access storage. |
| S3 Glacier Instant Retrieval | Rarely read archive data that still needs millisecond access. | Immediate access, with retrieval charges and minimum storage duration. |
| S3 Glacier Flexible Retrieval | Long-lived archive that can wait for restore. | Retrieval options range from minutes to hours; formerly the S3 Glacier storage class. |
| S3 Glacier Deep Archive | Data kept for years, such as old compliance records. | Low storage cost; plan for restore measured in hours. |

**Lifecycle policies** transition objects between supported classes or expire objects based on rules. Example: retain logs in Standard during active investigations, transition older records to archive, then expire them only after the required retention period. Factor in transition, retrieval, and minimum-duration charges; the lowest per-GB storage price is not always the lowest total cost. Lifecycle is not a substitute for backup or retention protection.

Official sources: [S3 storage classes](https://aws.amazon.com/s3/storage-classes/), [S3 Lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html), [EC2 storage options](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Storage.html), [AWS cloud storage](https://aws.amazon.com/products/storage/), [AWS Backup](https://aws.amazon.com/backup/), [AWS Elastic Disaster Recovery](https://aws.amazon.com/disaster-recovery/).

## 3.7 — Identify AWS artificial intelligence and machine learning (AI/ML) services and analytics services

### AI and machine learning

| Service | Choose it for… | Example or contrast |
| --- | --- | --- |
| Amazon Comprehend | Natural-language analysis of existing text, such as sentiment or entities. | Detect negative reviews; it does not translate them. |
| Amazon Lex | Build conversational text or voice interfaces that interpret user intent. | An order-status chatbot; transcription alone would not implement the conversation. |
| Amazon Polly | Text-to-speech synthesis. | Read a school announcement aloud. |
| Amazon Q | Generative AI assistance for work or development, depending on the offering. | Recognize Amazon Q Developer for developer assistance (now the [AWS assistant](https://aws.amazon.com/about-aws/whats-new/2026/11/q-developer-renamed-aws-assistant/) in the console and console mobile apps). [Amazon Q Business](https://aws.amazon.com/q/business/) answers questions from authorized business sources; it is closed to new customers, and AWS points to AWS Quick. Neither is a model-training service. |
| Amazon Rekognition | Analyze images or video for visual content, such as objects or labels. | Tag objects in a photo collection, not extract invoice fields. |
| Amazon SageMaker AI | Build, train, and deploy ML models. | Train a custom demand forecasting model instead of using a prebuilt text-analysis API. SageMaker AI is the ML capability, not the whole SageMaker platform. |
| Amazon Textract | Extract printed or handwritten text and structured information such as forms and tables from documents. | Read invoice totals from scans; not a sentiment service. |
| Amazon Transcribe | Speech-to-text conversion. | Produce captions from recordings; the inverse of Polly. |
| Amazon Translate | Translate text between languages. | Turn a support article into another language; not speech transcription. |

Managed AI APIs still leave the customer responsible for data permissions and evaluating output quality. Compare usage charges and fit before using a custom model where a managed API would suffice.

### Analytics

| Service | Choose it for… | Example or contrast |
| --- | --- | --- |
| Amazon Athena | Serverless SQL queries over data such as files in S3, without loading it into a dedicated warehouse. | Inspect stored web logs; common SQL usage is charged by data scanned. |
| Amazon EMR | Managed big-data processing with frameworks such as Apache Spark. | Transform a large dataset with Spark code; not a business dashboard. |
| AWS Glue | Serverless data discovery, cataloging, integration, and ETL (extract, transform, load). | Clean files and register tables in the Glue Data Catalog for Athena queries. |
| Amazon Kinesis | Real-time streaming recognition cue; use Amazon Kinesis Data Streams to collect streams for consumers. | Capture live click events; Athena is more appropriate for ad hoc SQL over stored files. |
| Amazon OpenSearch Service | Managed full-text search and analytics using OpenSearch. | Search and visualize application logs; not a transactional database. |
| Amazon Quick (now AWS Quick) | Business intelligence and dashboards are the exam cue. AWS Quick includes the AWS Quick Sight BI capability, formerly Amazon Quick Sight/QuickSight. | Build a revenue dashboard rather than use a data warehouse as the visualization layer. |
| Amazon Redshift | Managed SQL data warehouse for analytical workloads. | Run complex recurring sales analysis across combined datasets, not operational order-entry transactions. |

**Example:** Stream clicks with Kinesis, use Glue to catalog and prepare the resulting stored data, and use Athena for occasional SQL investigation or Redshift for recurring warehouse analytics. Share the results in Quick Sight. These services solve different parts of the workflow.

Official sources: [AWS AI services](https://aws.amazon.com/ai/services/), [Amazon SageMaker AI](https://aws.amazon.com/sagemaker/ai/), [Amazon Q](https://aws.amazon.com/q/), [AWS analytics](https://aws.amazon.com/big-data/datalakes-and-analytics/), [Amazon Quick to AWS Quick rename](https://aws.amazon.com/about-aws/whats-new/2026/11/amazon-quick-aws-quick/).

## 3.8 — Identify services from other in-scope AWS service categories

### Application integration

| Service | Choose it when… | Example or boundary |
| --- | --- | --- |
| Amazon EventBridge | Events must match rules and be routed to targets across applications, AWS services, or supported SaaS sources. | Send only `order canceled` events to a refund workflow. Routing is not the same as storing a work backlog. |
| Amazon Simple Notification Service (Amazon SNS) | A published message must be pushed to multiple subscribers or notification endpoints. | Fan out a stock alert to email and subscribed queues. |
| Amazon Simple Queue Service (Amazon SQS) | Consumers need a durable buffer so they can process messages at their own pace. | Queue orders while workers scale. Standard queues can deliver duplicates; consumers should safely handle repeated messages. |
| AWS Step Functions | A workflow needs explicit sequencing, branching, or retries across steps. | Coordinate approval, payment, and fulfillment instead of merely broadcasting an order event. |

A single application can use all these patterns: EventBridge selects order events, SNS fans updates out, SQS buffers work for each consumer, and Step Functions coordinates a multi-step fulfillment workflow.

### Business applications and customer enablement

| Service | Recognition cue and boundary |
| --- | --- |
| Amazon Connect (now Amazon Connect Customer for the contact center) | Cloud contact center with customer contact routing and agent tools, such as taking support calls. AWS now uses Amazon Connect as a portfolio name. |
| Amazon Simple Email Service (Amazon SES) | Send transactional or bulk application email, such as receipts or password resets. Not a contact center or queue; senders manage identities, reputation, and consent. |
| AWS Support | Pick the level of help based on workload impact, hours of expert access, and whether the business needs proactive or designated support. Basic covers account/billing help and self-service resources; Business Support+ adds 24/7 access to cloud experts; Enterprise Support adds a designated Technical Account Manager (TAM); Unified Operations offers enhanced operational engagement for mission-critical workloads. Paid coverage and plan availability vary; use the official comparison, not old plan names or memorized prices. |

### Developer tools

| Service | Choose it for… | Example or boundary |
| --- | --- | --- |
| AWS CLI | Terminal access and operator scripting. | Inventory an environment from a shell; it is not a build runner. See [3.1](#task-3-1) for access method selection. |
| AWS CodeBuild | Managed compilation, testing, and build artifacts. | Run tests and package an application. Own the build definition and credentials. |
| AWS CodePipeline | Automating release stages for continuous delivery. | Pass a source change to CodeBuild, then an approval or deployment action. It coordinates tools rather than compiling code itself. |
| AWS X-Ray | Distributed request tracing and service dependency analysis. | See which service made checkout slow; not a build tool or AWS API audit log. AWS recommends OpenTelemetry for instrumentation as the legacy X-Ray SDKs and daemon are in maintenance. |

### End-user computing

These services can present the output of workloads running remotely instead of executing the workload on the end user's device. Choose what the user needs to see: applications, a full desktop, or just a browser.

| Service | Choose it for… | Example or boundary |
| --- | --- | --- |
| Amazon AppStream 2.0 (now Amazon WorkSpaces applications) | Streaming centrally managed desktop applications; the service can also deliver nonpersistent desktops. | Give a contractor access to an engineering application without installing it on the contractor's laptop. |
| Amazon WorkSpaces | Cloud desktops. WorkSpaces Personal provides persistent desktops assigned to individuals. | Give staff a full desktop and persistent settings. Do not assume every WorkSpaces offering is persistent. |
| Amazon WorkSpaces Secure Browser | Isolated remote browser sessions for web apps, not full desktops. | Give an existing customer browser-only access to internal web tools. Closed to new customers from **October 29, 2026**; still recognize the guide name and purpose. |

Customers still decide which users and apps can connect and what session policies apply. Streaming is not a substitute for identity and access controls.

### Frontend web and mobile; Internet of Things (IoT)

| Service | Recognition cue and boundary |
| --- | --- |
| AWS Amplify | Builds and deploys web/mobile app frontends and connects them to backend capabilities such as authentication and data; Amplify Hosting deploys web frontends, not native mobile binaries to app stores. Think a team shipping a frontend, not building a fleet of EC2 instances. |
| AWS IoT Core | Authenticates and connects devices, exchanges messages, and routes device data to applications or AWS services. A fleet of building sensors can publish readings with MQTT. Secure device identities and policies; the service does not physically manage the sensors. |

Official sources: [AWS application integration](https://aws.amazon.com/products/application-integration/), [Amazon Connect naming](https://docs.aws.amazon.com/connect/latest/APIReference/Welcome.html), [Amazon SES](https://aws.amazon.com/ses/), [AWS Support plans](https://aws.amazon.com/premiumsupport/plans/), [AWS developer tools](https://aws.amazon.com/products/developer-tools/), [X-Ray SDK and daemon timeline](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-daemon-timeline.html), [WorkSpaces applications](https://aws.amazon.com/workspaces/applications/), [Amazon WorkSpaces](https://aws.amazon.com/workspaces/), [Secure Browser availability](https://docs.aws.amazon.com/workspaces-web/latest/adminguide/workspaces-secure-browser-maintenance-mode.html), [AWS Amplify](https://aws.amazon.com/amplify/), [AWS IoT Core](https://aws.amazon.com/iot-core/).

## Further Reference (optional)

| Primary task | Optional lookup |
| --- | --- |
| [3.1](#task-3-1), [3.8](#task-3-8) | [Developer tools](../service-reference/developer-tools.md) |
| [3.3](#task-3-3) | [Compute](../service-reference/compute.md), [Containers and serverless](../service-reference/containers-serverless.md) |
| [3.4](#task-3-4) | [Databases](../service-reference/databases.md), [Migration and transfer](../service-reference/migration-transfer.md) |
| [3.5](#task-3-5) | [Networking and content delivery](../service-reference/networking-content-delivery.md) |
| [3.6](#task-3-6) | [Storage](../service-reference/storage.md) |
| [3.7](#task-3-7) | [Analytics and AI/ML](../service-reference/analytics-ai-ml.md) |
| [3.8](#task-3-8) | [Application integration and business applications](../service-reference/application-integration.md), [End-user computing](../service-reference/end-user-computing.md), [Frontend, mobile, and IoT](../service-reference/frontend-mobile-iot.md) |
