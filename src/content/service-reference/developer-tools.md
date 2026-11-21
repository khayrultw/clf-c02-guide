# Developer tools

Optional revision reference. CLF-C02 exam guide [revision **1.3 (October 29, 2026)**](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html); verified **November 20, 2026**. Primary lesson: [3.1 — Access and operations](../study-material/03-domain-3-cloud-technology-services.md#task-3-1) and [3.8 — Developer tools](../study-material/03-domain-3-cloud-technology-services.md#task-3-8).

## AWS CLI

[Terminal interface](https://aws.amazon.com/cli/) for AWS APIs and scripts. Choose for operator actions and repeatable command sequences; an SDK is better for application code, and a CloudFormation template describes infrastructure declaratively. Use authorized identities rather than embedding credentials. Primary task: [3.1](../study-material/03-domain-3-cloud-technology-services.md#task-3-1).

## AWS CodeBuild

[Managed build and test jobs](https://aws.amazon.com/codebuild/) turn source into artifacts. Choose to compile and test, not coordinate a release across services. AWS manages build infrastructure; you manage build contents, permissions, and resource use. Primary task: [3.8](../study-material/03-domain-3-cloud-technology-services.md#task-3-8).

## AWS CodePipeline

[Continuous delivery orchestration](https://aws.amazon.com/codepipeline/) coordinates actions such as source retrieval, build, approval, and deployment. It can invoke CodeBuild but is not itself the compiler or test runner. Primary task: [3.8](../study-material/03-domain-3-cloud-technology-services.md#task-3-8).

## AWS X-Ray

[Distributed tracing](https://aws.amazon.com/xray/) shows request paths and timing across services, useful for finding a slow dependency. It does not audit AWS API calls. AWS recommends OpenTelemetry for instrumentation; the [legacy X-Ray SDKs and daemon are in maintenance](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-daemon-timeline.html), not the tracing service itself. Primary task: [3.8](../study-material/03-domain-3-cloud-technology-services.md#task-3-8).
