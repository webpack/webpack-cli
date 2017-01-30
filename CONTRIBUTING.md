# Contributing

From opening a bug report to creating a pull request: every contribution is
appreciated and welcomed. If you're planning a new feature or change
the api please create an issue first. This way we can ensure that your precious
work is not in vain.

## Issues

Most of the time, when webpack does not work correctly, it might be a configuration issue.

If you are still having difficulty after looking over your configuration carefully, please post
a question to [StackOverflow with the webpack-cli tag](http://stackoverflow.com/tags/webpack-cli). Questions
that include your `webpack.config.js` and relevant files, this way you help others to help you.

**If you have discovered a bug or have a feature suggestion, feel free to create an issue on Github.**

## Your first Contribution

First of all you will need to create an issue in github for the feature of bugfix that you wand to work on. When you open a new issue, there will be a template that will be automatically added to the text of the issue, which you would need to fill in. Doing this will help us to understand better what the ticket is about.

After you've created the issue, we will have a look, and provide feedback to your ticket. In case is a bugfix that you want to fix, we might help you with background information about the issue, so you make an informed fix.

In case you are suggesting a new feature, we will match your idea with our current roadmap, and will open conversations about it. Once the discussion has been done, and the tasks cleared, then you're ready to code.

## Setup

* Install [Node.js](https://nodejs.org/) if you don't have it already.
  *Note: Node 6 or greater would be better for "best results".*
* Fork the **webpack-cli** repo at [https://github.com/webpack/webpack-cli](https://github.com/webpack/webpack-cli).
* `git clone <your-clone-url> && cd webpack-cli`
* Install the commit validator: `npm run install-commit-validator`

### Setup with npm
* Install the dependencies: `npm install`
* Run the tests with: `npm test`

### Setup with yarn
* If you don't have yarn yet: `npm install -g yarn`
* Install the dependencies and link them

```bash
yarn install
yarn link
yarn link webpack-cli
```

* To run the entire test suite use: `yarn test`

## Editor Config

The [.editorconfig](https://github.com/webpack/webpack-cli/blob/master/.editorconfig) in the root should ensure consistent formatting. Please make sure you've [installed the plugin](http://editorconfig.org/#download) if your text editor needs one.

## Branching Model

We based our branching model on [git flow](http://nvie.com/posts/a-successful-git-branching-model/). Instead of working with a `develop` base branch, we use instead the `master` branch. We do it to ease a bit the workflow. However, we find useful adding prefixes to the branches.

## Naming a branch

Making a branch in your fork for your contribution is helpful in the following ways:

* It allows you to submit more than one contribution in a single PR.
* It allows us to identify what your contribution is about from the branch name.

You will want to checkout the `master` branch locally before creating your new branch.

There are two types of branches:

* Feature
* Bugfix

### Features

If your contribution is something new, like a option for the cli, you can create a branch with the following prefix:

`feature/<the-new-feature>`

### Fixes

If you are fixing a existing bug, you can create a branch with the following prefix:

`bugfix/<the-fix>`

## Testing

Every bugfix or feature that you submit, needs to be tested. Writing tests for code is very important to prevent future bugs, and to help to discover promptly possible new bugs.

Is important that you test the logic of the code you're writing, and that your tests really go through all your lines, branches and statements. This is the only way we will have to ensure that the code coverage is high enough to ensure the users of the cli, that they are using a solid tool.

In case you need a hand and pointers to how to write your tests. Reach to us, and we will gladly point you out to the direction.

## Pull Requests

After getting some feedback, push to your fork and submit a pull request. We
may suggest some changes, improvements or implementation alternatives.

In case you've got a small change in most of the cases your pull request would be accepted quicker.

## Submitting a good Pull Request

* Write tests
* Follow the existing coding style
* Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)

## Commit message format

Our commit messages format follows the [angular.js commits format](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit-message-format).

We don't use the scope. The template of a commit would look like this:

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type** and a **subject**:

```
<type>: <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory.

Any line of the commit message cannot be longer 100 characters. This allows the message to be easier
to read on GitHub as well as in several git tools.

For more information about what each part of the template mean, head up to the documentation in the
[angular repo](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit-message-format)

## Contributor License Agreement

When submitting your contribution, a CLA (Contributor License Agreement) bot will come by to verify that you signed the CLA. If you are submitting a PR for the first time, it will link you to the right place to sign it. If you have committed your contributions using an email that is not the same as your email used on GitHub, the CLA bot can't accept your contribution.

Run `git config user.email` to see your Git email, and verify it with [your GitHub email](https://github.com/settings/emails).


## Documentation

webpack is feature rich and documentation is a time sink. We
greatly appreciate any time spent fixing typos or clarifying sections in the
documentation.
