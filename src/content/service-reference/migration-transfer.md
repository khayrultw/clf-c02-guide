# Migration and transfer

Optional revision reference. CLF-C02 exam guide [revision **1.3 (October 29, 2026)**](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html); verified **November 20, 2026**. Primary lesson: [3.4 — Databases, migration, and transfer](../study-material/03-domain-3-cloud-technology-services.md#task-3-4).

## AWS Application Discovery Service

Collects an inventory of local servers and information such as utilization and dependencies before migration. [Closed to new customers November 7, 2025](https://docs.aws.amazon.com/application-discovery/latest/userguide/application-discovery-service-availability-change.html); existing customers can finish ongoing projects and AWS recommends AWS Transform for new ones. Discovery does not copy servers to AWS.

## AWS Application Migration Service (AWS Transform MGN)

[Renamed AWS Transform MGN](https://aws.amazon.com/about-aws/whats-new/2026/06/aws-transform-mgn-rebrand/). Choose for replication and rehosting of physical or virtual servers, not database schema conversion. The broader AWS Transform experience can also help plan and automate wider migrations.

## AWS Database Migration Service (AWS DMS)

[Moves database data](https://aws.amazon.com/dms/) between supported systems and can replicate ongoing changes to reduce downtime. Size for the migration workload and secure access to both ends; schema conversion is a separate concern when changing engines.

## Migration Evaluator

[Builds a migration business case](https://aws.amazon.com/migration-evaluator/) using measured utilization and AWS cost projections. Use it for sizing and cost estimates, not to perform cutover or provide a guaranteed bill.

## AWS Migration Hub

Tracks the status of migrations across tools. [Closed to new customers November 7, 2025](https://docs.aws.amazon.com/migrationhub/latest/ug/migrationhub-availability-change.html); existing customers can finish ongoing projects and AWS recommends AWS Transform for equivalent capabilities. A progress dashboard is not a replication engine.

## AWS Schema Conversion Tool (AWS SCT)

[Assesses and converts database schemas and code](https://docs.aws.amazon.com/SchemaConversionTool/latest/userguide/CHAP_Welcome.html) when changing engines, for example from Oracle to PostgreSQL. Review unsupported conversions; use DMS to migrate the rows. DMS Schema Conversion is a separate managed feature for supported conversions.
