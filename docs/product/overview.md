# Product map

- **MGA web**: consulting funnel, professional portfolio, technical blog and interactive resources.
- **Neil**: multilingual product and commercial site for vehicle climate systems.
- **El Portugués**: institutional logistics and distribution site.

The sites share repository operations but remain separate deployable workspaces so client-specific behavior and dependencies stay isolated.

## Content conventions

- Chronological lists render newest first: the most recent special report, post or video always goes on top of its section. `SpecialReportsSection.tsx` keeps its `REPORTS` array in chronological descending order; blog posts and videos sort by date in code.
