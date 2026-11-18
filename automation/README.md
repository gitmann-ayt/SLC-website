# SLC automation box

One small EC2 instance runs the SEO jobs on a schedule and emails a report after
every run. Content and metadata changes are published automatically: the box
commits to `main`, pushes to GitHub and deploys to S3/CloudFront.

| Job | When (Pakistan time) | What it does | Changes the site? |
|---|---|---|---|
| `health` | Daily 08:00 | Every sitemap page returns 200 with no noindex and a correct canonical; robots.txt, sitemap.xml and llms.txt are reachable; the bare domain redirects to www; the certificate isn't expiring | No |
| `content` | Mondays 10:00 | Claude writes the next guide from `automation/topics.md` into `data/guides.ts`, then the box runs typecheck, build and SEO check, commits, pushes and deploys | Yes |
| `search-console` | 3rd of month 11:00 | Pulls 28 days of Search Console data; Claude improves the titles and descriptions of pages with low click-through and adds missing topics to the backlog | Yes |
| `aeo` | Monthly, from Claude in Chrome | Claude in Chrome asks ChatGPT, Perplexity and Gemini (in your logged-in browser) the questions in `aeo-questions.json` and emails whether SLC is mentioned. Prompt: `automation/jobs/aeo-chrome.md`. The API version (`aeo.mjs`) is off in the crontab | No |

| `backlinks` | Every week or two, from Claude in Chrome | Claude in Chrome works through `automation/backlinks.md`: creates and checks free business listings (Google Business Profile, Bing, Apple, social profiles, directories) with the exact same name, address and phone, finds sites that list competitors, saves outreach emails as Gmail drafts (never sends them), and emails what's waiting on you plus an updated tracker. Prompt: `automation/jobs/backlinks-chrome.md` | No |

Internal links are handled by the site itself: service and location pages link
to every guide whose `related` list names them, so each weekly guide is linked
the day it goes live. `npm run seo:check` warns about orphan pages and lists the
pages with the fewest inbound links.

Nothing is published if the typecheck, build or `npm run seo:check` fails: the
job resets to `main` and emails you the error.

## Steering it

- **What gets written:** edit `automation/topics.md` (reorder, add, delete).
- **How it is written:** edit `automation/jobs/content.md`.
- **What the AEO check asks:** edit `automation/aeo-questions.json`.
- **Schedule:** edit `automation/setup/crontab`. The box picks up changes every Sunday.

Changes to these files take effect once they are pushed to `main`.

**Working from a laptop:** run `git pull` before you edit, because the box pushes
to `main` every week. The box always starts from the latest `main`, so your pushes
are picked up on its next run.

## AWS resources (region ap-south-1)

- EC2 `slc-automation` (t4g.small, Amazon Linux 2023). There is no SSH and no inbound
  traffic; open a shell with `aws ssm start-session --target <instance-id>`.
- IAM role `slc-automation`: write access to the site bucket, invalidation on the
  distribution, read access to `/slc/*` parameters, SES send, and SSM access.
- Secrets in SSM Parameter Store, all `SecureString`:

| Parameter | Used by |
|---|---|
| `/slc/report-email` | every job (also a verified SES identity) |
| `/slc/claude-oauth-token` | content, search-console: Claude subscription token from `claude setup-token` (or set `/slc/anthropic-api-key` to pay by API instead) |
| `/slc/github-token` | content, search-console (push to `main`) |
| `/slc/gsc-service-account` | search-console (JSON key of a Google service account added to the Search Console property) |
| `/slc/openai-api-key`, `/slc/perplexity-api-key`, `/slc/gemini-api-key` | aeo (any that are set) |

On the box: the repo is in `/opt/slc/repo`, logs are in `/opt/slc/state/logs`,
and the AEO history is in `/opt/slc/state/aeo-history.json`.

**Run a job now:**

```
aws ssm send-command --region ap-south-1 --instance-ids <id> --document-name AWS-RunShellScript \
  --parameters 'commands=["sudo -u slc AWS_DEFAULT_REGION=ap-south-1 bash /opt/slc/repo/automation/run-job.sh health"]'
```
