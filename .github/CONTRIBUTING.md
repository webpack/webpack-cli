# Contributing

From opening a bug report to creating a pull request: every contribution is
appreciated and welcomed. If you're planning to implement a new feature or changing
the API, please create an issue first. This way we can ensure that your precious
work is not in vain.

Table of Contents

-   [Issues](#issues)
-   [Your first Contribution](#your-first-contribution)
-   [Setup](#setup)
-   [Running Tests](#running-tests)
    -   [Using yarn](#using-yarn)
-   [Editor Config](#editor-config)
-   [Dependencies](#dependencies)
-   [Branching Model](#branching-model)
-   [Naming a branch](#naming-a-branch)
    -   [Features](#features)
    -   [Fixes](#fixes)
-   [Testing](#testing)
-   [Pull Requests](#pull-requests)
-   [Submitting a good Pull Request](#submitting-a-good-pull-request)
-   [Commit message](#commit-message)
    -   [Commit Message Format](#commit-message-format)
-   [Migrate with the CLI](#migrate-with-the-cli)
    -   [How it's being done](#how-its-being-done)
        -   [Structure of a transform](#structure-of-a-transform)
    -   [Further Work](#further-work)
-   [Contributor License Agreement](#contributor-license-agreement)
-   [Documentation](#documentation)
-   [Join The Development](#join-the-development)

## Issues

Most of the time, when webpack does not work correctly, it might be a configuration issue.

If you are still having difficulty after looking over your configuration carefully, please post
a question to [StackOverflow with the webpack-cli tag](http://stackoverflow.com/tags/webpack-cli). Please ensure that your questions
that include your `webpack.config.js` and relevant files. This way you help others to help you.

**If you have discovered a bug or have a feature suggestion, feel free to create an [issue](https://github.com/webpack/webpack-cli/issues) on Github.**

> In case you're filing a bug, make sure you add steps to reproduce it. Especially if that bug is some weird/rare one.

## Your first Contribution

First of all, you will need to create an issue in Github for the feature or bugfix that you want to work on. When you open a new issue, there will be a template that will be automatically added to the text of the issue, which you would need to fill in. Doing this will help us to understand better what the ticket is about.

After you've created the issue, we will have a look, and provide feedback to your ticket.

In case it is a bug that you want to fix, we might help you with background information about the issue, so you can make an informed fix.

In case you are suggesting a new feature, we will match your idea with our current roadmap, and will open conversations about it. Once the discussion has been done, and the tasks cleared, then you're ready to code.

## Setup

-   Install [Node.js](https://nodejs.org/) if you don't have it already.
    _Note: Node 6 or greater would be better for "best results"._
-   Fork the **webpack-cli** repo at [https://github.com/webpack/webpack-cli](https://github.com/webpack/webpack-cli).
-   `git clone <your-clone-url> && cd webpack-cli`

-   We use [yarn](https://yarnpkg.com/lang/en/) workspaces, please install it:
    ```bash
    npm install -g yarn
    ```

> Using yarn is not a requirement, [npm](https://www.npmjs.com/) is included in node.

-   Install the dependencies:

    ```bash
    yarn install
    ```

-   Bootstrap all the submodules before building for the first time

    ```bash
    yarn bootstrap
    yarn build
    ```

## Running Tests

### Using yarn

-   Run all the tests with:

    ```bash
    yarn test
    ```

-   Run CLI tests with:

    ```bash
    yarn test:cli
    ```

-   Run tests of all packages:

    ```bash
    yarn test:packages
    ```

-   Test a single CLI test case:

    > Must run from root of the project

    ```bash
    yarn jest path/to/my-test.js
    ```

-   You can also install jest globally and run tests without npx:

    ```bash
    yarn global add jest
    jest path/to/my-test.js
    ```

-   You can run the linters:

    ```bash
    yarn lint
    ```

## Editor Config

The [.editorconfig](https://github.com/webpack/webpack-cli/blob/master/.editorconfig) in the root should ensure consistent formatting. Please make sure you've [installed the plugin](http://editorconfig.org/#download) if your text editor needs one.

## Dependencies

This is a multi-package repository and dependencies are managed using [lerna](https://lerna.js.org/)

> If you are adding or updating any dependency, please commit the updated `yarn.lock` file.

## Branching Model

We base our branching model on [git flow](http://nvie.com/posts/a-successful-git-branching-model/). Instead of working with a `develop` base branch, we use the `master` branch. We do it to ease the workflow a bit. However, we find that adding prefixes to the branches is useful.

## Naming a branch

Making a branch in your fork for your contribution is helpful in the following ways:

-   It allows you to submit more than one contribution in a single PR.
-   It allows us to identify what your contribution is about from the branch name.

You will want to checkout the `master` branch locally before creating your new branch.

There are two types of branches:

-   Feature
-   Bugfix

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

-   Write tests
-   Follow the existing coding style
-   Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
-   For a major bugfix/feature make sure your PR has an issue and if it doesn't, please create one. This would help discussion with the community, and polishing ideas in case of a new feature.
-   Make sure your PR's description contains GitHub's special keyword references that automatically close the related issue when the PR is merged. ([More info](https://github.com/blog/1506-closing-issues-via-pull-requests))
-   When you have lot of commits in your PR, it's good practice to squash all your commits in one single commit. ([Learn how to squash here](https://davidwalsh.name/squash-commits-git))

## Commit message

Our commit messages format follows the [angular.js commits format](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits).

You can use `yarn commit` script to have an interactive way of making commits that follow our guidelines.

We don't use the scope. The template of a commit would look like this:

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type** and a **subject**:

```md
<type>: <subject>
<BLANK LINE>

<body>
<BLANK LINE>
<footer>
```

This is the list of _type_ of commits that we accept:

-   ast
-   break
-   chore
-   cli
-   docs
-   feat
-   fix
-   misc
-   tests

The **header** is mandatory.

Any line of the commit message cannot be longer 100 characters. This allows the message to be easier
to read on GitHub as well as in several git tools.

For more information about what each part of the template mean, head up to the documentation in the
[angular repo](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits)

## Migrate with the CLI

```sh
webpack migrate
```

The expected result of the above command is to take the mentioned `webpack` configuration and create a new configuration file which is compatible with webpack 2.
It should be a valid new config and should keep intact all the features from the original config.
The new config will be as readable as possible (may add some comments).

With [#40](https://github.com/webpack/webpack-cli/pull/40), we have been able to add basic scaffolding and do many of the conversions recommended in the [docs](https://webpack.js.org/migrate).

### How it's being done

We use [`jscodeshift`](https://github.com/facebook/jscodeshift) transforms called `codemods` to accomplish this.
We have written a bunch of transformations under [/lib/transformations](https://github.com/webpack/webpack-cli/tree/master/lib/transformations),divided logically.
We convert the existing webpack config to [AST](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API). We then parse this tree for the specific features and modify it to conform to webpack v2.

#### Structure of a transform

The directory structure of a transform looks as follows -

```sh
│
├──__snapshots__
├──__testfixtures__
│  │
│  └───transform-name.input.js
│
├──transform-name.js
├──transform-name.test.js
```

`transform-name.js`

This file contains the actual transformation codemod. It applies specific transformation and parsing logic to accomplish its job
There are utilities available under `/lib/utils.js` which can help you with this.

`transform-name.test.js`

This is where you declare a new test case for your transformation.
Each test will refer to an input webpack config snippet.
Conventionally we write them in `\_\_testfixtures\_\_`.

```js
const defineTest = require('../defineTest');

defineTest(__dirname, 'transform-name.input1.js');
defineTest(__dirname, 'transform-name.input2.js');
```

`defineTest` is a helper test method which helps us to run tests on all the transforms uniformly.
It takes the input file given as parameter and uses jest to create a snapshot of the output. This effectively tests the correctness of our transformation.

### Further Work

This is still in a very raw form. We'd like to take this as close to a truly useful tool as possible.
We will still need to

-   Support all kinds of webpack configuration(made using merge tools)
-   Test these transforms against real-world configurations.

## Contributor License Agreement

When submitting your contribution, a CLA (Contributor License Agreement) bot will come by to verify that you signed the CLA. If you are submitting a PR for the first time, it will link you to the right place to sign it. If you have committed your contributions using an email that is not the same as your email used on GitHub, the CLA bot can't accept your contribution.

Run `git config user.email` to see your Git email, and verify it with [your GitHub email](https://github.com/settings/emails).

## Documentation

webpack is feature rich and documentation is a time sink. We
greatly appreciate any time spent fixing typos or clarifying sections in the
documentation.

## Join the development

-   Before you join development, please set up the project on your local machine, run it and go through the application completely. Use any command you can find and see what it does. Explore.

    > Don't worry ... Nothing will happen to the project or to you due to the exploring. Only thing that will happen is, you'll be more familiar with what is where and might even get some cool ideas on how to improve various aspects of the project.

-   If you would like to work on an issue, drop in a comment at the issue. If it is already assigned to someone, but there is no sign of any work being done, please feel free to drop in a comment so that the issue can be assigned to you if the previous assignee has dropped it entirely.
