# Security Policy

This document explains the security policy of webpack-cli and how we intend to support webpack and webpack-cli.

## Supported Versions

webpack CLI is currently supporting webpack v4 and webpack v5. Security fixes are released in patches.

| webpack version | webpack-cli version           | Supported          |
| --------------- | ----------------------------- | ------------------ |
| >= 4.20.x       | ^3.1.2                        | :white_check_mark: |
| <= 4.19.x       | ^3.1.1                        | :white_check_mark: |
| 5.x.0           | ^3.1.2                        | :white_check_mark: |
| 5.0.x           | ^3.1.2                        | :white_check_mark: |
| < 4.x.x         | (CLI included in webpack < 4) | :x:                |

**Note: Using webpack < 4 with webpack CLI is not required as CLI was [included](https://github.com/webpack/webpack/commit/4b0332d3909eea8115d84f9a03da2d52478daa70#diff-b9cfc7f2cdf78a7f4b91a753d10865a2) in webpack.**

## Reporting a Vulnerability

To report a vulnerability, please contact one of webpack maintainers through the email provided from either npm, GitHub or reach out at other social media platforms. For third party security vulnerabilities, submitting an issue or Pull Request to fix the security vulerability is much appreciated.
