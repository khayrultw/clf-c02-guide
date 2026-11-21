# Networking and content delivery

Optional revision reference. CLF-C02 exam guide [revision **1.3 (October 29, 2026)**](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html); verified **November 20, 2026**. Primary lesson: [3.5 — Networking](../study-material/03-domain-3-cloud-technology-services.md#task-3-5).

## Amazon VPC

[Logically isolated regional network](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) whose subnets each occupy one AZ. Route tables and gateways determine paths. Security groups are stateful and allow only; network ACLs are stateless, allow or deny, and apply at subnet level.

## Amazon Route 53

[Managed DNS](https://aws.amazon.com/route53/) with domain registration, routing policies, and health checks. Choose to resolve a name or select a DNS destination, not to serve cached assets.

## AWS VPN

[Managed encrypted connectivity](https://aws.amazon.com/vpn/) covers network-to-network and user-to-network access. Choose based on the endpoints, not just the word “remote.”

## AWS Site-to-Site VPN

[IPsec tunnels](https://aws.amazon.com/vpn/site-to-site-vpn/) between networks. Example: link a branch-office network to AWS, commonly over the internet. This is distinct from individual client access.

## AWS Client VPN

[Managed client-based VPN](https://aws.amazon.com/vpn/client-vpn/) for remote users. Example: a staff member's laptop connects to private resources. Still authorize users and scope network access.

## AWS Direct Connect

[Dedicated private connection](https://aws.amazon.com/directconnect/) for more predictable connectivity than typical internet VPN paths. It is not encrypted by default merely because it is private; consider provisioning time, cost, and redundant connections.

## AWS Transit Gateway

[Regional routing hub](https://aws.amazon.com/transit-gateway/) connecting multiple VPCs and on-premises networks. Choose to centralize routing rather than create many individual network links; attachments and traffic can incur charges.

## AWS PrivateLink

[Private service access through VPC endpoints](https://aws.amazon.com/privatelink/) without broad network-to-network routing. Choose when consumers need a specific service, not connectivity to the provider's entire network.

## Amazon CloudFront

[Edge content delivery and caching](https://aws.amazon.com/cloudfront/). Choose to deliver website images and downloads closer to viewers; Amazon Route 53 resolves names and AWS Global Accelerator optimizes network paths without caching. See also [3.2 — Edge locations](../study-material/03-domain-3-cloud-technology-services.md#task-3-2).

## AWS Global Accelerator

[Static anycast IPs and optimized network paths](https://aws.amazon.com/global-accelerator/) to healthy regional application endpoints. Choose for improved TCP/UDP connectivity when cache hits are not the goal.

## Amazon API Gateway

[Publishes and manages APIs](https://aws.amazon.com/api-gateway/) with features such as authorization and throttling. Example: expose an endpoint backed by Lambda. Request or connection usage can incur charges; it is not a VPC internet gateway.
