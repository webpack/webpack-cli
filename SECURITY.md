# Security Policy

This document explains the security policy specific to `webpack-cli` and how we support versions of `webpack` and `webpack-cli`.

This policy complements the webpack organization security policy. For general guidelines on responsible disclosure, reporting channels, and response times, see:

https://github.com/webpack/.github/blob/main/.github/SECURITY.md

## Supported Versions

`webpack-cli` currently supports `webpack` v4 and v5. Security fixes are released as patches.

| webpack version | webpack-cli version           | Supported          |
| --------------- | ----------------------------- | ------------------ |
| >= 4.20.x       | ^4.2.0                        | :white_check_mark: |
| <= 4.19.x       | ^4.2.0                        | :white_check_mark: |
| 5.x.0           | ^4.2.0                        | :white_check_mark: |
| 5.0.x           | ^4.2.0                        | :white_check_mark: |
| < 4.x.x         | (CLI included in webpack < 4) | :x:                |

**Note: Using webpack < 4 with webpack CLI is not required as CLI was [included](https://github.com/webpack/webpack/commit/4b0332d3909eea8115d84f9a03da2d52478daa70#diff-b9cfc7f2cdf78a7f4b91a753d10865a2) in webpack.**

## Reporting a Vulnerability

Please follow the steps and channels defined in the webpack organization’s security policy:

https://github.com/webpack/.github/blob/main/.github/SECURITY.md
