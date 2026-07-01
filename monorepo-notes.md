# Monorepo Notes

## Why is a monorepo better than two separate repos for this project?

- The frontend and backend are in one repository.
- It is easier to manage, install dependencies, and keep changes together.
- One commit can update both the API and the React app.

## When would two separate repos be better?

- When different teams work on the frontend and backend or when they are deployed independently.
- Each project can then have its own release schedule.

## What is the cost of a monorepo?

- It can become larger and more complex.
- It also has one lockfile for all packages, which can cause merge conflicts.
- New developers may also need time to understand the workspace structure.
