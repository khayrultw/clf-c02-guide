export const learnPages = [
  {
    slug: 'exam-overview',
    title: 'Exam Overview',
    source: 'study-material/00-exam-overview.md',
    weight: null
  },
  {
    slug: 'student-study-plan',
    title: 'Student Study Plan',
    source: 'study-material/09-student-study-plan.md',
    weight: null
  },
  {
    slug: 'cloud-concepts',
    title: 'Cloud Concepts',
    source: 'study-material/01-domain-1-cloud-concepts.md',
    weight: 24
  },
  {
    slug: 'security-compliance',
    title: 'Security and Compliance',
    source: 'study-material/02-domain-2-security-compliance.md',
    weight: 30
  },
  {
    slug: 'cloud-technology-services',
    title: 'Cloud Technology and Services',
    source: 'study-material/03-domain-3-cloud-technology-services.md',
    weight: 34
  },
  {
    slug: 'billing-pricing-support',
    title: 'Billing, Pricing, and Support',
    source: 'study-material/04-domain-4-billing-pricing-support.md',
    weight: 12
  }
]

export const reviewPages = [
  { slug: 'scope-guide', title: 'Exam Scope', source: 'study-material/05-in-scope-out-of-scope.md' },
  { slug: 'comparisons', title: 'Service Comparisons', source: 'study-material/06-service-comparison-tables.md' },
  { slug: 'checklist', title: 'Final Revision Checklist', source: 'study-material/07-final-revision-checklist.md' },
  { slug: 'common-traps', title: 'Common Exam Traps', source: 'study-material/08-common-exam-traps.md' }
]

export const referencePages = [
  { slug: 'analytics-ai-ml', title: 'Analytics and AI/ML', category: 'Analytics and AI', source: 'service-reference/analytics-ai-ml.md' },
  { slug: 'application-integration', title: 'Application Integration', category: 'Application', source: 'service-reference/application-integration.md' },
  { slug: 'billing-pricing-support', title: 'Billing, Pricing, and Support', category: 'Billing', source: 'service-reference/billing-pricing-support.md' },
  { slug: 'compute', title: 'Compute', category: 'Infrastructure', source: 'service-reference/compute.md' },
  { slug: 'containers-serverless', title: 'Containers and Serverless', category: 'Infrastructure', source: 'service-reference/containers-serverless.md' },
  { slug: 'databases', title: 'Databases', category: 'Data', source: 'service-reference/databases.md' },
  { slug: 'developer-tools', title: 'Developer Tools', category: 'Developer', source: 'service-reference/developer-tools.md' },
  { slug: 'end-user-computing', title: 'End-User Computing', category: 'Productivity', source: 'service-reference/end-user-computing.md' },
  { slug: 'frontend-mobile-iot', title: 'Frontend, Mobile, and IoT', category: 'Application', source: 'service-reference/frontend-mobile-iot.md' },
  { slug: 'management-governance', title: 'Management and Governance', category: 'Management', source: 'service-reference/management-governance.md' },
  { slug: 'migration-transfer', title: 'Migration and Transfer', category: 'Data', source: 'service-reference/migration-transfer.md' },
  { slug: 'networking-content-delivery', title: 'Networking and Content Delivery', category: 'Infrastructure', source: 'service-reference/networking-content-delivery.md' },
  { slug: 'security-identity-compliance', title: 'Security, Identity, and Compliance', category: 'Security', source: 'service-reference/security-identity-compliance.md' },
  { slug: 'storage', title: 'Storage', category: 'Data', source: 'service-reference/storage.md' }
]

export const examDomains = [
  { id: '1', title: 'Cloud Concepts', slug: 'cloud-concepts' },
  { id: '2', title: 'Security and Compliance', slug: 'security-compliance' },
  { id: '3', title: 'Cloud Technology and Services', slug: 'cloud-technology-services' },
  { id: '4', title: 'Billing, Pricing, and Support', slug: 'billing-pricing-support' }
]

export const allPages = [
  ...learnPages.map((page) => ({ ...page, base: 'learn' })),
  ...reviewPages.map((page) => ({ ...page, base: 'review' })),
  ...referencePages.map((page) => ({ ...page, base: 'reference' }))
]

// Maps a package path such as "study-material/01-domain-1-cloud-concepts.md" to its site route.
export function routeForSource(source) {
  const page = allPages.find((entry) => entry.source === source)
  return page ? `/${page.base}/${page.slug}` : null
}
