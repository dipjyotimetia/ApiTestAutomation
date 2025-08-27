# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated testing.

## Available Workflows

### 1. `test.yml` - Full Featured Test Workflow
- Runs tests on multiple Node.js versions (18.x, 20.x)
- Uploads test reports as artifacts
- Comments on PRs with test results
- Optionally deploys reports to GitHub Pages
- Includes advanced test reporting with dorny/test-reporter

### 2. `test-simple.yml` - Simple Test Workflow  
- Runs tests on Node.js 20
- Uploads HTML and JSON reports as artifacts
- Displays test summary in GitHub Actions
- Scheduled daily runs at 2 AM UTC
- Lightweight and easy to understand

## Setup Instructions

### 1. Choose Your Workflow
- Use `test.yml` for comprehensive testing with multiple Node versions
- Use `test-simple.yml` for basic testing needs
- You can delete the one you don't need

### 2. Configure Environment Variables (Optional)
Add these secrets in your repository settings if your tests need them:
- `API_BASE_URL`: Base URL for your API endpoints
- `API_KEY`: API authentication key
- Any other environment variables your tests require

### 3. Enable GitHub Pages (For test.yml only)
If you want to deploy reports to GitHub Pages:
1. Go to Settings → Pages in your repository
2. Set Source to "GitHub Actions"
3. The workflow will automatically deploy reports to Pages

### 4. Branch Protection (Recommended)
Consider adding the test workflow as a required check:
1. Go to Settings → Branches
2. Add a branch protection rule for your main branch
3. Require "API Tests" to pass before merging

## Workflow Triggers

Both workflows run on:
- Push to main/master/develop branches
- Pull requests to main/master/develop branches  
- Manual workflow dispatch (you can trigger manually)
- Schedule (test-simple.yml runs daily)

## Artifacts

Test reports are saved as artifacts for 30 days:
- HTML reports for viewing in browser
- JSON reports for programmatic analysis
- Reports exclude heavy asset files to save space

## Customization

You can customize the workflows by:
- Changing Node.js versions in the matrix
- Adding environment variables
- Modifying the test command
- Adjusting artifact retention days
- Adding notifications (Slack, Teams, etc.)