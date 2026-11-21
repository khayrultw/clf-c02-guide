# Application integration and business applications

Optional revision reference. CLF-C02 exam guide [revision **1.3 (October 29, 2026)**](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html); verified **November 20, 2026**. Primary lesson: [3.8 — Other in-scope services](../study-material/03-domain-3-cloud-technology-services.md#task-3-8).

## Amazon EventBridge

[Routes events](https://aws.amazon.com/eventbridge/) to targets by pattern, such as sending canceled orders to a refund service. Use SQS when the need is a queue of work, or Step Functions when the need is to coordinate workflow state.

## Amazon Simple Notification Service (Amazon SNS)

[Publish/subscribe messaging](https://aws.amazon.com/sns/) pushes a message to multiple configured subscribers, such as queues and email recipients. Choose for fan-out and alerts; use SES for branded transactional email. Restrict who can publish to the topic.

## Amazon Simple Queue Service (Amazon SQS)

[Managed queues](https://aws.amazon.com/sqs/) buffer messages until consumers process them. Use to decouple senders and workers and absorb bursts. Standard queues can deliver a message more than once, so consumers should tolerate duplicates.

## AWS Step Functions

[Stateful workflow orchestration](https://aws.amazon.com/step-functions/) for branches, retries, and sequences across services. Choose for an approval-and-payment workflow; EventBridge decides where events go but does not replace the workflow's state management.

## Amazon Connect (now Amazon Connect Customer)

Cloud contact center for calls, chat, routing, and agent tools, not bulk email. [AWS now uses Amazon Connect for the wider portfolio](https://docs.aws.amazon.com/connect/latest/APIReference/Welcome.html). Control agent access and customer data retention.

## Amazon Simple Email Service (Amazon SES)

[Application email](https://aws.amazon.com/ses/) for transactions or campaigns, such as order receipts. Unlike a contact center or generic notification fan-out, SES is email-focused; sending identities, reputation, and consent are the sender's responsibility.
