# Compute

Optional revision reference. CLF-C02 exam guide [revision **1.3 (October 29, 2026)**](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html); verified **November 20, 2026**. Primary lesson: [3.3 — Compute](../study-material/03-domain-3-cloud-technology-services.md#task-3-3).

## Amazon EC2

[Virtual servers](https://aws.amazon.com/ec2/) with guest OS control. Choose compute optimized for CPU-bound work, memory optimized for large in-memory data, or storage optimized for heavy local I/O. The customer patches the guest and manages attached resources; running capacity and storage incur charges.

## AWS Batch

[Queues and schedules batch jobs](https://aws.amazon.com/batch/), such as nightly rendering, rather than serving live web requests. Pay for the underlying resources running the jobs.

## AWS Elastic Beanstalk

[Managed application environments](https://aws.amazon.com/elasticbeanstalk/) for developers who want infrastructure provisioned for a web app. You own the app and configuration and pay for resources created; use EC2 directly when you need more infrastructure control.

## Amazon Lightsail

[Simplified virtual servers](https://aws.amazon.com/lightsail/) with bundled plans. Good for a starter site when predictable bundles matter more than the flexibility of EC2.

## AWS Outposts

[Extends supported AWS services to a customer site](https://aws.amazon.com/outposts/) when workloads must stay near equipment or local data. AWS manages the Outposts hardware; the customer provides suitable facilities and connectivity to the parent Region. See also [3.1 — Deployment models](../study-material/03-domain-3-cloud-technology-services.md#task-3-1).

## AWS Auto Scaling and Amazon EC2 Auto Scaling

[EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) changes instance counts with demand and can replace unhealthy instances. The guide also lists AWS Auto Scaling, associated with [scaling plans](https://docs.aws.amazon.com/autoscaling/plans/userguide/migrate-scaling-plan.html) for supported resources. Scaling changes capacity, not traffic routes; additional capacity can cost more.

## Elastic Load Balancing

[Distributes traffic across healthy targets](https://aws.amazon.com/elasticloadbalancing/); choose an Application Load Balancer for HTTP routing or a Network Load Balancer for transport-layer traffic. Pair it with scaling if the fleet must also grow or shrink.
