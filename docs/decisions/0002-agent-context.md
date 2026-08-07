# ADR 0002: layered agent context

Status: accepted.

The root `AGENTS.md` contains repository-wide invariants. Each application adds only local constraints in its nearest `AGENTS.md`. Durable explanations live in `docs/`, while executable assertions live in `scripts/` and CI.

This keeps context short, discoverable and testable without duplicating the full repository guide in every directory.
