# Analytics, artificial intelligence, and machine learning

Optional revision reference. CLF-C02 exam guide [revision **1.3 (October 29, 2026)**](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html); verified **November 20, 2026**. Primary lesson: [3.7 — AI/ML and analytics](../study-material/03-domain-3-cloud-technology-services.md#task-3-7).

## Amazon Athena

[Serverless SQL](https://aws.amazon.com/athena/) over data such as S3 files, for example ad hoc log analysis. For typical SQL usage, scanned bytes drive cost. Use a warehouse when the scenario calls for a dedicated analytical data model and repeated warehouse workloads.

## Amazon EMR

[Managed big-data processing](https://aws.amazon.com/emr/) with frameworks such as Apache Spark. Use for large-scale processing with framework-specific control, not for serving dashboards. Compute choice and runtime affect cost.

## AWS Glue

[Serverless data integration](https://aws.amazon.com/glue/): catalog metadata and run ETL jobs. Choose to clean and catalog data for Athena or a warehouse; Glue isn't the end-user dashboard.

## Amazon Kinesis

[Amazon Kinesis Data Streams](https://aws.amazon.com/kinesis/data-streams/) captures real-time streams for processing, such as click events; distinguish it from querying finished data files. Throughput and retention needs affect cost.

## Amazon OpenSearch Service

[Managed search and analytics](https://aws.amazon.com/opensearch-service/) for indexed data such as application logs. Choose for full-text search and log exploration rather than transaction processing.

## Amazon Quick (now AWS Quick)

[The renamed AWS Quick](https://aws.amazon.com/about-aws/whats-new/2026/11/amazon-quick-aws-quick/) includes AWS Quick Sight, the former Amazon Quick Sight/QuickSight BI capability. Choose it for business dashboards and visualizations, not for storing or transforming raw data. Keep dataset and dashboard permissions aligned with intended audiences.

## Amazon Redshift

[Managed SQL data warehouse](https://aws.amazon.com/redshift/) for analytics across large datasets. Choose for recurring analytical queries that combine datasets, not for day-to-day transactional order entry.

## Amazon Comprehend

[Natural-language processing](https://aws.amazon.com/comprehend/) of existing text, such as extracting entities or detecting sentiment in customer feedback. Use Amazon Translate to convert languages and Amazon Textract to extract structured fields from document images.

## Amazon Lex

[Conversational interfaces](https://aws.amazon.com/lex/) that interpret voice or text intent. Choose for an order status bot that needs dialogue, not simply a transcript.

## Amazon Polly

[Text-to-speech](https://aws.amazon.com/polly/), such as narrating text. Transcribe works in the other direction.

## Amazon Q

[Amazon Q Business](https://aws.amazon.com/q/business/) answers questions from authorized business sources; it is closed to new customers, and AWS points new customers to AWS Quick. Amazon Q Developer is associated with developer assistance; [in the AWS console and console mobile apps it is now the AWS assistant](https://aws.amazon.com/about-aws/whats-new/2026/11/q-developer-renamed-aws-assistant/). Neither is the service for training custom ML models.

## Amazon Rekognition

[Image and video analysis](https://aws.amazon.com/rekognition/) for visual labels, people, or objects. Use for visual content, not structured extraction of tables and fields from documents. Apply appropriate access and privacy controls.

## Amazon SageMaker AI

[Build, train, and deploy ML models](https://aws.amazon.com/sagemaker/ai/). Use for custom forecasting or classification when a prebuilt service does not meet the need; you still own model quality and data governance, and resources used incur charges.

## Amazon Textract

[Document data extraction](https://aws.amazon.com/textract/) for text, forms, and tables in scanned documents. Use for invoice data rather than sentiment or general photo labeling. Validate extracted fields for important decisions.

## Amazon Transcribe

[Speech-to-text](https://aws.amazon.com/transcribe/), such as captions from a recording. Use Polly to create audio from text and Translate to convert languages.

## Amazon Translate

[Text translation](https://aws.amazon.com/translate/) between languages. Use it for localized text rather than converting audio into text. Check translated outputs where accuracy matters.
