# Design Notes

## What would break first if 100 conversations happened simultaneously? Why?

- SQLite would likely break first because it only allows one write at a time.
- Many users sending messages together could cause database locking and slow responses.
- This might also make the webhook retry requests.

## If a sales rep says "I need to see which leads have not replied in 3 days", what feature would you add and where?

- I would add a **Last Reply** field to each lead.
- Then I'd add a **No Reply in 3 Days** filter on the dashboard.
- The backend would return leads that match this filter.

## How would you prevent one rep from accidentally overwriting another rep's status update?

- I would use the **updated_at** timestamp.
- Before saving, the backend would check if the lead has already been updated.
- If it has, the user would be asked to refresh before saving again.
