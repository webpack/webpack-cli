// the shared eslint config resolves with `eslint-import-resolver-node`, which
// reads `main` and not `exports` — and this package now ships only `exports`
// eslint-disable-next-line import/no-unresolved
import { getCommitInfo, getPullRequestInfo } from "@changesets/get-github-info";

/** @typedef {import("@changesets/types").ChangelogFunctions} ChangelogFunctions */

/**
 * @returns {{ GITHUB_SERVER_URL: string }} value
 */
function readEnv() {
  const GITHUB_SERVER_URL = process.env.GITHUB_SERVER_URL || "https://github.com";
  return { GITHUB_SERVER_URL };
}

/**
 * @param {{ markdownLink: string } | undefined} part commit, pull request or author
 * @returns {string | null} its markdown link, or null when it was not found
 */
function markdownLink(part) {
  return part ? part.markdownLink : null;
}

/** @type {ChangelogFunctions} */
const changelogFunctions = {
  getDependencyReleaseLine: async (changesets, dependenciesUpdated, options) => {
    if (!options.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["@changesets/changelog-github", { "repo": "org/repo" }]',
      );
    }
    if (dependenciesUpdated.length === 0) return "";

    const changesetLink = `- Updated dependencies [${(
      await Promise.all(
        changesets.map(async (cs) => {
          if (cs.commit) {
            const info = await getCommitInfo({
              repo: options.repo,
              commit: cs.commit,
            });
            return info && info.commit.markdownLink;
          }
        }),
      )
    )
      .filter(Boolean)
      .join(", ")}]:`;

    const updatedDependenciesList = dependenciesUpdated.map(
      (dependency) => `  - ${dependency.name}@${dependency.newVersion}`,
    );

    return [changesetLink, ...updatedDependenciesList].join("\n");
  },
  getReleaseLine: async (changeset, type, options) => {
    const { GITHUB_SERVER_URL } = readEnv();
    if (!options || !options.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["@changesets/changelog-github", { "repo": "org/repo" }]',
      );
    }

    /** @type {number | undefined} */
    let prFromSummary;
    /** @type {string | undefined} */
    let commitFromSummary;
    /** @type {string[]} */
    const usersFromSummary = [];

    const replacedChangelog = changeset.summary
      .replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
        const num = Number(pr);
        if (!Number.isNaN(num)) prFromSummary = num;
        return "";
      })
      .replace(/^\s*commit:\s*([^\s]+)/im, (_, commit) => {
        commitFromSummary = commit;
        return "";
      })
      .replaceAll(/^\s*(?:author|user):\s*@?([^\s]+)/gim, (_, user) => {
        usersFromSummary.push(user);
        return "";
      })
      .trim();

    const [firstLine, ...futureLines] = replacedChangelog.split("\n").map((l) => l.trimEnd());

    const links = await (async () => {
      if (prFromSummary !== undefined) {
        const info = await getPullRequestInfo({
          repo: options.repo,
          pull: prFromSummary,
        });
        const commit = commitFromSummary
          ? `[\`${commitFromSummary.slice(0, 7)}\`](${GITHUB_SERVER_URL}/${options.repo}/commit/${commitFromSummary})`
          : markdownLink(info && info.commit);

        return {
          commit,
          pull: markdownLink(info && info.pull),
          user: markdownLink(info && info.author),
        };
      }
      const commitToFetchFrom = commitFromSummary || changeset.commit;
      if (commitToFetchFrom) {
        const info = await getCommitInfo({
          repo: options.repo,
          commit: commitToFetchFrom,
        });

        return {
          commit: markdownLink(info && info.commit),
          pull: markdownLink(info && info.pull),
          user: markdownLink(info && info.author),
        };
      }
      return {
        commit: null,
        pull: null,
        user: null,
      };
    })();

    const users = usersFromSummary.length
      ? usersFromSummary
          .map(
            (userFromSummary) => `[@${userFromSummary}](${GITHUB_SERVER_URL}/${userFromSummary})`,
          )
          .join(", ")
      : links.user;

    let suffix = "";
    if (links.pull || links.commit || users) {
      suffix = `(${users ? `by ${users} ` : ""}in ${links.pull || links.commit})`;
    }

    return `\n\n- ${firstLine} ${suffix}\n${futureLines.map((l) => `  ${l}`).join("\n")}`;
  },
};

export default changelogFunctions;
