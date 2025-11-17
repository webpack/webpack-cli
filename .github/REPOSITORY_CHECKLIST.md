# Repository Privacy Checklist

Use this checklist to ensure the repository remains private and secure.

## Initial Setup (One-time)

- [ ] **Platform Settings Configured**
  - [ ] Repository visibility set to Private/Internal
  - [ ] Access restricted to organization only
  - [ ] Branch protection enabled on main/master
  - [ ] Required reviewers configured (2+ approvers)
  - [ ] Force push prevention enabled
- [ ] **Git Hooks Installed**
  - [ ] Pre-push hook exists (`.git/hooks/pre-push`)
  - [ ] Pre-push hook is executable (`chmod +x`)
  - [ ] Pre-push hook tested and working
- [ ] **Git Configuration**
  - [ ] Upstream remote added (public webpack-cli)
  - [ ] Origin remote points to internal server
  - [ ] No public remotes configured (except upstream read-only)
- [ ] **CODEOWNERS Configured**
  - [ ] `.github/CODEOWNERS` file exists
  - [ ] Security team owns sensitive files
  - [ ] Admin team owns .github/ directory
  - [ ] All teams/users exist and have access

- [ ] **Documentation Complete**
  - [ ] README.md has prominent privacy warning
  - [ ] PRIVATE_REPO_WARNING.md exists
  - [ ] SECURITY_BARRIERS.md exists
  - [ ] INTERNAL_FORK_NOTES.md exists
  - [ ] All docs reviewed and accurate

## Monthly Checks

**Date of last check:** ******\_\_\_******

- [ ] **Visibility Verification**
  - [ ] Repository is still Private/Internal
  - [ ] No forks exist in public spaces
  - [ ] Access list reviewed and updated
- [ ] **Security Checks**
  - [ ] Pre-push hook still installed and working
  - [ ] No public remotes added
  - [ ] Recent push history reviewed
  - [ ] No unauthorized access detected
- [ ] **Access Audit**
  - [ ] Team members list current
  - [ ] Removed former employees' access
  - [ ] External collaborators reviewed
  - [ ] Access levels appropriate

## Quarterly Reviews

**Date of last review:** ******\_\_\_******

- [ ] **Comprehensive Security Audit**
  - [ ] All security barriers tested
  - [ ] Platform security settings verified
  - [ ] Access logs reviewed
  - [ ] Incident response plan current
- [ ] **Documentation Update**
  - [ ] All docs reflect current state
  - [ ] Contact information current
  - [ ] Compliance requirements met
  - [ ] Training materials updated
- [ ] **Upstream Sync Review**
  - [ ] Upstream security updates reviewed
  - [ ] Merge conflicts assessed
  - [ ] Version compatibility checked
  - [ ] Sync schedule appropriate

## Before Making Changes

- [ ] **Change Review**
  - [ ] Change doesn't expose proprietary code
  - [ ] No secrets in commit
  - [ ] Tests pass locally
  - [ ] Linting passes
- [ ] **Security Review** (for sensitive files)
  - [ ] Security team notified
  - [ ] Code review completed
  - [ ] Security implications assessed
  - [ ] Approval obtained

## Before Granting Access

- [ ] **User Verification**
  - [ ] User is internal team member
  - [ ] User needs access for legitimate work
  - [ ] User trained on privacy requirements
  - [ ] User agrees to policies
- [ ] **Access Level**
  - [ ] Minimum necessary permissions
  - [ ] Time-limited if temporary
  - [ ] Documented and approved
  - [ ] Notified to security team

## Incident Response (If Compromised)

- [ ] **Immediate Actions**
  - [ ] Repository made private immediately
  - [ ] Security team notified
  - [ ] Access logs pulled
  - [ ] Exposure scope assessed
- [ ] **Follow-up**
  - [ ] Credentials rotated
  - [ ] Incident documented
  - [ ] Root cause identified
  - [ ] Additional controls implemented
- [ ] **Post-Incident**
  - [ ] Lessons learned documented
  - [ ] Team training updated
  - [ ] Policies strengthened
  - [ ] Stakeholders notified

## Notes

Add any additional notes or findings here:

```
[Date] - [Finding/Action]
```

---

**Maintainer:** ******\_\_\_******
**Last Updated:** ******\_\_\_******
**Next Review:** ******\_\_\_******
