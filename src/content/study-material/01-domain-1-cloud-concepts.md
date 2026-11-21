# Domain 1: Cloud Concepts (24% of scored content)

Learn to explain why an organization chooses cloud, how it reviews a workload, how it plans a move, and what changes in its cost model. The four tasks below are the required learning path. Named examples support recognition; you do not need to configure the services.

## 1.1 — Define the benefits of the AWS Cloud

The **value proposition** is on-demand access to computing resources and managed services without first buying, installing, and operating the infrastructure yourself. This can shorten the path from idea to release, let spending follow usage, and free staff to work on the application instead of the data center. It does not eliminate the need to design for failure, set spending controls, or protect data.

| Benefit | What it solves | Scenario clue and example |
|---|---|---|
| Global reach | Places workloads or content closer to users or in suitable geographic locations. | A retailer serves new customers from an AWS Region nearer to them to reduce latency. Check regional service availability and residency requirements before deploying. |
| Speed of deployment | Removes much of the wait for physical procurement and installation. | A team provisions a test environment in minutes rather than waiting weeks for servers. |
| High availability | Keeps a workload usable when a component or location fails. | An ordering site runs in multiple Availability Zones so one zone's failure need not stop all orders. AWS supplies the locations; the workload must be designed to use them. |
| Elasticity | Matches capacity to current demand by adding **and removing** capacity. | A ticket site adds capacity during a sale and removes it afterward so it does not pay for idle peak capacity all week. Scalability is the ability to handle a change in load; elasticity is adjusting capacity as that load changes. |
| Agility | Makes it faster to experiment, learn, and deliver changes. | The same team can trial two versions in short-lived environments, remove the test resources, and ship the better version. |

One scenario may involve several benefits. Look for the **main goal**: start sooner = speed; try and change faster = agility; reach distant users = global reach; stay online through failure = high availability; add and remove capacity as demand changes = elasticity. See [AWS cloud advantages](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html) and [AWS Global Infrastructure](https://aws.amazon.com/about-aws/global-infrastructure/).

## 1.2 — Identify design principles of the AWS Cloud

The [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/framework.html) is a set of questions and best practices for reviewing a **workload** (an application or system that delivers value). It helps teams see trade-offs and prioritize fixes; it is not an audit or a certification. Common design principles include testing at realistic scale, automating repeatable changes, measuring results, and improving the architecture as evidence changes.

| Pillar | Primary question | Example improvement |
|---|---|---|
| Operational excellence | How do we run the workload, respond to events, and improve how we operate? | Automate small, reversible releases and update the runbook after an incident. |
| Security | How do we protect data, systems, and assets? | Give an application role access only to the data it needs and keep audit records. |
| Reliability | How does the workload keep delivering its intended function and recover from failure? | Test a backup restoration or place redundant application instances in separate Availability Zones. |
| Performance efficiency | How do we meet performance needs efficiently as demand or technology changes? | Benchmark instance types against the application's response-time target and select the best fit. |
| Cost optimization | How do we deliver business value without unnecessary spend? | Remove unattached storage and reduce oversized resources after measuring demand. |
| Sustainability | How do we minimize the environmental impact of running the workload? | Reduce idle compute and unnecessary data processing to do the same work with fewer resources. |

The same action can support multiple pillars. Rightsizing mainly serves **cost optimization** when the goal is a lower bill, **performance efficiency** when the goal is meeting a response-time target efficiently, and **sustainability** when the goal is reducing resource use and environmental impact. Recovering the service after failure points to **reliability**; improving how the team detects problems and deploys fixes points to **operational excellence**.

The [AWS Well-Architected Tool](https://docs.aws.amazon.com/wellarchitected/latest/userguide/well-architected.html) helps teams review and document a workload against the Framework and track improvements. It is the review tool, not the framework itself, an automatic repair service, or a guarantee of compliance.

## 1.3 — Understand the benefits of and strategies for migration to the AWS Cloud

Cloud adoption is more than moving servers. The [AWS Cloud Adoption Framework (AWS CAF)](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/welcome.html) helps an organization assess readiness, prioritize outcomes, and build a transformation roadmap. Its **six perspectives** organize capabilities by stakeholder concerns:

| Perspective | Focus | Example readiness work |
|---|---|---|
| Business | Business outcomes and investment priorities | Decide whether a faster release cycle supports a revenue goal. |
| People | Skills, leadership, culture, and change | Train service desk staff before the first cutover. |
| Governance | Coordinating change while managing risk and value | Define spending ownership and how risks are reviewed. |
| Platform | Building the technical foundation and modernizing workloads | Define a standard account and network setup. |
| Security | Protecting data and workloads | Agree on identity, logging, and data protection requirements. |
| Operations | Running and improving services | Assign incident ownership and practice recovery. |

Outcomes can include **reduced business risk** through tested recovery, **improved environmental, social, and governance (ESG) performance** through better resource efficiency and reporting, **increased revenue** through faster launches in new markets, and **increased operational efficiency** through repeatable provisioning and reduced infrastructure work. These are goals, not automatic results. AWS CAF describes an iterative path: **Envision** outcomes, **Align** stakeholders and close readiness gaps, **Launch** pilot initiatives, then **Scale** what works. CAF is organization-level; [Well-Architected](#task-1-2) reviews a workload.

Before choosing a strategy, discover the application inventory, dependencies, utilization, license restrictions, and downtime tolerance. Use [AWS Prescriptive Guidance](https://aws.amazon.com/prescriptive-guidance/) for planning guidance and the [7 Rs](https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html) as a decision aid:

| Strategy | When it fits | Example |
|---|---|---|
| Retire | The workload no longer serves a business need. | Decommission a duplicate portal after preserving required records. |
| Retain | It must stay put for now. | Keep a system beside factory equipment it directly controls. |
| Rehost | Move with minimal application changes. | Move a legacy application server onto Amazon EC2. |
| Relocate | Move a group of systems at the infrastructure/platform level without redesigning individual applications. | Move a virtualized environment to a compatible cloud platform. |
| Repurchase | Replace with a different product, often SaaS. | Switch a self-managed help desk to a hosted subscription. |
| Replatform | Make targeted changes for cloud benefits without a major redesign. | Move a self-managed relational database to Amazon RDS. |
| Refactor (re-architect) | Redesign to meet goals the old architecture cannot meet. | Split a tightly coupled application into independently scalable components. |

**Choose a resource for the stage of the move.** Use CAF to assess readiness and Prescriptive Guidance for planning. Use [Migration Evaluator](https://aws.amazon.com/migration-evaluator/) to turn inventory and utilization data into a cost estimate for a migration business case, not to copy servers. For a rehost, [AWS Application Migration Service](https://aws.amazon.com/about-aws/whats-new/2026/06/aws-transform-mgn-rebrand/), now called **AWS Transform MGN**, moves supported servers rather than converting a database schema.

**Database replication is a technique, not another R.** [AWS Database Migration Service (AWS DMS)](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html) can copy data and, for supported configurations, replicate ongoing changes while the source is still in use. Validate the target and plan a cutover; low downtime is not a promise of zero downtime. A change of engine may also need schema conversion and manual work. A one-time copy may be enough for an offline archive. See [Task 3.4](03-domain-3-cloud-technology-services.md#task-3-4) for database migration choices and the optional [Migration and Transfer reference](../service-reference/migration-transfer.md) for tool lookup.

## 1.4 — Understand concepts of cloud economics

Compare the **total cost of ownership** for the same workload and service level. A server purchase can be a capital expense (CapEx); running systems incurs operating expenses (OpEx) such as power and support. **Fixed** and **variable** describe how costs change with usage, not their accounting category. A data-center lease can be fixed even though it is an operating expense. Cloud usage is often variable, but commitments can create predictable costs even when actual use drops.

| Cost consideration | How to reason about it |
|---|---|
| On-premises costs | Count hardware, facilities, networking, power, cooling, licenses, staff, spare capacity, and maintenance or replacement. Not all on-premises expenses are fixed. |
| Cloud costs and savings | Avoid some upfront infrastructure and pay for many resources as used. Account for compute, storage, requests, networking/data transfer, licenses, support, migration, and any period of running both environments. Idle provisioned resources and excessive data transfer can erase savings. |
| Economies of scale | AWS pools demand across many customers and buys and operates infrastructure at scale; this can lower unit costs. It is not an individual customer's reserved discount or the same thing as elasticity. |
| Rightsizing | Use workload metrics over a representative period to select the resource type and size that meet needs without overprovisioning. For example, test a smaller instance for a lightly used service, allowing for peak demand and performance targets. Auto scaling changes capacity over time; rightsizing chooses a good resource fit. [AWS Compute Optimizer](https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html) recommends options for supported resources; review recommendations before changing anything. |
| Automation | Repeatable provisioning, patching, and shutdown schedules reduce manual effort and avoid inconsistent or forgotten work. For example, automatically shut down nonproduction compute after hours when safe; attached storage may still incur charges. Automation takes design and monitoring, and a mistake can scale too. |
| License included vs. Bring Your Own License (BYOL) | License included bundles the applicable license in the AWS option's price. BYOL uses a qualifying existing license; confirm vendor terms, deployment/tenancy restrictions, support and actual savings. [AWS License Manager](https://docs.aws.amazon.com/license-manager/latest/userguide/license-manager.html) helps track and govern usage; it does not grant rights. Compare eligible license-included and BYOL offerings rather than assuming every service supports both. |

**Example:** A training platform is busy only during classes. Usage-based compute and scheduled shutdown may save money, but compare licensing, always-on storage, and the cost of moving the platform before deciding. Use [Task 4.1](04-domain-4-billing-pricing-support.md#task-4-1) and [Task 4.2](04-domain-4-billing-pricing-support.md#task-4-2) for specific pricing and estimating tools. AWS sources: [Cloud economics overview](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html) and [licensing options](https://aws.amazon.com/windows/resources/licensing/).

## Further Reference (optional)

[Management and Governance](../service-reference/management-governance.md) · [Migration and Transfer](../service-reference/migration-transfer.md) · [Billing, Pricing, and Support](../service-reference/billing-pricing-support.md)

**Blueprint sources:** [Domain 1 tasks](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain1.html) · [Exam guide revisions](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html). Verified November 20, 2026 against CLF-C02 exam guide revision **1.3** (October 29, 2026).
