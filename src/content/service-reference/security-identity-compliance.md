# Security, Identity, and Compliance — service reference

Optional lookup for [Domain 2](../study-material/02-domain-2-security-compliance.md). Headings preserve the guide's inventory names. Ask what the team needs: AWS evidence, identity, keys/certificates/secrets, detection, investigation, or traffic protection.

## AWS Artifact

Retrieve AWS audit reports or review and manage certain agreements. Choose it for AWS assurance evidence, not a compliance verdict on your application. [Task 2.2](../study-material/02-domain-2-security-compliance.md#task-2-2) · [AWS documentation](https://aws.amazon.com/artifact/)

## AWS Certificate Manager (ACM)

Provision and manage TLS certificates for supported uses, such as HTTPS at a load balancer. Choose ACM for endpoint certificates, KMS for encryption key operations, or Secrets Manager for credential storage/rotation. Check certificate type and deployment requirements. [Task 2.2](../study-material/02-domain-2-security-compliance.md#task-2-2) · [AWS documentation](https://aws.amazon.com/certificate-manager/)

## AWS CloudHSM

Use dedicated hardware security modules when direct key and cryptographic operations control is required. You manage HSM users and keys; prefer ordinary KMS integration when it satisfies the requirement. [Task 2.2](../study-material/02-domain-2-security-compliance.md#task-2-2) · [AWS documentation](https://docs.aws.amazon.com/cloudhsm/latest/userguide/introduction.html)

## Amazon Cognito

Provide sign-up and sign-in for customers of a web or mobile application. For employee access to AWS accounts, choose IAM Identity Center. [Task 2.3](../study-material/02-domain-2-security-compliance.md#task-2-3) · [AWS documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html)

## Amazon Detective

Investigate a security finding by examining related events and entities. Choose GuardDuty for detection and Detective to understand the context behind a finding. [Task 2.4](../study-material/02-domain-2-security-compliance.md#task-2-4) · [AWS documentation](https://docs.aws.amazon.com/detective/latest/userguide/what-is-detective.html)

## AWS Directory Service

Use a managed Microsoft Active Directory or connect to an existing directory, depending on the option. Think corporate directory integration for Windows workloads, not customer-app logins. [Task 2.3](../study-material/02-domain-2-security-compliance.md#task-2-3) · [AWS documentation](https://aws.amazon.com/directoryservice/)

## AWS Firewall Manager

Apply supported firewall and security policies centrally across AWS accounts in an organization. Choose it for consistent administration at scale; use WAF to define which web requests match and how to handle them. [Task 2.4](../study-material/02-domain-2-security-compliance.md#task-2-4) · [AWS documentation](https://docs.aws.amazon.com/waf/latest/developerguide/fms-chapter.html)

## Amazon GuardDuty

Look for signs of threats such as suspicious use of AWS credentials. Findings signal activity to triage; choose Inspector for supported software vulnerability scans and Macie for sensitive data discovery in S3. [Task 2.4](../study-material/02-domain-2-security-compliance.md#task-2-4) · [AWS documentation](https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html)

## AWS Identity and Access Management (IAM)

Define which principals can perform which actions on AWS resources. Prefer short-lived role credentials and grant only what is needed. A policy defines permissions, while a group collects IAM users and a role is assumed for a session. [Task 2.3](../study-material/02-domain-2-security-compliance.md#task-2-3) · [AWS documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

## AWS IAM Identity Center

**Former name:** AWS Single Sign-On. Centralize workforce access to accounts and applications, typically through groups and permission sets. Use Cognito for application customers, not for giving staff console access. [Task 2.3](../study-material/02-domain-2-security-compliance.md#task-2-3) · [AWS documentation](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html)

## Amazon Inspector

Find software vulnerabilities and applicable exposure for supported workloads such as EC2, ECR images, and Lambda. An outdated software package points to Inspector, not GuardDuty. You own remediation for the components you operate. [Task 2.4](../study-material/02-domain-2-security-compliance.md#task-2-4) · [AWS documentation](https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html)

## AWS Key Management Service (AWS KMS)

Create and control encryption keys and use them for cryptographic operations or with compatible AWS services. Choose it for key control on stored data, not TLS certificate issuance or secret rotation. [Task 2.2](../study-material/02-domain-2-security-compliance.md#task-2-2) · [AWS documentation](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html)

## Amazon Macie

Discover sensitive data in Amazon S3 and assess S3 data security risks. For example, find objects that appear to contain personal identifiers. It does not scan arbitrary databases; discovery has coverage and pricing considerations. [Task 2.4](../study-material/02-domain-2-security-compliance.md#task-2-4) · [AWS documentation](https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html)

## AWS Resource Access Manager (AWS RAM)

Share supported resource types without duplicating them or distributing credentials. For example, share VPC subnets with participant accounts in the organization. Check resource-specific sharing rules and applicable permissions. [Task 2.4](../study-material/02-domain-2-security-compliance.md#task-2-4) · [AWS documentation](https://docs.aws.amazon.com/ram/latest/userguide/what-is.html)

## AWS Secrets Manager

Store and retrieve secrets such as a database password; configure rotation when supported and needed. Do not put secrets in source code. Compare Systems Manager Parameter Store for configuration values and KMS for key operations. [Task 2.3](../study-material/02-domain-2-security-compliance.md#task-2-3) · [AWS documentation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)

## AWS Security Hub

Prioritize and respond to security issues by correlating findings into exposures. AWS Security Hub CSPM is a complementary AWS service, not an alias for current Security Hub: it evaluates posture against controls and standards and consolidates findings. Neither replaces the underlying detectors or certifies compliance. [Task 2.4](../study-material/02-domain-2-security-compliance.md#task-2-4) · [AWS documentation](https://docs.aws.amazon.com/securityhub/latest/userguide/what-are-securityhub-services.html)

## AWS Shield

Protect against distributed denial-of-service attacks. Standard is automatic at no additional cost; Advanced is a paid option for enhanced protection of eligible resources. Use WAF for application-layer request matching and filtering. [Task 2.4](../study-material/02-domain-2-security-compliance.md#task-2-4) · [AWS documentation](https://aws.amazon.com/shield/)

## AWS WAF

Filter HTTP(S) requests for supported application endpoints. Choose it for web traffic rules, such as blocking requests matching a known malicious pattern; use Shield for a DDoS protection requirement and Firewall Manager for centrally deploying supported policies. [Task 2.4](../study-material/02-domain-2-security-compliance.md#task-2-4) · [AWS documentation](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html)

**Verified November 20, 2026:** [In-scope inventory](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html), [Domain 2 tasks](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain2.html), and [CLF-C02 exam guide revision 1.3](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html) (October 29, 2026). Related audit and monitoring tools are in [Management and Governance](management-governance.md).
