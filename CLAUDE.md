# CLAUDE.md - AI Assistant Guide for claudecredito

**Last Updated:** 2025-11-14
**Repository:** seobakin/claudecredito
**Status:** Initial Setup Phase

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Codebase Structure](#codebase-structure)
3. [Development Workflows](#development-workflows)
4. [Branching Strategy](#branching-strategy)
5. [Key Conventions](#key-conventions)
6. [Working with This Repository](#working-with-this-repository)
7. [Common Tasks](#common-tasks)
8. [Best Practices](#best-practices)

---

## Repository Overview

### Project Purpose
This repository is designed to explore and maximize the capabilities of Claude AI assistant within a development environment. The name "claudecredito" refers to optimizing the usage of Claude's capabilities.

### Current State
- **Status:** New repository in initial setup phase
- **Last Commit:** Initial commit (3e214ad)
- **Current Branch:** `claude/claude-md-mhz2042wqfz7eob6-01Rdqxb15po5FgBgpng4S3kw`
- **Main Files:** README.md, CLAUDE.md (this file)

### Technology Stack
*To be determined as the project evolves*

---

## Codebase Structure

### Current Structure
```
claudecredito/
├── .git/                 # Git repository metadata
├── README.md            # Project README (Spanish)
└── CLAUDE.md            # AI Assistant guide (this file)
```

### Planned Structure
As the project grows, consider organizing with:
```
claudecredito/
├── src/                 # Source code
├── tests/               # Test files
├── docs/                # Documentation
├── config/              # Configuration files
├── scripts/             # Utility scripts
├── .github/             # GitHub workflows and templates
├── package.json         # Node.js dependencies (if applicable)
├── README.md            # Project overview
└── CLAUDE.md            # This file
```

---

## Development Workflows

### Git Workflow

#### Branch Naming Convention
- Feature branches: `claude/claude-md-<session-id>`
- All development branches MUST start with `claude/` prefix
- Branch names must end with matching session ID for push operations

#### Commit Guidelines
1. **Write clear, descriptive commit messages**
   - Use imperative mood: "Add feature" not "Added feature"
   - First line: concise summary (50 chars or less)
   - Body: detailed explanation if needed

2. **Commit message format:**
   ```
   <type>: <subject>

   <body (optional)>
   ```

   Types: feat, fix, docs, style, refactor, test, chore

3. **Commit frequently** with logical, atomic changes

#### Push/Pull Strategy
- **Always use:** `git push -u origin <branch-name>`
- **Network retry:** Up to 4 retries with exponential backoff (2s, 4s, 8s, 16s)
- **Fetch specific branches:** `git fetch origin <branch-name>`
- **Branch requirement:** Must match pattern `claude/*-<session-id>` for successful push

---

## Branching Strategy

### Current Development Branch
```bash
claude/claude-md-mhz2042wqfz7eob6-01Rdqxb15po5FgBgpng4S3kw
```

### Creating New Branches
```bash
# Create and switch to new branch
git checkout -b claude/<descriptive-name>-<session-id>

# Push and set upstream
git push -u origin claude/<descriptive-name>-<session-id>
```

### Branch Lifecycle
1. **Create** - Create feature branch from main
2. **Develop** - Make changes and commit regularly
3. **Push** - Push to remote with `-u` flag
4. **Review** - (Future: PR review process)
5. **Merge** - (Future: Merge to main after approval)

---

## Key Conventions

### File Organization
- **Naming:** Use kebab-case for files: `my-component.js`
- **Directories:** Use lowercase with hyphens
- **Components:** Group related files together

### Code Style
*To be established based on chosen technologies*

**General Guidelines:**
- Consistent indentation (2 or 4 spaces)
- Meaningful variable/function names
- Comments for complex logic
- DRY principle (Don't Repeat Yourself)

### Documentation
- **Inline comments:** For complex logic
- **Function/class docs:** Describe purpose, parameters, returns
- **README updates:** Keep project README current
- **CLAUDE.md updates:** Update this file when workflows change

---

## Working with This Repository

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd claudecredito

# Check current branch
git branch

# Install dependencies (when applicable)
# npm install
# pip install -r requirements.txt
```

### Daily Workflow
1. **Start:** Check current branch and status
   ```bash
   git status
   git log --oneline -5
   ```

2. **Develop:** Make changes incrementally
   - Write code
   - Test changes
   - Commit with clear messages

3. **Sync:** Push changes regularly
   ```bash
   git add .
   git commit -m "feat: descriptive message"
   git push -u origin <branch-name>
   ```

### AI Assistant Workflow
When Claude works on this repository:

1. **Understand Context**
   - Read recent commits: `git log --oneline -10`
   - Check current status: `git status`
   - Review relevant files

2. **Plan Work**
   - Use TodoWrite tool for complex tasks
   - Break down into manageable steps
   - Track progress transparently

3. **Execute Changes**
   - Read files before editing
   - Make atomic, logical changes
   - Test when possible

4. **Document & Commit**
   - Write clear commit messages
   - Update documentation if needed
   - Push to designated branch

---

## Common Tasks

### Adding New Features
```bash
# 1. Ensure you're on the correct branch
git checkout claude/<feature-branch>

# 2. Create necessary files/directories
mkdir -p src/features/new-feature

# 3. Implement feature with regular commits
git add src/features/new-feature
git commit -m "feat: add new feature implementation"

# 4. Push changes
git push -u origin claude/<feature-branch>
```

### Fixing Bugs
```bash
# 1. Identify the issue
# 2. Create fix
# 3. Test the fix
# 4. Commit with descriptive message
git commit -m "fix: resolve issue with component rendering"
```

### Updating Documentation
```bash
# 1. Update relevant .md files
# 2. Ensure accuracy and clarity
# 3. Commit documentation changes
git commit -m "docs: update setup instructions"
```

---

## Best Practices

### For AI Assistants (Claude)

#### Communication
- ❌ Do NOT use emojis unless explicitly requested
- ✅ Be concise and technical
- ✅ Explain reasoning when making architectural decisions
- ✅ Ask for clarification when requirements are ambiguous

#### Code Quality
- ✅ Read existing files before editing
- ✅ Prefer editing over creating new files
- ✅ Check for security vulnerabilities (SQL injection, XSS, etc.)
- ✅ Follow existing code patterns
- ❌ Do NOT introduce breaking changes without discussion

#### Tool Usage
- ✅ Use specialized tools (Read, Edit, Write) over bash commands
- ✅ Run independent operations in parallel
- ✅ Use Task tool for complex, multi-step operations
- ✅ Use TodoWrite for tracking progress on complex tasks

#### Git Operations
- ✅ Always verify branch before committing
- ✅ Write meaningful commit messages
- ✅ Push only to designated claude/* branches
- ❌ NEVER force push without explicit permission
- ❌ NEVER push to main/master without approval

### For Human Developers

#### Collaboration with Claude
- Provide clear, specific requirements
- Review Claude's changes before merging
- Give feedback on code quality and approach
- Update CLAUDE.md when workflows change

#### Code Review
- Check for security issues
- Verify tests pass
- Ensure documentation is updated
- Validate commit message quality

---

## Project Evolution

### Phase 1: Initial Setup (Current)
- [x] Create repository
- [x] Add README
- [x] Create CLAUDE.md
- [ ] Define project scope and goals
- [ ] Choose technology stack
- [ ] Set up project structure

### Phase 2: Development Setup
- [ ] Initialize package manager (npm/pip/etc.)
- [ ] Configure linting and formatting
- [ ] Set up testing framework
- [ ] Create CI/CD pipeline
- [ ] Add contribution guidelines

### Phase 3: Active Development
- [ ] Implement core features
- [ ] Write comprehensive tests
- [ ] Create user documentation
- [ ] Establish deployment process

---

## Resources

### Git Commands Reference
```bash
# Status and information
git status                          # Check working directory status
git log --oneline -10              # View recent commits
git branch                         # List branches
git diff                           # View unstaged changes

# Working with branches
git checkout -b <branch>           # Create and switch to branch
git checkout <branch>              # Switch to existing branch
git branch -d <branch>             # Delete local branch

# Staging and committing
git add <file>                     # Stage specific file
git add .                          # Stage all changes
git commit -m "message"            # Commit with message
git commit --amend                 # Amend last commit (use cautiously)

# Remote operations
git fetch origin <branch>          # Fetch specific branch
git pull origin <branch>           # Pull and merge branch
git push -u origin <branch>        # Push and set upstream
```

### Getting Help
- GitHub Issues: Report problems or suggest features
- Documentation: Keep this file updated
- Team Communication: (Define channels as needed)

---

## Maintenance

### Updating This Document
This CLAUDE.md should be updated when:
- Project structure changes significantly
- New workflows or conventions are established
- Technology stack is chosen or updated
- Best practices are refined
- Common issues and solutions are identified

### Version History
- **2025-11-14:** Initial creation during repository analysis

---

## Notes

### Language
- Primary README: Spanish
- CLAUDE.md: English (for broader AI assistant compatibility)
- Code comments: (To be determined)

### Special Considerations
- Network operations may require retries due to connectivity
- Branch names must follow strict convention for push operations
- This is an exploratory project for Claude capabilities

---

**For questions or clarifications about this guide, please refer to the repository maintainer or update this document with new information as the project evolves.**
