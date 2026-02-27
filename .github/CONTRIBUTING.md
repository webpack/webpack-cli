# Contributing

From opening a bug report to creating a pull request: every contribution is
appreciated and welcomed. If you're planning to implement a new feature or changing
the API, please create an issue first. This way we can ensure that your precious
work is not in vain.

Table of Contents

- [Issues](#issues)
- [Your first Contribution](#your-first-contribution)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Editor Config](#editor-config)
- [Dependencies](#dependencies)
- [Branching Model](#branching-model)
- [Naming a branch](#naming-a-branch)
  - [Features](#features)
  - [Fixes](#fixes)
- [Testing](#testing)
- [Pull Requests](#pull-requests)
- [Submitting a good Pull Request](#submitting-a-good-pull-request)
- [Contributor License Agreement](#contributor-license-agreement)
- [Documentation](#documentation)
- [Join The Development](#join-the-development)

## Issues

Most of the time, when webpack does not work correctly, it might be a configuration issue.

If you are still having difficulty after looking over your configuration carefully, please post
a question to [StackOverflow with the webpack-cli tag](http://stackoverflow.com/tags/webpack-cli). Please ensure that your questions
that include your `webpack.config.js` and relevant files. This way you help others to help you.

**If you have discovered a bug or have a feature suggestion, feel free to create an [issue](https://github.com/webpack/webpack-cli/issues) on Github.**

> In case you're filing a bug, make sure you add steps to reproduce it. Especially if that bug is some weird/rare one.

## Your first Contribution

First of all, you will need to create an issue in Github for the feature or bugfix that you want to work on. When you open a new issue, there will be a template that will be automatically added to the text of the issue, which you would need to fill in. Doing this will help us to understand better what the ticket is about.

After you've created an issue, we will have a look, and provide feedback to your ticket.

In case it is a bug that you want to fix, we might help you with background information about the issue, so you can make an informed fix.

In case you are suggesting a new feature, we will match your idea with our current roadmap, and will open conversations about it. Once the discussion has been done, and the tasks cleared, then you're ready to code.

## Setup

- Install [Node.js](https://nodejs.org/) if you don't have it already.
  _Note: Node 22 or greater would be better for "best results"._

- Fork the **webpack-cli** repo at [https://github.com/webpack/webpack-cli](https://github.com/webpack/webpack-cli).

- `git clone <your-clone-url> && cd webpack-cli`

- Install the dependencies:

  ```bash
  npm install
  ```

- Build all the submodules before building for the first time

  ```bash
  npm run build
  ```

> If you are a Docker and Visual Studio Code user, you can quickstart development using [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) Extension

## Running Tests

- Run all the tests with:

  ```bash
  npm run test
  ```

- You can run the linters:

  ```bash
  npm run lint
  ```

## Editor Config

The [.editorconfig](https://github.com/webpack/webpack-cli/blob/main/.editorconfig) in the root should ensure consistent formatting. Please make sure you've [installed the plugin](http://editorconfig.org/#download) if your text editor needs one.

## Dependencies

To update dependencies, import each dependency and make sure the command line build passes. The dependency should support our minimal supported node version for webpack, found in `package.json`.

## Branching Model

We base our branching model on [git flow](http://nvie.com/posts/a-successful-git-branching-model/). Instead of working with a `develop` base branch, we use the `main` branch. We do it to ease the workflow a bit. However, we find that adding prefixes to the branches is useful.

## Naming a branch

Making a branch in your fork for your contribution is helpful in the following ways:

- It allows you to submit more than one contribution in a single PR.
- It allows us to identify what your contribution is about from the branch name.

You will want to checkout the `main` branch locally before creating your new branch.

There are two types of branches:

- Feature
- Bugfix

### Features

If your contribution is something new, like an option for the cli, you can create a branch with the following prefix:

`feature/<the-new-feature>`

### Fixes

If you are fixing an existing bug, you can create a branch with the following prefix:

`bugfix/<the-fix>`

## Testing

Every bugfix or feature that you submit, needs to be tested. Writing tests for the code is very important to prevent future bugs, and help to discover possible new bugs promptly.

It is important that you test the logic of the code you're writing, and that your tests really go through all your lines, branches and statements. This is the only way to ensure that the code coverage is high enough to ensure the users of the cli, that they are using a solid tool.

In case you need a hand or pointers on to how to write your tests, do not hesitate to reach out to us. We will gladly point you in the right direction.

## Pull Requests

After getting some feedback, push to your fork and submit a pull request. We
may suggest some changes, improvements or implementation alternatives.

In case you've got a small change in most of the cases, your pull request would be accepted quicker.

## Submitting a good Pull Request

- Write tests.
- Follow the existing coding style.
- Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
- For a major bugfix/feature make sure your PR has an issue and if it doesn't, please create one. This would help discussion with the community, and polishing ideas in case of a new feature.
- Make sure your PR's description contains GitHub's special keyword references that automatically close the related issue when the PR is merged. ([More info](https://github.com/blog/1506-closing-issues-via-pull-requests))
- When you have lot of commits in your PR, it's good practice to squash all your commits in one single commit. ([Learn how to squash here](https://davidwalsh.name/squash-commits-git))

## Contributor License Agreement

When submitting your contribution, a CLA (Contributor License Agreement) bot will come by to verify that you signed the [CLA](https://easycla.lfx.linuxfoundation.org/#/?version=2). If you are submitting a PR for the first time, it will link you to the right place to sign it. If you have committed your contributions using an email that is not the same as your email used on GitHub, the CLA bot can't accept your contribution.

Run `git config user.email` to see your Git email, and verify it with [your GitHub email](https://github.com/settings/emails).

## Documentation

webpack is feature rich and documentation is a time sink. We
greatly appreciate any time spent fixing typos or clarifying sections in the
documentation.

## Join the development

- Before you join development, please set up the project on your local machine, run it and go through the application completely. Use any command you can find and see what it does. Explore.

  > Don't worry ... Nothing will happen to the project or to you due to the exploring. Only thing that will happen is, you'll be more familiar with what is where and might even get some cool ideas on how to improve various aspects of the project.

- If you would like to work on an issue, drop in a comment at the issue. If it is already assigned to someone, but there is no sign of any work being done, please feel free to drop in a comment so that the issue can be assigned to you if the previous assignee has dropped it entirely.
