# Databases

Optional revision reference. CLF-C02 exam guide [revision **1.3 (October 29, 2026)**](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html); verified **November 20, 2026**. Primary lesson: [3.4 — Databases](../study-material/03-domain-3-cloud-technology-services.md#task-3-4).

## Amazon RDS

[Managed relational databases](https://aws.amazon.com/rds/) for conventional SQL engines and transactional workloads. Compared with self-managed databases on EC2, RDS takes on routine infrastructure maintenance and offers managed backup options; customers still own data, schema, and access.

## Amazon Aurora

[An AWS-built relational engine](https://aws.amazon.com/rds/aurora/) offered through RDS with MySQL or PostgreSQL compatibility and a distributed storage architecture. Choose for relational access with Aurora-specific scale or availability features; confirm feature compatibility rather than assuming every engine feature is identical.

## Amazon DynamoDB

[Serverless key-value and document database](https://aws.amazon.com/dynamodb/). Choose for predictable key-based access to carts or sessions, not relational joins. Throughput and storage affect charges.

## Amazon ElastiCache

[Managed in-memory cache](https://aws.amazon.com/elasticache/) supporting Valkey, Redis OSS, and Memcached options. Choose to reduce latency or load on a backing database; do not assume an in-memory cache provides the same persistence guarantees as the source database.

## Amazon Neptune

[Managed graph database](https://aws.amazon.com/neptune/) for relationships such as fraud links or product recommendations. Choose when traversing relationships, not simply fetching records by key.

## Amazon DocumentDB

[Managed document database with MongoDB compatibility](https://aws.amazon.com/documentdb/) for flexible documents such as product catalogs. Check application-level compatibility. Contrast with DynamoDB for workloads designed primarily around key-based access.
