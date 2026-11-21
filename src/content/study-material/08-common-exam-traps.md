# Common exam traps

Read the final question, isolate its decisive condition, then evaluate each choice against that condition. Read the entire stem before selecting. On multiple-response items, decide whether each option individually fits and whether the chosen combination solves the whole problem.

| Tempting assumption | Better reasoning |
|---|---|
| Managed service means AWS owns every security task. | AWS takes over more infrastructure work, but the customer still owns its data, access, and configuration. |
| Monitoring, recording an API action, and evaluating a resource rule are equivalent. | Match metric/alert, API actor, or configuration/rule to the right tool. |
| Compliance documentation makes an application compliant. | Provider reports are evidence about AWS; the customer still has obligations. |
| A role is a permanent key or a permissions document. | A role is assumed and provides temporary credentials; a policy defines permissions. |
| One large instance is a high-availability design. | More capacity is not independent failure protection. |
| A Region, AZ, and edge location are three interchangeable places to deploy. | Match geography, isolation, or edge delivery to the requirement. |
| S3 and EBS are interchangeable because both store data. | Check whether the consumer needs objects, blocks, or a shared file system. |
| Every message should use a queue—or every event should use a topic. | Check whether workers pull work later, multiple subscribers receive a publication, or rules route events. |
| A reserved discount always guarantees capacity. | Regional RIs are discounts. Zonal RIs can include capacity; a standalone Capacity Reservation is not itself a discount. |
| A budget estimate is the same as a threshold or a line-item export. | Separate modeling a new workload, tracking a limit, looking at trends, and inspecting bill detail. |
| A legacy Support label gives a universal minimum-plan answer. | Read the documented capability, region, and transition caveat. |

Use the [comparison tables](06-service-comparison-tables.md) and [error-analysis template](07-final-revision-checklist.md#error-analysis--copy-once-per-missed-item-or-lucky-guess) after a practice attempt. Avoid memorizing keywords without context.

Official sources: [Exam guide](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html), [shared responsibility](https://aws.amazon.com/compliance/shared-responsibility-model/), [EC2 purchasing options](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html), [Support plans](https://aws.amazon.com/premiumsupport/plans/), and [revision history](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-revisions.html). Verified November 20, 2026 against revision **1.3**, published October 29, 2026.
