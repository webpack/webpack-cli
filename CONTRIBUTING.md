# Contributing

From opening a bug report to creating a pull request: every contribution is
appreciated and welcomed. If you're planning a new feature or changing
the api, please create an issue first. This way we can ensure that your precious
work is not in vain.

## Issues

Most of the time, when webpack does not work correctly, it might be a configuration issue.

If you are still having difficulty after looking over your configuration carefully, please post
a question to [StackOverflow with the webpack-cli tag](http://stackoverflow.com/tags/webpack-cli). Please ensure that your questions
that include your `webpack.config.js` and relevant files. This way you help others to help you.

**If you have discovered a bug or have a feature suggestion, feel free to create an issue on Github.**

## Your first Contribution

First of all you will need to create an issue in github for the feature or bugfix that you want to work on. When you open a new issue, there will be a template that will be automatically added to the text of the issue, which you would need to fill in. Doing this will help us to understand better what the ticket is about.

After you've created the issue, we will have a look, and provide feedback to your ticket. 

In case it is a bug that you want to fix, we might help you with background information about the issue, so you can make an informed fix.

In case you are suggesting a new feature, we will match your idea with our current roadmap, and will open conversations about it. Once the discussion has been done, and the tasks cleared, then you're ready to code.

## Setup

* Install [Node.js](https://nodejs.org/) if you don't have it already.
  *Note: Node 6 or greater would be better for "best results".*
* Fork the **webpack-cli** repo at [https://github.com/webpack/webpack-cli](https://github.com/webpack/webpack-cli).
* `git clone <your-clone-url> && cd webpack-cli`

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

We base our branching model on [git flow](http://nvie.com/posts/a-successful-git-branching-model/). Instead of working with a `develop` base branch, we use the `master` branch. We do it to ease the workflow a bit. However, we find that adding prefixes to the branches is useful.

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

If you are fixing an existing bug, you can create a branch with the following prefix:

`bugfix/<the-fix>`

## Testing

Every bugfix or feature that you submit, needs to be tested. Writing tests for code is very important to prevent future bugs, and help to discover possible new bugs promptly.

It is important that you test the logic of the code you're writing, and that your tests really go through all your lines, branches and statements. This is the only way to ensure that the code coverage is high enough to ensure the users of the cli, that they are using a solid tool.

In case you need a hand or pointers on to how to write your tests, do not hesitate to reach out to us. We will gladly point you in the right direction.

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

## --migrate with the CLI

This is a new feature in development for the CLI.

```
webpack --migrate <your-config-name>
```

The expected result of the above command is to take the mentioned `webpack` configuration and create a new configuration file which is compatible with webpack 2.
It should be a valid new config and should keep intact all the features from the original config.
The new config will be as readable as possible (may add some comments).

With [#40](https://github.com/webpack/webpack-cli/pull/40), we have been able to add basic scaffolding and do many of the conversions recommended in the [docs](https://webpack.js.org/guides/migrating/).

### How it's being done

We use [`jscodeshift`](https://github.com/facebook/jscodeshift) transforms called `codemods` to accomplish this.
We have written a bunch of transformations under [/lib/transformations](https://github.com/webpack/webpack-cli/tree/master/lib/transformations),divided logically.
We convert the existing webpack config to [AST](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API). We then parse this tree for the specific features and modify it to conform to webpack v2.

#### Structure of a transform

The directory structure of a transform looks as follows -

```sh
|
|--__snapshots__
|--__testfixtures__
|  |
|  |--transform-name.input.js
|
|--transform-name.js
|--transform-name.test.js
```

`transform-name.js`

This file contains the actual transformation codemod. It applies specific transformation and parsing logic to accomplish its job
There are utilities available under `/lib/utils.js` which can help you with this.

`transform-name.test.js`

This is where you declare a new test case for your transformation.
Each test will refer to an input webpack config snippet.
Conventionally we write them in `\_\_testfixtures\_\_`.

```
const defineTest = require('../defineTest');

defineTest(__dirname, 'transform-name.input1.js');
defineTest(__dirname, 'transform-name.input2.js');
```

`defineTest` is a helper test method which helps us to run tests on all the transforms uniformly.
It takes the input file given as parameter and uses jest to create a snapshot of the output. This effectively tests the correctness of our transformation.

### TODO

This is still in a very raw form. We'd like to take this as close to a truly useful tool as possible.
We will still need to
  - Support all kinds of webpack configuration(made using merge tools)
  - Test these transforms against real world configurations.

## Contributor License Agreement

When submitting your contribution, a CLA (Contributor License Agreement) bot will come by to verify that you signed the CLA. If you are submitting a PR for the first time, it will link you to the right place to sign it. If you have committed your contributions using an email that is not the same as your email used on GitHub, the CLA bot can't accept your contribution.

Run `git config user.email` to see your Git email, and verify it with [your GitHub email](https://github.com/settings/emails).


## Documentation

webpack is feature rich and documentation is a time sink. We
greatly appreciate any time spent fixing typos or clarifying sections in the
documentation.
