# Domain 4 — Billing, Pricing, and Support (12%)

**Blueprint verified November 20, 2026:** [CLF-C02 exam guide](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html), [Domain 4 task statements](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain4.html), [revision 1.3 (October 29, 2026)](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html).

**Required depth:** Choose the right purchasing option, cost tool, or support resource for a scenario and explain the trade-off. Exact prices, API calls, and billing configuration steps are not needed here. For scope, see the official [technologies and concepts](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-technologies-concepts.html), [in-scope services](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html), and [out-of-scope services](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-out-of-scope-services.html) lists. These lists are not exhaustive.

## 4.1 — Compare AWS pricing models

### Compute: decide whether you need a discount, capacity, or isolation

| Option | When to choose it | What it does not give you |
| --- | --- | --- |
| **On-Demand Instances** | Short, uncertain, or changing workloads. Pay for usage without a long-term commitment. | No commitment discount or guarantee that capacity will be available when you launch. |
| **EC2 Reserved Instances (RIs)** | A predictable baseline with matching EC2 usage. A one- or three-year commitment gives a billing discount; charges continue even if you do not use the benefit. | Not a separate running instance. Only a Zonal RI reserves capacity. |
| **Spot Instances** | Interruptible, restartable work such as processing images in batches from a queue. Use spare EC2 capacity at a discount. | AWS can reclaim the capacity. Do not rely on Spot alone for work that cannot tolerate interruptions. |
| **Savings Plans** | Predictable minimum usage but a need for flexibility. Commit to a dollar amount per hour for one or three years. Compute Savings Plans can cover eligible EC2, Fargate, and Lambda usage; EC2 Instance Savings Plans are tied to an instance family in a Region. | No capacity reservation. You pay the commitment even when underused; usage beyond coverage can incur On-Demand rates. |
| **Dedicated Hosts** | A physical EC2 server dedicated to you. Choose this when you need host placement or visibility, or eligible per-socket or per-core software licenses. | Billed per host, rather than only for the instances you put on it. Check license terms. |
| **Dedicated Instances** | Hardware isolation from other AWS accounts without allocating or placing instances on a specific host yourself. | No host-level placement or socket visibility. Billed per instance, with applicable dedicated tenancy fees. |
| **On-Demand Capacity Reservations** | Assure matching EC2 capacity in a specific Availability Zone (AZ), such as for a scheduled launch. No one- or three-year commitment is needed. | Reserves capacity, not a discount. You pay for unused reserved capacity too; eligible discounts can be applied separately. |

Sources: [EC2 purchasing options](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html), [Savings Plans types](https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html), [Dedicated Instances versus Hosts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-instance.html), [On-Demand Capacity Reservations](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html). A usage-based service has different meters: for example, [AWS Lambda pricing](https://aws.amazon.com/lambda/pricing/) depends on requests and duration at the configured memory size, not simply on the number of functions created.

### Reserved Instance flexibility and discount sharing

- **Regional RI:** The discount can apply in any AZ in the purchased Region; no capacity is held. **Size flexibility** is narrower: eligible default-tenancy Linux/UNIX RIs can cover different sizes of the *same family* in the Region when platform and tenancy match. AWS weights each size in units, so coverage can be full or partial. Windows, RHEL, SUSE, dedicated tenancy, and some instance types (for example, G5) are excluded. Do not generalize size flexibility to all Regional RIs or assume it crosses families or Regions.
- **Zonal RI:** Holds capacity in one AZ for the owning account and discounts usage matching the AZ, family, size, platform, and tenancy. No AZ or size flexibility. Only the **billing discount** can be shared with eligible member accounts; the Zonal RI capacity cannot.
- **Standard versus Convertible:** This is an offering choice, not the Regional/Zonal choice. Convertible RIs can be exchanged for other qualifying Convertible RIs if requirements are met. Standard RIs cannot be exchanged that way; some modifications are possible. Neither offering class changes the discount-matching rules above.
- **AWS Organizations:** On a consolidated bill, the purchasing account generally gets its matching benefit first. Unused discount can cover qualifying usage in other accounts in the same organization if sharing is active for both owner and recipient and management-account sharing settings permit it. Prioritized sharing favors a defined set before other eligible accounts; restricted sharing limits which accounts can receive the discount. Consolidated billing does not make unmatched usage eligible or transfer ownership.

**Example:** A training company buys an eligible Regional RI for an `m5.xlarge`. Two matching `m5.large` instances in different AZs within that Region can consume the same discount units. If the owner only needs one of them, the other can use the remaining discount in a linked account if sharing permits. If the company needs a guaranteed launch in a particular AZ, choose a Capacity Reservation (or a matching Zonal RI if a term commitment also makes sense).

Sources: [RI discount matching and exclusions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/apply_ri.html), [RI billing and ownership](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts-reserved-instances-application.html), [EC2 RI options](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html), [discount sharing settings](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ri-turn-off.html).

### Data transfer: identify the source, destination, and network path

| Traffic | What to check |
| --- | --- |
| Internet → AWS | Data transfer in is often free (for example, standard EC2 internet ingress), but service processing or acceleration can still cost money. |
| AWS → internet | Egress is often billed by volume after any applicable allowance. Check service, Region, and usage tier. |
| Within one Region | Private EC2 traffic within the same AZ is generally free. EC2 traffic across AZs can incur charges even in the same Region. Service and routing exceptions apply; a NAT gateway can add data processing charges independently of transfer rates. |
| Between Regions | Usually chargeable. Check both services, the source and destination Regions, and each direction. For example, S3 cross-Region replication can add transfer, replication request, and destination storage charges. |

Sources: [EC2 On-Demand transfer rates and exceptions](https://aws.amazon.com/ec2/pricing/on-demand/), [VPC pricing and NAT processing](https://aws.amazon.com/vpc/pricing/), [S3 pricing and replication](https://aws.amazon.com/s3/pricing/).

### Storage: compare the total cost, not just the price per GB

| Storage choice | Cost and scenario cues |
| --- | --- |
| **S3 Standard** | Frequently accessed objects. Pay for storage and requests, plus applicable transfer. No retrieval fee or minimum storage duration for this class. |
| **S3 Intelligent-Tiering** | Uncertain or changing access patterns. Eligible objects move between access tiers; a monitoring and automation fee can apply. |
| **S3 Standard-IA / One Zone-IA** | Infrequent access with immediate reads; lower storage rate, retrieval charges, and a 30-day billing minimum. One Zone-IA is for data you can recreate if that AZ is lost. |
| **S3 Glacier Instant Retrieval** | Rarely read archive that still needs immediate access. Consider retrieval charges and the 90-day minimum. |
| **S3 Glacier Flexible Retrieval / Deep Archive** | Restores take time; choose for cold data that can wait. Consider restore/retrieval costs and minimum durations: 90 days for Flexible Retrieval, 180 for Deep Archive. |
| **Amazon EBS / Amazon EFS / Amazon FSx** | EBS is block storage: generally pay for provisioned volume capacity plus applicable performance and snapshot costs. EFS is shared file storage: classes and throughput choices affect cost. FSx is managed file storage: storage capacity, throughput, backups, and related charges depend on the file system type. |

**Example:** Keep a frequently read catalog in Standard. Move year-end records you must keep for years to Deep Archive if you can wait for a restore. An S3 Lifecycle transition is not automatically cheaper: account for requests, retrieval, minimum billable size, and charges for removing data early.

Sources: [S3 storage classes](https://aws.amazon.com/s3/storage-classes/), [S3 pricing](https://aws.amazon.com/s3/pricing/), [EBS pricing](https://aws.amazon.com/ebs/pricing/), [EFS pricing](https://aws.amazon.com/efs/pricing/), [FSx pricing](https://aws.amazon.com/fsx/pricing/).

## 4.2 — Understand resources for billing, budget, and cost management

Start with the [AWS Billing and Cost Management console](https://console.aws.amazon.com/billing/) to review Bills by service or linked account, invoices, payments, and credits. Ask AWS account and billing support through [AWS Support Center](https://console.aws.amazon.com/support/home) if a charge or payment needs help; this is not limited to paid technical support plans. Check the official [AWS Pricing pages](https://aws.amazon.com/pricing/) for published rates and billing units. Rates and allowances vary by service and Region.

### Estimate, analyze, alert, or export?

| Tool | Use it when… | Do not confuse it with… |
| --- | --- | --- |
| **AWS Pricing Calculator** | You need a what-if estimate, such as comparing two Regions for a proposed deployment. Supply the Region, usage assumptions, and service configuration. | An invoice or spending cap. The estimate depends on the inputs. |
| **AWS Cost Explorer** | You want charts of historical cost and usage, a forecast based on available history, or a breakdown by service, account, or active tag. | A budget alert or a detailed data export. |
| **AWS Budgets** | You need cost or usage thresholds and notifications for actual or, where supported, forecasted amounts. You can also track RI or Savings Plans utilization or coverage. | By default, a budget is not a hard spending cap. Optional configured actions can take specific steps; reporting and alerts can lag usage. |
| **AWS Cost and Usage Reports (CUR)** | Finance needs detailed line items for analysis or chargeback. Export to S3, then use analytics tools for custom reports. **AWS Data Exports CUR 2.0** is the newer export format; it provides the same kind of billing detail in a more consistent schema. | A dashboard or a notification service. Storage and analytics used with exports can have their own charges. |

Use the [public Pricing Calculator](https://calculator.aws/) for On-Demand estimates without signing in. The in-console calculator can model eligible account discounts and commitments. Both are estimates, even if the console models changes to an existing workload.

Sources: [Billing and Cost Management](https://docs.aws.amazon.com/account-billing/index.html), [Pricing Calculator documentation](https://docs.aws.amazon.com/pricing-calculator/), [Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html), [AWS Budgets](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html), [CUR and CUR 2.0](https://docs.aws.amazon.com/cur/latest/userguide/dataexports-migrate.html).

### Consolidated billing and cost allocation

**AWS Organizations** groups accounts for central management. In standard consolidated billing, the management account pays the combined bill, while usage is still attributable to the member account that incurred it. Eligible usage can be combined for volume tiers and eligible commitment discounts can be shared (see [4.1](#task-4-1)). To allocate costs internally, group by linked account for separate teams, use active tags for shared accounts, or use AWS Cost Categories to create business groupings. Consolidating payment does not merge the accounts or automatically label costs by project.

| Billing tag type | Who supplies it? | Example |
| --- | --- | --- |
| **AWS-generated** | AWS, or a Marketplace independent software vendor for supported vendor-metered tags. These keys use the `aws:` prefix. | `aws:createdBy` where supported. |
| **User-defined** | Your team defines and applies the key and value to supported resources. | `Project=TrainingPortal` or `CostCenter=Finance`. |

A resource tag is a key–value label. To use it in billing, **activate** its key as a cost allocation tag in Billing and Cost Management; the two types are activated separately. In an organization, use the management account for activation. Activated tags can appear in Cost Explorer and CUR/CUR 2.0 so costs can be grouped or filtered. Untagged or unsupported charges still exist. Do not assume activation labels past spend: an eligible backfill can expose existing historical values, but it cannot invent tags that were not on a resource.

**Example:** A school pays one bill for several accounts. The management account activates the `Project` tag. The finance team uses CUR 2.0 to allocate spend for two projects in a shared account and AWS Budgets to alert each project owner when spending is forecast to exceed a threshold.

Sources: [Organizations consolidated billing](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html), [cost allocation tags](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html), [tag backfill](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-allocation-backfill.html), [Cost Categories](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/manage-cost-categories.html).

## 4.3 — Identify AWS technical resources and AWS Support options

### Find official guidance or open a case

| Need | Where to look |
| --- | --- |
| Instructions, service behavior, or limits | [AWS Documentation](https://docs.aws.amazon.com/) for service guides and API references. |
| Architecture guidance and foundational explanations | [AWS Whitepapers and Guides](https://aws.amazon.com/whitepapers/). |
| Product announcements and worked examples | [AWS Blogs](https://aws.amazon.com/blogs/); check the date and verify current behavior in the service docs. |
| Migration, modernization, and deployment strategies or patterns | [AWS Prescriptive Guidance](https://aws.amazon.com/prescriptive-guidance/). |
| An AWS-authored answer to a common issue | [AWS Knowledge Center](https://repost.aws/knowledge-center), hosted on AWS re:Post. |
| Ask a question or search community answers | [AWS re:Post](https://repost.aws/). Public Q&A is not a private support case; do not post secrets. |
| Open, track, or reply to an AWS support case | [AWS Support Center](https://console.aws.amazon.com/support/home). Account and billing help is available to all customers; technical case options and response targets depend on plan and severity. |

### Current Support plans in the exam guide

| Option | Choose it for | Main distinction |
| --- | --- | --- |
| **Basic Support** | Self-service plus customer service for account or billing questions. | Included for all AWS customers. Documentation, whitepapers, AWS re:Post, core Trusted Advisor checks, and AWS Health Dashboard; no paid-plan technical case access or Health API. |
| **AWS Business Support+** | Production workloads that need 24/7 access to AWS technical experts. | Full Trusted Advisor checks and AWS Health API; no designated Technical Account Manager (TAM). |
| **AWS Enterprise Support** | Business-critical workloads that need proactive guidance and a designated AWS contact. | Designated TAM, faster critical-case response target than Business Support+, and Trusted Advisor Priority. |
| **AWS Unified Operations** | Mission-critical workloads that need enhanced support and incident management. | Adds designated domain specialist engineers and global Incident Management Engineer coverage, alongside a designated TAM. |

**Legacy and regional exceptions (separate from the table):** AWS lists January 1, 2027 as the end-of-support date for legacy Developer Support, Business Support, and Enterprise On-Ramp outside the stated **AWS GovCloud (US)** exception, where those plans remain available. In the transition, existing Developer and Business customers can switch to Business Support+; Enterprise On-Ramp customers transition to Enterprise Support in batches or at renewal during 2026. The separate **AWS China (Beijing and Ningxia)** support site lists Developer, Business, and Enterprise plans; check local availability rather than applying commercial plan names, features, or deadlines there. Identify plans by the capability and regional context; avoid unqualified minimum-plan rules during the transition.

Sources: [AWS Support plan comparison](https://aws.amazon.com/premiumsupport/plans/), [AWS Support case management](https://docs.aws.amazon.com/awssupport/latest/user/case-management.html), [legacy transition notice](https://docs.aws.amazon.com/awssupport/latest/user/support-plans-eos.html), [AWS China Support](https://www.amazonaws.cn/en/support/).

### Recommendations, service events, and escalation

| Need | Which resource? |
| --- | --- |
| Find possible savings and other best-practice improvements | **[AWS Trusted Advisor](https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html)** checks for opportunities across areas such as costs, security, and resilience. For example, review a recommendation about underutilized resources before making changes. Basic has core checks; eligible paid plans have a broader set. It recommends improvements; it does not forecast monthly spending or fix everything automatically. |
| See whether AWS has an ongoing service issue or scheduled change | **[AWS Health Dashboard](https://docs.aws.amazon.com/health/latest/ug/what-is-aws-health.html)** shows public service events and, when signed in, events and affected resources specific to your account. Use it to plan around maintenance and avoid unnecessary remediation. Available to all customers. |
| Retrieve Health events and affected entities in an operations tool | **[AWS Health API](https://docs.aws.amazon.com/health/latest/ug/health-api.html)** provides programmatic queries and integration with internal or third-party systems. Requires Business Support+, Enterprise Support, or Unified Operations under current plan names. AWS also documents access with legacy Business, Enterprise On-Ramp, or Enterprise Support where the newer plans are unavailable or the account has not transitioned. Health events can also be delivered via Amazon EventBridge without requiring Health API access. Health reports AWS events; it is not a rightsizing or cost-analysis tool. |
| Report abuse originating from AWS resources | **AWS Trust & Safety** via the [AWS abuse report form](https://aws.amazon.com/forms/report-abuse/). This is for misuse such as spam or abusive network traffic, not a billing dispute or ordinary outage. |
| Review a proposed architecture and choose AWS services | Ask **[AWS solutions architects](https://startups.aws.com/learn/meet-your-aws-account-team)** for design guidance through your AWS account team. They are not the same as a plan's designated TAM or the team handling a support case. |
| Get help delivering a scoped migration or implementation | Engage **[AWS Professional Services](https://aws.amazon.com/professional-services/)** for project-based consulting and hands-on delivery. This is separate from a support plan or an independent implementation partner. |

### AWS Partner Network versus AWS Marketplace

**[AWS Partner Network (APN)](https://aws.amazon.com/partners/)** is the AWS ecosystem of companies that build, sell, or deliver solutions. An **independent software vendor (ISV)** makes a product, such as a backup tool. A **systems integrator (SI)** helps design, connect, migrate, or implement systems; for example, integrating an identity provider during a migration. Find partners through [AWS Partner Solutions Finder](https://partners.amazonaws.com/). A Marketplace listing is a way to procure an offering, not a type of partner.

**Benefits of being a partner** are for qualifying partner organizations and their staff, not features a customer buys from that partner. These can include [training and certification support](https://aws.amazon.com/partners/funding/), [partner events](https://aws.amazon.com/partners/equip/), and program-specific commercial incentives, including eligible volume or growth discounts for resellers (see the [AWS Solution Provider Program](https://aws.amazon.com/partners/programs/solution-provider/)). Benefits are not automatic for every APN member. For example, [AWS channel program incentives](https://aws.amazon.com/blogs/apn/updates-to-aws-channel-programs-to-drive-growth-in-2026/) can depend on spend commitments.

| Marketplace capability | What it does |
| --- | --- |
| **Procurement** | [AWS Marketplace](https://docs.aws.amazon.com/marketplace/latest/buyerguide/what-is-marketplace.html) is a catalog to find and buy third-party software, data, and professional services. Review seller terms and any underlying AWS infrastructure charges. |
| **Cost management** | Use supported [purchase orders](https://docs.aws.amazon.com/marketplace/latest/buyerguide/buyer-purchase-orders.html) to tie transactions to procurement records, and active [cost allocation tags](https://docs.aws.amazon.com/marketplace/latest/buyerguide/cost-allocation-tagging.html) where supported to report software spend. |
| **Governance** | [Private Marketplace](https://docs.aws.amazon.com/marketplace/latest/buyerguide/private-marketplace-current.html) lets admins curate approved products by account group and handle requests for additions. This controls procurement; it does not revoke rights from existing subscriptions. |
| **Entitlements** | With [managed entitlements and AWS License Manager](https://docs.aws.amazon.com/marketplace/latest/buyerguide/sharing-licenses.html), a license represents a purchased right to use a product. For supported subscriptions, authorized admins can grant eligible licenses to AWS accounts or organizational units. An approved catalog item alone does not grant a license, and not all licenses are shareable. |

**Example:** A central team approves a third-party firewall in Private Marketplace, buys it, then grants its supported license to production accounts. Finance tracks charges using the purchase order and available tags. The ISV provides the firewall; an SI can help deploy it.

### Quick review

1. A batch job can resume after interruption. Which option targets the lowest EC2 compute cost without a term commitment? **Spot Instances.**
2. A finance lead needs a notification if next month's spending is forecast to be too high. Which tool fits? **AWS Budgets**; use **Cost Explorer** to investigate service-level trends, and **Pricing Calculator** to estimate an unbuilt replacement.
3. An operations team wants AWS maintenance event details in its own incident tool. Which resource fits? **AWS Health API**, subject to plan eligibility. Use **Trusted Advisor** instead to find potential waste.

### Further Reference (optional)

- [Billing, pricing, and support service reference](../service-reference/billing-pricing-support.md)
- [AWS Skill Builder CLF-C02 Exam Prep](https://skillbuilder.aws/category/exam-prep/cloud-practitioner-foundational-CLF-C02) and the [Official Practice Question Set](https://skillbuilder.aws/learn/E4W52ZKK6P/official-practice-question-set-aws-certified-cloud-practitioner-clfc02--english/RJSZKD3MG3?parentId=1J2VTQSGU2). The Skill Builder question content was not accessible in this verification; use the [public exam guide](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html) for format. The checks above are original.
