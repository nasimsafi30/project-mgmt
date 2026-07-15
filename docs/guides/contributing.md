
## 5. docs/guides/contributing.md

```powershell
$content = @'
# Contributing Guide

1. Fork repo
2. Create branch: `git checkout -b feature/name`
3. Install: `npm install --legacy-peer-deps`
4. Make changes
5. Test: `npm test`
6. Commit with conventional commits
7. Create PR

## Commit Convention
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- test: Tests
'@
$content | Out-File -FilePath "docs\guides\contributing.md" -Encoding utf8
Write-Host "docs/guides/contributing.md created" -ForegroundColor Green
