# Main web application

- This workspace owns the domain root, portfolio, consulting pages, blog and tools.
- Keep the light and dark themes behaviorally equivalent. The portfolio terminal renders in both.
- Static files that must exist at the deployed root belong in `public/`, not the repository root.
- Blog articles belong in `content/posts/`; preserve frontmatter and static generation.
- Validate with `npm run build` from the repository root.
