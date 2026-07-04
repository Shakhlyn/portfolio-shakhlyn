# Personal Portfolio Website PRD

## 1. Overview

### Product

A personal portfolio website supporting a job search for full-stack and AI engineering roles.

### Goal

Help recruiters, hiring managers, and peer engineers quickly understand role fit, technical credibility, project depth, career narrative, and how to contact the candidate.

### Product Principle

The site should behave like a proof-of-work product, not a decorative resume. It must communicate engineering judgment, product thinking, execution ability, and clarity within a short scan.

## 2. User Personas

### Recruiter / Talent Sourcer

Recruiters and sourcers are screening for quick role alignment, relevant keywords, resume access, location or availability signals if provided, and contact paths. They are unlikely to inspect implementation details deeply during the first pass.

Primary needs:

- Understand target role within seconds.
- Confirm relevant technologies and AI/full-stack fit.
- Access resume quickly.
- Find LinkedIn, GitHub, and email.
- Identify standout projects or signals worth forwarding to a hiring manager.

Success outcome:

- Recruiter can decide whether to contact or shortlist the candidate in under 90 seconds.

### Hiring Manager / Tech Lead

Hiring managers and tech leads are evaluating practical engineering capability, ownership, problem-solving, communication, and whether the candidate can build production-quality software.

Primary needs:

- Understand what kinds of problems the candidate solves.
- Evaluate project case studies for problem, approach, stack, tradeoffs, and outcome.
- Assess full-stack and AI engineering depth.
- See evidence of clear technical communication.
- Access GitHub or live demos for deeper review.

Success outcome:

- Hiring manager believes the candidate is worth an interview because the portfolio demonstrates relevant, applied engineering ability.

### Peer Engineer / Networking Contact

Peer engineers may arrive through GitHub, LinkedIn, referrals, communities, or direct networking. They are scanning for authenticity, technical overlap, project quality, and conversation starters.

Primary needs:

- Understand the candidate's interests and technical direction.
- Inspect projects, source code, demos, or writing.
- See credible engineering practices and thoughtful decisions.
- Find a direct way to connect.

Success outcome:

- Peer engineer has enough context to start a meaningful conversation, refer the candidate, or share the portfolio.

## 3. Core Feature Modules

### Hero / Intro

Purpose:

- Establish identity, target role, and value proposition immediately.

Requirements:

- Candidate name.
- Clear role framing for full-stack / AI engineering.
- Concise value proposition.
- Primary CTA to view projects.
- Secondary CTA to download resume.
- Direct links to GitHub, LinkedIn, and email.
- Dark/light theme support.
- Responsive layout across mobile, tablet, and desktop.

### Projects Showcase

Purpose:

- Demonstrate applied engineering ability through case studies.

Requirements:

- Featured project cards or sections.
- Each project must include:
  - Project name.
  - One-line summary.
  - Problem.
  - Approach.
  - Stack.
  - Outcome.
  - Links where available: live demo, GitHub repository, case study, or write-up.
- Projects should be ordered by relevance to full-stack / AI engineering roles.
- Empty or unavailable links must not render as dead links.

### About / Bio

Purpose:

- Explain the candidate's career narrative and make a non-traditional background a differentiator.

Requirements:

- Short narrative describing current direction.
- Relevant background and transition story.
- Clear connection between background and engineering strengths.
- Tone should be credible, direct, and hiring-oriented.
- No fabricated achievements, metrics, company names, or credentials.

### Skills / Tech Stack

Purpose:

- Help scanners quickly match the candidate against role requirements.

Requirements:

- Group skills by capability rather than using an unstructured keyword cloud.
- Recommended groups:
  - Frontend.
  - Backend.
  - AI / LLM.
  - Data / databases.
  - Infrastructure / deployment.
  - Engineering practices.
- Skills must reflect actual experience or comfort level.
- Avoid overclaiming expertise.

### Resume

Purpose:

- Make formal screening easy.

Requirements:

- Resume must be viewable in-browser.
- Resume must be downloadable as a PDF.
- Resume CTA must be present in the hero and accessible from navigation.
- Download link must use a stable file path.
- Resume content must match or complement the portfolio content.

### Contact

Purpose:

- Remove friction from outreach.

Requirements:

- Email link.
- LinkedIn link.
- GitHub link.
- Optional contact form only if reliable submission, loading, success, and error states are implemented.
- Contact section should clearly communicate preferred contact method if applicable.

### Theme Support

Purpose:

- Provide a polished user experience across viewing contexts.

Requirements:

- Dark and light modes.
- Theme toggle must be keyboard accessible.
- Theme preference should persist locally where feasible.
- Site must remain readable and visually coherent in both themes.

### Optional Blog / Writing

Purpose:

- Demonstrate technical communication and deeper engineering thinking.

Requirements:

- Include only if at least two credible technical posts are available or planned for launch.
- Posts should support the target role.
- Empty blog states or placeholder-only blogs should not be shown in v1.

## 4. User Journeys

### Recruiter / Talent Sourcer Journey

Scan order:

1. Hero: name, target role, value proposition.
2. Skills: quick technology and keyword match.
3. Projects: high-level proof that skills are applied.
4. Resume: download or open for formal screening.
5. Contact: email or LinkedIn.

What makes them stay:

- Role fit is obvious above the fold.
- Resume is easy to find.
- Skills match open roles.
- Projects have concise summaries and recognizable technology.
- Contact paths are direct.

What makes them bounce:

- Target role is unclear.
- Resume is hidden or unavailable.
- Project section is vague or link-only.
- Important information is buried behind heavy animation or visual noise.
- Contact information is missing.

### Hiring Manager / Tech Lead Journey

Scan order:

1. Hero: role focus and credibility signal.
2. Featured projects: problem, approach, stack, outcome.
3. Project links: live demos, GitHub, or detailed case studies.
4. About: career narrative and motivation.
5. Skills: technical breadth and role alignment.
6. Resume and contact.

What makes them stay:

- Projects show ownership and practical problem solving.
- Case studies explain tradeoffs, not just final outputs.
- Stack choices are clear and relevant.
- Outcomes are specific and honest.
- Source code or live demos support the claims.
- The site itself is fast, accessible, responsive, and well-built.

What makes them bounce:

- Projects read like shallow gallery items.
- Claims are unsupported by demos, code, or clear explanation.
- Site has obvious quality issues, broken links, poor mobile layout, or accessibility problems.
- Bio feels generic or inflated.
- Technical scope is unclear.

### Peer Engineer / Networking Contact Journey

Scan order:

1. Hero: current engineering focus.
2. Projects: technical overlap and interesting work.
3. GitHub links: code quality and implementation details.
4. About: personal context and career direction.
5. Blog or writing if available.
6. Contact or social links.

What makes them stay:

- Projects provide enough detail to start a technical conversation.
- Code and demos are easy to access.
- The candidate's interests are clear.
- Writing or project notes show thoughtful engineering judgment.
- Contact options are low-friction.

What makes them bounce:

- Portfolio feels generic or template-heavy.
- Projects lack technical specificity.
- GitHub links are missing for work that should be inspectable.
- No clear way to connect.
- Blog exists but is empty or low-quality.

## 5. Non-Functional Requirements

### Performance

Targets:

- Lighthouse Performance: 95+ on mobile.
- Lighthouse Accessibility: 95+.
- Lighthouse Best Practices: 95+.
- Lighthouse SEO: 95+.
- Initial route JavaScript target: under approximately 200KB gzipped.
- Largest Contentful Paint target: under 2.5 seconds on a typical mobile connection.
- Cumulative Layout Shift target: below 0.1.
- Interaction to Next Paint target: below 200ms.

Requirements:

- Use optimized image formats such as WebP or AVIF.
- Provide explicit image dimensions to prevent layout shift.
- Lazy-load below-the-fold images.
- Avoid unnecessary dependencies.
- Keep animations lightweight and limited to transform and opacity.
- Respect `prefers-reduced-motion`.

### Accessibility

Requirements:

- Semantic HTML structure.
- One logical `h1` per page.
- Keyboard navigable interactive elements.
- Visible focus states.
- WCAG AA color contrast in dark and light themes.
- Meaningful image alt text, or empty alt text for decorative images.
- No keyboard traps.
- Contact links and buttons must have clear accessible names.
- Motion must be reduced or disabled for users who prefer reduced motion.

### SEO

Requirements:

- Descriptive page title.
- Meta description focused on full-stack / AI engineering positioning.
- Open Graph metadata for link previews.
- Structured heading hierarchy.
- Human-readable URLs for project detail pages if included.
- Resume and project content should be crawlable where practical.
- No empty placeholder pages indexed.

### Cross-Device Support

Requirements:

- Responsive from 320px to 1920px.
- No horizontal scrolling.
- No text overlap or clipped CTAs.
- Navigation usable on mobile, tablet, and desktop.
- Touch targets should be at least 44px where practical.
- Layout must work in current stable versions of Chrome, Safari, Firefox, and Edge.
- Theme toggle, resume links, project links, and contact links must work on mobile.

### Reliability

Requirements:

- No broken internal links.
- No dead project, resume, or contact links.
- 404 route required if multiple routes are used.
- App or route-level error boundary required.
- Contact form, if included, must have explicit loading, success, and error states.

## 6. Content Requirements

### Required Before Launch

#### Hero Content

- Candidate name.
- Target role or role family.
- One concise value proposition.
- Primary and secondary CTA labels.
- GitHub, LinkedIn, and email links.

#### Projects

Minimum launch requirement:

- Three strong projects.

Each project requires:

- Name.
- One-line summary.
- Problem statement.
- Candidate's role.
- Approach.
- Technology stack.
- Outcome or learning.
- At least one credible link where available:
  - Live demo.
  - GitHub repository.
  - Case study.
  - Technical write-up.

Preferred project mix:

- One full-stack application.
- One AI / LLM / automation project.
- One polished frontend or product-focused project.

#### Bio

- Short career narrative.
- Explanation of non-traditional background as a differentiator.
- Current engineering focus.
- Types of roles or problems being targeted.

#### Skills

- Actual technologies and practices grouped by capability.
- No exaggerated proficiency labels unless backed by project evidence.

#### Resume

- Final PDF resume.
- Browser-viewable resume path.
- Downloadable resume path.
- Resume content aligned with portfolio messaging.

#### Contact

- Email address or mailto link.
- LinkedIn profile URL.
- GitHub profile URL.

#### Visual / Brand Content

- Professional color system for light and dark themes.
- Candidate avatar or portrait only if high-quality and appropriate.
- Project imagery, screenshots, or diagrams where available.

### Acceptable Placeholder Content for v1 Development

The following may be placeholder during development but must be replaced before launch:

- Project screenshots.
- Project outcome details if real metrics are not finalized.
- Blog posts.
- Avatar or portrait.
- Open Graph image.
- Fine-tuned bio copy.
- Final resume PDF, provided a temporary clearly marked draft exists during implementation.

### Not Acceptable as Launch Placeholders

- Candidate name.
- Target role.
- Contact links.
- Resume file.
- Project names.
- Core project descriptions.
- Skills list.
- Broken or dummy links.
- Fabricated metrics, job titles, employers, credentials, or outcomes.

## 7. Out of Scope for v1

- CMS or admin editing interface.
- Backend application server.
- User authentication.
- Analytics dashboard.
- Complex contact form backend unless explicitly approved.
- Newsletter signup.
- Comment system.
- Project filtering beyond simple grouping or ordering.
- Blog if there are fewer than two strong posts.
- Multi-language support.
- Heavy animation libraries beyond Motion.
- 3D experiences or decorative interactive effects that do not improve hiring outcomes.
- Testimonials unless real and approved for public use.
- Automated resume parsing.
- Dynamic job-application tracking.
- AI chatbot or portfolio assistant.
