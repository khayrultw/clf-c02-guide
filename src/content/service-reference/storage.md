# Storage and recovery

Optional revision reference. CLF-C02 exam guide [revision **1.3 (October 29, 2026)**](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html); verified **November 20, 2026**. Primary lesson: [3.6 — Storage](../study-material/03-domain-3-cloud-technology-services.md#task-3-6).

## Amazon S3

[Object storage](https://aws.amazon.com/s3/) for logs, backups, static assets, or data-lake files. Choose classes by access frequency, restore time, and AZ resilience; lifecycle rules can transition or expire objects. Protect bucket access and account for requests, retrieval, and transitions, not just storage.

## Amazon S3 Glacier

[S3 archive classes](https://aws.amazon.com/s3/storage-classes/): Instant Retrieval for millisecond access, Flexible Retrieval when restore can take minutes or hours, and Deep Archive for long-term retention with restore in hours. Check minimum storage duration and retrieval charges.

## Amazon Elastic Block Store (Amazon EBS)

[Persistent block volumes](https://aws.amazon.com/ebs/) for EC2 in the same AZ. Good for boot or database disks. Check delete-on-termination settings and snapshot needs; charges can continue for retained volumes. [EC2 instance store](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html) is temporary local storage for scratch data, not a durable substitute.

## Amazon Elastic File System (Amazon EFS)

[Managed NFS file storage](https://aws.amazon.com/efs/) for shared Linux workloads. Choose a shared file system over an EC2 boot disk; check access permissions and whether Regional or One Zone resilience fits.

## Amazon FSx

[Managed file systems](https://aws.amazon.com/fsx/) for workloads needing specific protocols or features: Windows File Server for SMB, Lustre for high-performance file workloads, and NetApp ONTAP and OpenZFS for their respective file system capabilities. Choose by protocol and workload, not by the generic word “storage.”

## AWS Storage Gateway

[Hybrid storage](https://aws.amazon.com/storagegateway/), such as S3 File Gateway for on-premises NFS/SMB access with a local cache backed by S3 objects. Use when existing systems need a familiar local interface to cloud storage.

## AWS Backup

[Centralized backup policies](https://aws.amazon.com/backup/) across supported resources. Choose for scheduled backup and retention with restoration, not automatic application failover. Backup copies incur storage charges and need controlled access.

## AWS Elastic Disaster Recovery

[Continuous server block replication and recovery into AWS](https://aws.amazon.com/disaster-recovery/). Choose when minimizing server recovery time and data loss matters. Unlike AWS Backup, its focus is recovering workloads after an outage rather than enforcing backup retention across services.
