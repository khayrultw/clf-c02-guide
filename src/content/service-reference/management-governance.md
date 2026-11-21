# Management and Governance — service reference

Optional lookup for [Cloud Concepts](../study-material/01-domain-1-cloud-concepts.md), [Security and Compliance](../study-material/02-domain-2-security-compliance.md), [Cloud Technology and Services](../study-material/03-domain-3-cloud-technology-services.md), and [Billing, Pricing, and Support](../study-material/04-domain-4-billing-pricing-support.md). The inventory headings retain the exam guide's names.

## AWS Auto Scaling

Adjust capacity as demand changes. The guide name includes AWS Auto Scaling scaling plans for supported resources; **Amazon EC2 Auto Scaling** manages groups of EC2 instances, and **Application Auto Scaling** manages supported resources in other services. These are related tools, not alternate names for the same service. For example, scale an EC2 web tier out for a sale and in afterward. A load balancer distributes traffic; it does not set desired capacity. Scaling affects consumption charges. [Task 3.3](../study-material/03-domain-3-cloud-technology-services.md#task-3-3) · [AWS Auto Scaling](https://aws.amazon.com/autoscaling/) · [Scaling plan alternatives](https://docs.aws.amazon.com/autoscaling/plans/userguide/migrate-scaling-plan.html)

## AWS CloudFormation

Describe desired AWS resources in templates deployed as stacks. Use it for consistent, versioned infrastructure as code instead of recreating environments by hand. Review changes and budget for resources the stack creates. [Task 3.1](../study-material/03-domain-3-cloud-technology-services.md#task-3-1) · [AWS documentation](https://aws.amazon.com/cloudformation/)

## AWS CloudTrail

Audit recorded AWS account and API activity: **who did what and when?** Use Event history for the last 90 days of management events per Region. Configure a trail for ongoing delivery to S3 and select other event types as needed. Compare CloudWatch for operations and Config for resource state. [Task 2.2](../study-material/02-domain-2-security-compliance.md#task-2-2) · [AWS documentation](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html)

## Amazon CloudWatch

Observe metrics and logs and create alarms. Choose it to alert on a latency or error-rate increase, not to attribute a configuration change to a particular IAM principal. Log ingestion, retention, and metrics can affect cost. [Task 2.2](../study-material/02-domain-2-security-compliance.md#task-2-2) · [AWS documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)

## AWS Compute Optimizer

Use utilization and resource specifications to get rightsizing recommendations for supported resources. Review suggestions against expected peaks and workload needs; recommendations are not automatic changes. Use Trusted Advisor for broader best-practice checks. [Task 1.4](../study-material/01-domain-1-cloud-concepts.md#task-1-4) · [AWS documentation](https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html)

## AWS Config

Record supported resource configurations and evaluate rules against them. Example: find whether a recorded resource met an encryption rule. Use CloudTrail to identify the actor; passing a Config rule is not proof of overall compliance. Recording and rule evaluations can affect cost. [Task 2.2](../study-material/02-domain-2-security-compliance.md#task-2-2) · [AWS documentation](https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html)

## AWS Control Tower

Set up and govern a multi-account landing zone with controls and standardized account provisioning. Choose it to establish a common starting point for many accounts. AWS Organizations underpins its account structure; a landing zone does not make every workload compliant. [Task 2.2](../study-material/02-domain-2-security-compliance.md#task-2-2) · [AWS documentation](https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html)

## AWS Health Dashboard

**Former name:** AWS Personal Health Dashboard (the account-specific view). Check public AWS service events or sign in to see events relevant to your account and resources, such as scheduled maintenance. Use the dashboard to investigate AWS-side events and CloudWatch to monitor your own telemetry. Programmatic AWS Health API access has support-plan requirements. [Task 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3) · [AWS documentation](https://docs.aws.amazon.com/health/latest/ug/what-is-aws-health.html)

## AWS License Manager

Track and govern software license use, for example to monitor use of organization-owned licenses on eligible instances. It does not grant license rights; confirm license terms and eligibility before BYOL. [Task 1.4](../study-material/01-domain-1-cloud-concepts.md#task-1-4) · [Task 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3) (Marketplace entitlements) · [AWS documentation](https://docs.aws.amazon.com/license-manager/latest/userguide/license-manager.html)

## AWS Management Console

Browser interface for viewing and working with AWS resources. Useful for interactive inspection; choose templates for consistent provisioning or the CLI/SDKs for scripted or programmatic access. All methods require permissions. [Task 3.1](../study-material/03-domain-3-cloud-technology-services.md#task-3-1) · [AWS documentation](https://docs.aws.amazon.com/awsconsolehelpdocs/latest/gsg/what-is.html)

## AWS Organizations

Group accounts into organizational units for central management and consolidate billing. Service control policies set permission limits in member accounts; they do not grant permissions. Consolidated billing combines payment but does not merge accounts. [Task 4.2](../study-material/04-domain-4-billing-pricing-support.md#task-4-2) (billing) · [Task 2.2](../study-material/02-domain-2-security-compliance.md#task-2-2) (governance) · [AWS documentation](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html)

## AWS Service Catalog

Publish approved IT products for controlled self-service. For example, let developers launch only an approved application stack from an internal portfolio. CloudFormation defines a stack; Service Catalog governs how an approved product is offered to users. [Task 2.2](../study-material/02-domain-2-security-compliance.md#task-2-2) · [Task 3.1](../study-material/03-domain-3-cloud-technology-services.md#task-3-1) (related IaC) · [AWS documentation](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/introduction.html)

## Service Quotas

Check supported service limits and request increases for adjustable quotas. For example, check the relevant quota before planning a fleet expansion. A quota increase is not a resource purchase, capacity reservation, or budget limit. [Task 2.2](../study-material/02-domain-2-security-compliance.md#task-2-2) · [AWS documentation](https://docs.aws.amazon.com/servicequotas/latest/userguide/intro.html)

## AWS Systems Manager

Manage supported nodes and routine operational work at scale, such as inventory, patching, and remote sessions. Parameter Store keeps configuration and can store encrypted values; choose Secrets Manager when you need supported managed secret rotation. Nodes must be configured for management; using Systems Manager does not transfer EC2 guest OS responsibility to AWS. [Task 2.3](../study-material/02-domain-2-security-compliance.md#task-2-3) · [Task 2.1](../study-material/02-domain-2-security-compliance.md#task-2-1) (patching responsibility) · [AWS documentation](https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html)

## AWS Trusted Advisor

Assess your environment using best-practice checks in areas such as security, cost, performance, and fault tolerance. For example, review reported risks or opportunities for savings. Coverage depends on the support plan; use AWS Health Dashboard for AWS service events, not recommendations. [Task 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3) · [Task 2.4](../study-material/02-domain-2-security-compliance.md#task-2-4) (security checks) · [AWS documentation](https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html)

## AWS Well-Architected Tool

Review a workload against AWS best practices and record improvement actions. Choose it for a structured review, not resource monitoring or a compliance audit. The Framework guides the review; the Tool documents it. [Task 1.2](../study-material/01-domain-1-cloud-concepts.md#task-1-2) · [AWS documentation](https://docs.aws.amazon.com/wellarchitected/latest/userguide/well-architected.html)

**Verified November 20, 2026:** [In-scope inventory](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html) and [CLF-C02 exam guide revision 1.3](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html) (October 29, 2026).
