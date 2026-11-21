# Billing, pricing, and support — quick reference

**Optional review.** [Domain 4](../study-material/04-domain-4-billing-pricing-support.md) is the required lesson. AWS sources verified November 20, 2026 against the [Domain 4 task statements](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain4.html) and [CLF-C02 exam guide revision 1.3 (October 29, 2026)](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html).

## Amazon EC2 purchasing options

| Scenario cue | Choose |
| --- | --- |
| No term commitment; workload is not designed for interruption | On-Demand Instances |
| Predictable matching EC2 use; term discount | Reserved Instances; Regional for broader billing coverage, Zonal when matching AZ capacity is also needed |
| Restartable work; spare capacity | Spot Instances |
| Consistent hourly spend; flexible eligible compute usage | Savings Plans; not a capacity reservation |
| Per-core or per-socket licensing; control over physical placement | Dedicated Hosts |
| Hardware isolation without managing placement | Dedicated Instances |
| Need matching capacity in one AZ without a term commitment | On-Demand Capacity Reservations; no built-in discount, and unused capacity is billable |

Eligible Regional RIs can cover different sizes in the same family; don't assume this for every platform, tenancy, or instance type. Organizations can share eligible **discounts**, not Zonal RI capacity. [EC2 purchasing options](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html) · [Primary lesson: 4.1](../study-material/04-domain-4-billing-pricing-support.md#task-4-1)

## Amazon S3 pricing

Think **storage + requests + applicable retrieval and transfer**. Standard is suited to frequent reads; Intelligent-Tiering addresses changing access patterns; IA and Glacier classes trade lower storage rates for retrieval or retention considerations. Example: before moving records to Deep Archive, check that delayed access and a 180-day minimum are acceptable. [AWS S3 pricing](https://aws.amazon.com/s3/pricing/) · [Primary lesson: 4.1](../study-material/04-domain-4-billing-pricing-support.md#task-4-1)

## AWS Billing and Cost Management

Use **Bills** for charged amounts, invoices, and payments. Use [AWS Pricing](https://aws.amazon.com/pricing/) for public service rates, and Support Center for help with a charge. Resource tags become usable for cost allocation after separate activation of eligible AWS-generated and user-defined keys. [AWS Billing documentation](https://docs.aws.amazon.com/account-billing/index.html) · [Primary lesson: 4.2](../study-material/04-domain-4-billing-pricing-support.md#task-4-2)

## AWS Pricing Calculator

**Estimate** a proposed workload by service, configuration, Region, and expected use. Example: compare estimated monthly costs for two designs before building. An estimate is not a bill. [AWS Pricing Calculator](https://calculator.aws/) · [Primary lesson: 4.2](../study-material/04-domain-4-billing-pricing-support.md#task-4-2)

## AWS Cost Explorer

**Analyze and forecast** using recorded costs and usage. Group by account, service, or activated tag to investigate a change. Use AWS Budgets, not Cost Explorer, for threshold alerts. [AWS Cost Explorer documentation](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html) · [Primary lesson: 4.2](../study-material/04-domain-4-billing-pricing-support.md#task-4-2)

## AWS Budgets

**Set thresholds and alert** on actual or supported forecasted amounts. A budget notification does not automatically stop resources. Example: email a team when its month-end cost forecast exceeds its budget. [AWS Budgets documentation](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html) · [Primary lesson: 4.2](../study-material/04-domain-4-billing-pricing-support.md#task-4-2)

## AWS Cost and Usage Reports (CUR)

**Export line items** to S3 for detailed analysis or chargeback. Use active billing tags to group supported charges by project. Consider storage and downstream query charges. [CUR to CUR 2.0 guide](https://docs.aws.amazon.com/cur/latest/userguide/dataexports-migrate.html) · [Primary lesson: 4.2](../study-material/04-domain-4-billing-pricing-support.md#task-4-2)

## AWS Data Exports

**Create CUR 2.0 exports** for the newer, consistently structured billing dataset. Choose it for a detailed data feed rather than notifications or charts. [CUR 2.0 documentation](https://docs.aws.amazon.com/cur/latest/userguide/dataexports-migrate.html) · [Primary lesson: 4.2](../study-material/04-domain-4-billing-pricing-support.md#task-4-2)

## AWS Organizations

**Consolidate billing** for separate accounts. The management account normally pays the combined bill; linked-account usage stays identifiable. Aggregate eligible usage and share eligible discounts under the configured rules. Use account breakdowns, active tags, or Cost Categories for internal allocation. [Consolidated billing documentation](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html) · [Primary lesson: 4.2](../study-material/04-domain-4-billing-pricing-support.md#task-4-2) · [RI sharing: 4.1](../study-material/04-domain-4-billing-pricing-support.md#task-4-1)

## AWS Support Center

**Open or manage a private case** in [AWS Support Center](https://console.aws.amazon.com/support/home). Billing and account help is available with Basic; technical cases and response targets vary by plan and severity. [Primary lesson: 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3)

## AWS Support

| Current plan in the exam guide | Recognition cue |
| --- | --- |
| Basic Support | Included: account/billing help, self-service and community resources, core Trusted Advisor checks |
| AWS Business Support+ | 24/7 technical experts for production workloads |
| AWS Enterprise Support | Designated TAM and proactive help for business-critical workloads |
| AWS Unified Operations | Designated specialists and incident management for mission-critical workloads |

**Legacy/regional:** Developer, Business, and Enterprise On-Ramp have a January 1, 2027 transition deadline, with continued availability in GovCloud (US). AWS China lists Developer, Business, and Enterprise separately; check the local plan matrix. [Current plan comparison](https://aws.amazon.com/premiumsupport/plans/) · [Legacy transition](https://docs.aws.amazon.com/awssupport/latest/user/support-plans-eos.html) · [AWS China Support](https://www.amazonaws.cn/en/support/) · [Primary lesson: 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3)

## AWS Trusted Advisor

**Recommend improvements**, such as reviewing underused resources for possible savings. Checks vary by plan; a recommendation is not a forecast or an automatic repair. [Trusted Advisor documentation](https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html) · [Primary lesson: 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3)

## AWS Health Dashboard

**View service and account events.** Use public status for broad AWS service events; sign in to see events and resources specific to your account. Unlike Trusted Advisor, Health reports events rather than optimization recommendations. [AWS Health documentation](https://docs.aws.amazon.com/health/latest/ug/what-is-aws-health.html) · [Primary lesson: 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3)

## AWS Health API

**Query AWS Health events and affected resources programmatically.** Use it for integrations with an operations tool. Business Support+, Enterprise Support, and Unified Operations include access; see AWS's plan and regional transition exceptions. EventBridge delivery is an alternative to API queries for notifications. [AWS Health API requirements](https://docs.aws.amazon.com/health/latest/ug/health-api.html) · [Primary lesson: 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3)

## AWS Marketplace

**Procure** third-party offerings; check seller terms and associated infrastructure charges. Use [purchase orders](https://docs.aws.amazon.com/marketplace/latest/buyerguide/buyer-purchase-orders.html) or [available cost tags](https://docs.aws.amazon.com/marketplace/latest/buyerguide/cost-allocation-tagging.html) to track spend, [Private Marketplace](https://docs.aws.amazon.com/marketplace/latest/buyerguide/private-marketplace-current.html) to govern approved purchases, and [License Manager grants](https://docs.aws.amazon.com/marketplace/latest/buyerguide/sharing-licenses.html) to distribute eligible rights to use a purchased product. Catalog approval does not confer a license. [Primary lesson: 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3)

## AWS Partner Network (APN)

**Find expertise or products**: an independent software vendor sells software; a systems integrator helps implement and connect systems. Separate these roles from **partner membership benefits**, such as eligible training and certification support, partner events, and program-specific volume or growth discounts. [AWS Partner Network](https://aws.amazon.com/partners/) · [Partner funding](https://aws.amazon.com/partners/funding/) · [Partner events](https://aws.amazon.com/partners/equip/) · [Solution Provider Program](https://aws.amazon.com/partners/programs/solution-provider/) · [Primary lesson: 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3)

## AWS Documentation, Whitepapers, and Blogs

**Look up service details** in [AWS Documentation](https://docs.aws.amazon.com/); read [AWS Whitepapers and Guides](https://aws.amazon.com/whitepapers/) for architectural principles, and [AWS Blogs](https://aws.amazon.com/blogs/) for announcements and examples. Prefer current service documentation for precise limits and features. [Primary lesson: 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3)

## AWS Prescriptive Guidance

**Find delivery patterns** for migration and modernization. Example: find a documented approach to move a workload to AWS; use Support Center for an issue with a running service. [AWS Prescriptive Guidance](https://aws.amazon.com/prescriptive-guidance/) · [Primary lesson: 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3)

## AWS re:Post

**Ask the community** and search for answers in [AWS re:Post](https://repost.aws/). Use a private Support Center case for confidential account details. [Primary lesson: 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3)

## AWS Knowledge Center

**Find AWS-authored answers** to common issues in the [AWS Knowledge Center](https://repost.aws/knowledge-center) on AWS re:Post. Unlike community Q&A, this is a curated collection of official answers. [Primary lesson: 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3)

## AWS Professional Services

**Get hands-on help with a project**, such as implementing a migration. This is separate from a support plan. [AWS Professional Services](https://aws.amazon.com/professional-services/) · [Primary lesson: 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3)

## AWS solutions architects

**Get design advice**, such as reviewing a proposed architecture and discussing service choices. Use Professional Services for project delivery, or Support Center to manage a support case. [AWS account team roles](https://startups.aws.com/learn/meet-your-aws-account-team) · [Primary lesson: 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3)

## AWS Trust & Safety

**Report abuse originating from AWS resources**, such as spam, through the [AWS abuse form](https://aws.amazon.com/forms/report-abuse/). Do not use it for routine account help or outage reports. [Primary lesson: 4.3](../study-material/04-domain-4-billing-pricing-support.md#task-4-3)
