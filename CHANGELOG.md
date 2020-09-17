<a name="4.0.0-beta.4"></a>

# 4.0.0-beta.4 (2020-09-17)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v4.0.0-beta.2...v4.0.0-beta.4)

## New Features

-   add aliases to all available commands ([#1644](https://github.com/webpack/webpack-cli/pull/1644))
-   changelog command ([26d70c9](https://github.com/webpack/webpack-cli/commit/26d70c9))
-   allow using cjs as default config ([#1775](https://github.com/webpack/webpack-cli/pull/1775))
-   add support for merging multiple configurations ([#1768](https://github.com/webpack/webpack-cli/pull/1768))
-   add support to spawn multiple compilers with different configs ([#1765](https://github.com/webpack/webpack-cli/pull/1765))
-   add name flag ([#1757](https://github.com/webpack/webpack-cli/pull/1757))
-   add --config-name flag ([#1753](https://github.com/webpack/webpack-cli/pull/1753))
-   serve integration ([#1712](https://github.com/webpack/webpack-cli/pull/1712))
-   add support for .cjs config ([#1727](https://github.com/webpack/webpack-cli/pull/1727))
-   support multiple env params ([#1715](https://github.com/webpack/webpack-cli/pull/1715))
-   add stats detailed option ([#1359](https://github.com/webpack/webpack-cli/pull/1359))
-   add flag to force config ([f61e7e0](https://github.com/webpack/webpack-cli/commit/f61e7e0))
-   support command aliases with webpack-cli version ([#1664](https://github.com/webpack/webpack-cli/pull/1664))
-   add support for none config in dotfolder ([#1637](https://github.com/webpack/webpack-cli/pull/1637))
-   validate user input ([#1610](https://github.com/webpack/webpack-cli/pull/1610))
-   parse Number flags ([#1652](https://github.com/webpack/webpack-cli/pull/1652))
-   allow multiple types for --stats ([ca2d593](https://github.com/webpack/webpack-cli/commit/ca2d593))
-   show up cli flag aliases with webpack help <arg> ([#1647](https://github.com/webpack/webpack-cli/pull/1647))
-   allow multiple targets ([#1799](https://github.com/webpack/webpack-cli/pull/1799))
-   🎸 add support for env flag ([#1598](https://github.com/webpack/webpack-cli/pull/1598))
-   allow only specified negated flags ([#1613](https://github.com/webpack/webpack-cli/pull/1613))
-   add init to webpack-cli ([#1609](https://github.com/webpack/webpack-cli/pull/1609))
-   webpack-cli: webpack stats ([#1299](https://github.com/webpack/webpack-cli/pull/1299))
-   test case for passing in unknown flags ([#1214](https://github.com/webpack/webpack-cli/pull/1214))
-   webpack-cli: add mode argument validation ([#1290](https://github.com/webpack/webpack-cli/pull/1290))
-   webpack-cli: add --no-stats flag ([#1654](https://github.com/webpack/webpack-cli/pull/1654))
-   webpack-cli: --version for external packages ([#1421](https://github.com/webpack/webpack-cli/pull/1421))
-   webpack-cli: add alias for version ([#1405](https://github.com/webpack/webpack-cli/pull/1405))
-   webpack-cli: import flags from webpack core ([#1630](https://github.com/webpack/webpack-cli/pull/1630))
-   webpack-cli: allow multiple entry files ([#1619](https://github.com/webpack/webpack-cli/pull/1619))
-   webpack-cli: allow negative property for cli-flags ([#1668](https://github.com/webpack/webpack-cli/pull/1668))
-   webpack-cli: add no-mode flag ([#1276](https://github.com/webpack/webpack-cli/pull/1276))
-   webpack-cli: create a cli executer ([#1255](https://github.com/webpack/webpack-cli/pull/1255))
-   webpack-cli: added mode argument ([#1253](https://github.com/webpack/webpack-cli/pull/1253))
-   webpack-cli: add progress bar for progress flag ([#1238](https://github.com/webpack/webpack-cli/pull/1238))
-   webpack-cli: add --no-hot flag ([#1591](https://github.com/webpack/webpack-cli/pull/1591))

## Chore

-   deps-dev: bump del-cli from 3.0.0 to 3.0.1 ([#1563](https://github.com/webpack/webpack-cli/pull/1563))
-   add old changelog ([2dde488](https://github.com/webpack/webpack-cli/commit/2dde488))
-   move cli under lerna package ([#1225](https://github.com/webpack/webpack-cli/pull/1225))
-   post refactor CLI ([#1237](https://github.com/webpack/webpack-cli/pull/1237))
-   add network timeout in yarnrc ([#1793](https://github.com/webpack/webpack-cli/pull/1793))
-   ignore package-lock.json and remove its references ([#1252](https://github.com/webpack/webpack-cli/pull/1252))
-   project maintanance and typescript fix ([#1247](https://github.com/webpack/webpack-cli/pull/1247))
-   update Bug_report & Feature_request Templates ([#1256](https://github.com/webpack/webpack-cli/pull/1256))
-   fix lerna config ([3f9e151](https://github.com/webpack/webpack-cli/commit/3f9e151))
-   new version of the packages ([2c75aeb](https://github.com/webpack/webpack-cli/commit/2c75aeb))
-   fixed readme and publishing config ([532216e](https://github.com/webpack/webpack-cli/commit/532216e))
-   changelogs aligned ([#1257](https://github.com/webpack/webpack-cli/pull/1257))
-   add commitlint github action ([#1766](https://github.com/webpack/webpack-cli/pull/1766))
-   added webpack 4 to the matrix and changed tests ([#1260](https://github.com/webpack/webpack-cli/pull/1260))
-   yarn.lock diff on build ([#1265](https://github.com/webpack/webpack-cli/pull/1265))
-   🐛 add git-cz as a dev dependency ([#1267](https://github.com/webpack/webpack-cli/pull/1267))
-   update packagephobia badge url ([#1764](https://github.com/webpack/webpack-cli/pull/1764))
-   🤖 remove stale entries from root package.json ([#1272](https://github.com/webpack/webpack-cli/pull/1272))
-   fixes the publishing files while running npm ([#1281](https://github.com/webpack/webpack-cli/pull/1281))
-   reduce install size ([#1314](https://github.com/webpack/webpack-cli/pull/1314))
-   revert adding terser plugin in webpack@next ([#1734](https://github.com/webpack/webpack-cli/pull/1734))
-   fix typos across the projects ([#1306](https://github.com/webpack/webpack-cli/pull/1306))
-   rephrase test descriptions ([#1725](https://github.com/webpack/webpack-cli/pull/1725))
-   update code of conduct and fix links ([#1331](https://github.com/webpack/webpack-cli/pull/1331))
-   fix eslint configuration ([#1348](https://github.com/webpack/webpack-cli/pull/1348))
-   enable workflow_dispatch event ([#1714](https://github.com/webpack/webpack-cli/pull/1714))
-   remove stale code and improve logic ([#1351](https://github.com/webpack/webpack-cli/pull/1351))
-   cleanup verbose flag ([#1709](https://github.com/webpack/webpack-cli/pull/1709))
-   sync lock file ([#1710](https://github.com/webpack/webpack-cli/pull/1710))
-   migrate to colorette ([#1691](https://github.com/webpack/webpack-cli/pull/1691))
-   update dependencies ([#1339](https://github.com/webpack/webpack-cli/pull/1339))
-   rm unused packages ([#1376](https://github.com/webpack/webpack-cli/pull/1376))
-   remove unused config file ([#1701](https://github.com/webpack/webpack-cli/pull/1701))
-   remove silent flag ([#1702](https://github.com/webpack/webpack-cli/pull/1702))
-   remove test cases consuming --dev and --prod flags ([#1698](https://github.com/webpack/webpack-cli/pull/1698))
-   bump deps ([#1378](https://github.com/webpack/webpack-cli/pull/1378))
-   remove stub type definition ([#1381](https://github.com/webpack/webpack-cli/pull/1381))
-   update yarn.lock ([#1697](https://github.com/webpack/webpack-cli/pull/1697))
-   refactor typescript configuration ([#1399](https://github.com/webpack/webpack-cli/pull/1399))
-   rm unused dirs in packages ([#1409](https://github.com/webpack/webpack-cli/pull/1409))
-   handle unknown args and improve test suite for info ([#1676](https://github.com/webpack/webpack-cli/pull/1676))
-   add info package to webpack-cli ([#1403](https://github.com/webpack/webpack-cli/pull/1403))
-   remove redundant instructions ([#1671](https://github.com/webpack/webpack-cli/pull/1671))
-   improve eslint configuration ([b3eece9](https://github.com/webpack/webpack-cli/commit/b3eece9))
-   rm redundant test dir cleanup, rm test level gitignore and handle at root ([#1669](https://github.com/webpack/webpack-cli/pull/1669))
-   integrate prettier for non js/ts files ([#1415](https://github.com/webpack/webpack-cli/pull/1415))
-   increase jest timeout ([#1665](https://github.com/webpack/webpack-cli/pull/1665))
-   remove unused import and fix type ([#1449](https://github.com/webpack/webpack-cli/pull/1449))
-   increase coverage for webpack-scaffold ([#1452](https://github.com/webpack/webpack-cli/pull/1452))
-   use default params ([#1464](https://github.com/webpack/webpack-cli/pull/1464))
-   remove yo-rc on clean command ([#1477](https://github.com/webpack/webpack-cli/pull/1477))
-   minor grammar fix in Bug_report.md ([#1499](https://github.com/webpack/webpack-cli/pull/1499))
-   allow commit type refactor ([#1536](https://github.com/webpack/webpack-cli/pull/1536))
-   remove info-verbosity instances ([#1550](https://github.com/webpack/webpack-cli/pull/1550))
-   🤖 remove stale tests for standard flag and instances ([#1545](https://github.com/webpack/webpack-cli/pull/1545))
-   remove stale issue_templates.md ([#1553](https://github.com/webpack/webpack-cli/pull/1553))
-   improve cli-flags usage ([#1547](https://github.com/webpack/webpack-cli/pull/1547))
-   remove redundant timeout definations ([#1635](https://github.com/webpack/webpack-cli/pull/1635))
-   upgrades typescript to the latest ([#1636](https://github.com/webpack/webpack-cli/pull/1636))
-   remove temporaray files created during testing ([#1803](https://github.com/webpack/webpack-cli/pull/1803))
-   correct version flag group ([#1574](https://github.com/webpack/webpack-cli/pull/1574))
-   remove unused schema file ([#1575](https://github.com/webpack/webpack-cli/pull/1575))
-   remove plugin TODO ([#1606](https://github.com/webpack/webpack-cli/pull/1606))
-   increase jest.setTimeout ([#1614](https://github.com/webpack/webpack-cli/pull/1614))
-   deps: bump enquirer from 2.3.4 to 2.3.5 ([#1429](https://github.com/webpack/webpack-cli/pull/1429))
-   added old changelog and lerna config ([e2c57bf](https://github.com/webpack/webpack-cli/commit/e2c57bf))
-   ci: remove old, unused CI configuration files ([#1355](https://github.com/webpack/webpack-cli/pull/1355))
-   ci: github actions ([#1356](https://github.com/webpack/webpack-cli/pull/1356))
-   cli: updated changelog of v3 ([#1224](https://github.com/webpack/webpack-cli/pull/1224))
-   deps: upgrade commander.js to v6 ([#1695](https://github.com/webpack/webpack-cli/pull/1695))
-   deps: bump execa from 4.0.0 to 4.0.1 ([#1529](https://github.com/webpack/webpack-cli/pull/1529))
-   deps: bump commander from 2.20.3 to 5.1.0 ([#1500](https://github.com/webpack/webpack-cli/pull/1500))
-   deps: bump commander from 6.0.0 to 6.1.0 ([#1778](https://github.com/webpack/webpack-cli/pull/1778))
-   deps: bump interpret from 2.1.0 to 2.2.0 ([#1607](https://github.com/webpack/webpack-cli/pull/1607))
-   deps: bump v8-compile-cache from 2.1.0 to 2.1.1 ([#1601](https://github.com/webpack/webpack-cli/pull/1601))
-   deps: bump enquirer from 2.3.5 to 2.3.6 ([#1663](https://github.com/webpack/webpack-cli/pull/1663))
-   deps: bump execa from 4.0.2 to 4.0.3 ([#1673](https://github.com/webpack/webpack-cli/pull/1673))
-   deps: bump interpret from 2.0.0 to 2.1.0 ([#1603](https://github.com/webpack/webpack-cli/pull/1603))
-   deps: bump got from 10.6.0 to 10.7.0 ([#1396](https://github.com/webpack/webpack-cli/pull/1396))
-   deps: [security] bump websocket-extensions from 0.1.3 to 0.1.4 ([#1621](https://github.com/webpack/webpack-cli/pull/1621))
-   deps: bump execa from 4.0.1 to 4.0.2 ([#1572](https://github.com/webpack/webpack-cli/pull/1572))
-   deps: upgrade jest to v25.2.3 ([#1387](https://github.com/webpack/webpack-cli/pull/1387))
-   deps: bump lodash from 4.17.15 to 4.17.19 ([#1696](https://github.com/webpack/webpack-cli/pull/1696))
-   deps: [security] bump node-fetch from 2.6.0 to 2.6.1 ([#1795](https://github.com/webpack/webpack-cli/pull/1795))
-   deps: [security] bump elliptic from 6.5.2 to 6.5.3 ([#1706](https://github.com/webpack/webpack-cli/pull/1706))
-   deps: update dependencies ([#1742](https://github.com/webpack/webpack-cli/pull/1742))
-   deps: [security] bump http-proxy from 1.18.0 to 1.18.1 ([#1788](https://github.com/webpack/webpack-cli/pull/1788))
-   deps-dev: bump lint-staged from 10.1.1 to 10.1.2 ([#1420](https://github.com/webpack/webpack-cli/pull/1420))
-   deps-dev: bump lint-staged from 10.2.7 to 10.2.8 ([#1608](https://github.com/webpack/webpack-cli/pull/1608))
-   deps-dev: bump @typescript-eslint/parser from 2.32.0 to 2.34.0 ([#1555](https://github.com/webpack/webpack-cli/pull/1555))
-   deps-dev: bump ts-jest from 25.3.1 to 25.5.1 ([#1530](https://github.com/webpack/webpack-cli/pull/1530))
-   deps-dev: bump @babel/core from 7.9.0 to 7.9.6 ([#1513](https://github.com/webpack/webpack-cli/pull/1513))
-   deps-dev: bump lerna from 3.22.0 to 3.22.1 ([#1625](https://github.com/webpack/webpack-cli/pull/1625))
-   deps-dev: bump git-cz from 4.6.2 to 4.7.0 ([#1639](https://github.com/webpack/webpack-cli/pull/1639))
-   deps-dev: bump @babel/core from 7.10.2 to 7.10.3 ([#1643](https://github.com/webpack/webpack-cli/pull/1643))
-   deps-dev: bump @typescript-eslint/eslint-plugin ([#1556](https://github.com/webpack/webpack-cli/pull/1556))
-   deps-dev: bump @babel/preset-env from 7.10.1 to 7.10.2 ([#1599](https://github.com/webpack/webpack-cli/pull/1599))
-   deps-dev: bump @typescript-eslint/parser from 2.28.0 to 2.32.0 ([#1534](https://github.com/webpack/webpack-cli/pull/1534))
-   deps-dev: bump @typescript-eslint/eslint-plugin ([#1533](https://github.com/webpack/webpack-cli/pull/1533))
-   deps-dev: bump @babel/preset-env from 7.10.0 to 7.10.1 ([#1594](https://github.com/webpack/webpack-cli/pull/1594))
-   deps-dev: bump lint-staged from 10.2.10 to 10.2.11 ([#1638](https://github.com/webpack/webpack-cli/pull/1638))
-   deps-dev: bump eslint-config-prettier from 6.10.1 to 6.11.0 ([#1493](https://github.com/webpack/webpack-cli/pull/1493))
-   deps-dev: bump @babel/preset-env from 7.10.2 to 7.10.3 ([#1646](https://github.com/webpack/webpack-cli/pull/1646))
-   deps-dev: bump typescript from 3.9.5 to 3.9.6 ([#1662](https://github.com/webpack/webpack-cli/pull/1662))
-   deps-dev: bump jest from 25.2.3 to 25.3.0 ([#1433](https://github.com/webpack/webpack-cli/pull/1433))
-   deps-dev: bump ts-jest from 25.3.0 to 25.3.1 ([#1414](https://github.com/webpack/webpack-cli/pull/1414))
-   deps-dev: bump lint-staged from 10.1.2 to 10.1.3 ([#1435](https://github.com/webpack/webpack-cli/pull/1435))
-   deps-dev: bump @babel/preset-env from 7.9.0 to 7.9.5 ([#1432](https://github.com/webpack/webpack-cli/pull/1432))
-   deps-dev: bump @babel/preset-env from 7.10.3 to 7.10.4 ([#1658](https://github.com/webpack/webpack-cli/pull/1658))
-   deps-dev: bump @typescript-eslint/parser from 2.26.0 to 2.28.0 ([#1456](https://github.com/webpack/webpack-cli/pull/1456))
-   deps-dev: bump @typescript-eslint/eslint-plugin ([#1457](https://github.com/webpack/webpack-cli/pull/1457))
-   deps-dev: bump @babel/core from 7.9.6 to 7.10.1 ([#1593](https://github.com/webpack/webpack-cli/pull/1593))
-   deps-dev: bump eslint-plugin-prettier from 3.1.2 to 3.1.3 ([#1453](https://github.com/webpack/webpack-cli/pull/1453))
-   deps-dev: bump jest from 25.3.0 to 25.5.4 ([#1520](https://github.com/webpack/webpack-cli/pull/1520))
-   deps-dev: bump lint-staged from 10.3.0 to 10.4.0 ([#1802](https://github.com/webpack/webpack-cli/pull/1802))
-   deps-dev: bump husky from 4.2.3 to 4.2.5 ([#1437](https://github.com/webpack/webpack-cli/pull/1437))
-   deps-dev: bump lint-staged from 10.2.4 to 10.2.6 ([#1569](https://github.com/webpack/webpack-cli/pull/1569))
-   deps-dev: bump git-cz from 4.6.0 to 4.6.1 ([#1592](https://github.com/webpack/webpack-cli/pull/1592))
-   deps-dev: bump @types/jest from 25.1.4 to 25.2.1 ([#1417](https://github.com/webpack/webpack-cli/pull/1417))
-   deps-dev: bump git-cz from 4.5.0 to 4.6.0 ([#1582](https://github.com/webpack/webpack-cli/pull/1582))
-   deps-dev: bump @babel/core from 7.10.3 to 7.10.4 ([#1659](https://github.com/webpack/webpack-cli/pull/1659))
-   deps-dev: bump cz-customizable from 6.2.0 to 6.2.1 ([#1672](https://github.com/webpack/webpack-cli/pull/1672))
-   deps-dev: bump @babel/preset-env from 7.9.5 to 7.10.0 ([#1588](https://github.com/webpack/webpack-cli/pull/1588))
-   deps-dev: bump lerna from 3.21.0 to 3.22.0 ([#1578](https://github.com/webpack/webpack-cli/pull/1578))
-   deps-dev: bump @typescript-eslint/eslint-plugin ([#1393](https://github.com/webpack/webpack-cli/pull/1393))
-   deps-dev: bump git-cz from 4.6.1 to 4.6.2 ([#1596](https://github.com/webpack/webpack-cli/pull/1596))
-   deps-dev: bump lint-staged from 10.0.9 to 10.1.1 ([#1395](https://github.com/webpack/webpack-cli/pull/1395))
-   deps-dev: bump eslint-plugin-node from 11.0.0 to 11.1.0 ([#1394](https://github.com/webpack/webpack-cli/pull/1394))
-   deps-dev: bump @types/node from 13.9.1 to 13.9.8 ([#1397](https://github.com/webpack/webpack-cli/pull/1397))
-   deps-dev: bump @babel/core from 7.10.1 to 7.10.2 ([#1600](https://github.com/webpack/webpack-cli/pull/1600))
-   deps-dev: bump webpack from 4.42.1 to 4.43.0 ([#1492](https://github.com/webpack/webpack-cli/pull/1492))
-   deps-dev: bump git-cz from 4.3.1 to 4.5.0 ([#1568](https://github.com/webpack/webpack-cli/pull/1568))
-   deps-dev: bump typescript from 3.9.6 to 3.9.7 ([#1684](https://github.com/webpack/webpack-cli/pull/1684))
-   deps-dev: bump @types/jest from 25.2.1 to 25.2.3 ([#1567](https://github.com/webpack/webpack-cli/pull/1567))
-   deps-dev: bump webpack from 4.43.0 to 4.44.0 ([#1700](https://github.com/webpack/webpack-cli/pull/1700))
-   deps-dev: bump lerna from 3.20.2 to 3.21.0 ([#1566](https://github.com/webpack/webpack-cli/pull/1566))
-   deps-dev: bump commitlint-config-cz from 0.13.0 to 0.13.1 ([#1374](https://github.com/webpack/webpack-cli/pull/1374))
-   deps-dev: bump eslint-plugin-prettier from 3.1.3 to 3.1.4 ([#1633](https://github.com/webpack/webpack-cli/pull/1633))
-   deps-dev: bump @babel/core from 7.10.4 to 7.11.0 ([#1711](https://github.com/webpack/webpack-cli/pull/1711))
-   deps-dev: bump webpack from 4.44.0 to 4.44.1 ([#1708](https://github.com/webpack/webpack-cli/pull/1708))
-   deps-dev: bump @babel/preset-env from 7.10.4 to 7.11.0 ([#1713](https://github.com/webpack/webpack-cli/pull/1713))
-   deps-dev: bump cz-customizable from 6.2.1 to 6.3.0 ([#1730](https://github.com/webpack/webpack-cli/pull/1730))
-   deps-dev: bump husky from 4.2.5 to 4.3.0 ([#1792](https://github.com/webpack/webpack-cli/pull/1792))
-   deps-dev: bump lint-staged from 10.2.6 to 10.2.7 ([#1597](https://github.com/webpack/webpack-cli/pull/1597))
-   deps-dev: bump lint-staged from 10.1.3 to 10.2.4 ([#1554](https://github.com/webpack/webpack-cli/pull/1554))
-   deps-dev: bump lint-staged from 10.2.13 to 10.3.0 ([#1784](https://github.com/webpack/webpack-cli/pull/1784))
-   deps-dev: bump @commitlint/config-lerna-scopes ([#1750](https://github.com/webpack/webpack-cli/pull/1750))
-   deps-dev: bump @babel/core from 7.11.5 to 7.11.6 ([#1785](https://github.com/webpack/webpack-cli/pull/1785))
-   deps-dev: bump commitlint-config-cz from 0.13.1 to 0.13.2 ([#1763](https://github.com/webpack/webpack-cli/pull/1763))
-   deps-dev: bump @babel/core from 7.11.1 to 7.11.4 ([#1761](https://github.com/webpack/webpack-cli/pull/1761))
-   deps-dev: bump lint-staged from 10.2.11 to 10.2.13 ([#1769](https://github.com/webpack/webpack-cli/pull/1769))
-   deps-dev: bump git-cz from 4.7.0 to 4.7.1 ([#1771](https://github.com/webpack/webpack-cli/pull/1771))
-   deps-dev: bump lint-staged from 10.2.9 to 10.2.10 ([#1632](https://github.com/webpack/webpack-cli/pull/1632))
-   deps-dev: bump @babel/preset-env from 7.11.0 to 7.11.5 ([#1780](https://github.com/webpack/webpack-cli/pull/1780))
-   deps-dev: bump @babel/core from 7.11.4 to 7.11.5 ([#1781](https://github.com/webpack/webpack-cli/pull/1781))
-   deps-dev: bump lint-staged from 10.2.8 to 10.2.9 ([#1615](https://github.com/webpack/webpack-cli/pull/1615))
-   generator: remove transpiled tests ([#1229](https://github.com/webpack/webpack-cli/pull/1229))
-   generators: improve generator Typescript types ([#1439](https://github.com/webpack/webpack-cli/pull/1439))
-   init: remove unused transform files ([#1450](https://github.com/webpack/webpack-cli/pull/1450))
-   logger: fix npm files to publish ([#1259](https://github.com/webpack/webpack-cli/pull/1259))
-   logger: remove logger package, inline webpack logger ([#1358](https://github.com/webpack/webpack-cli/pull/1358))
-   release: publish new version ([fb50f76](https://github.com/webpack/webpack-cli/commit/fb50f76))
-   release: publish new version ([2ea3174](https://github.com/webpack/webpack-cli/commit/2ea3174))
-   release: publish %s ([0d05c30](https://github.com/webpack/webpack-cli/commit/0d05c30))
-   release: publish new version ([c0f6f01](https://github.com/webpack/webpack-cli/commit/c0f6f01))
-   release: publish new version ([516a5ec](https://github.com/webpack/webpack-cli/commit/516a5ec))
-   webpack-cli: remove pretty output functionality ([238b401](https://github.com/webpack/webpack-cli/commit/238b401))
-   webpack-cli: remove stale imports from configGroup ([#1304](https://github.com/webpack/webpack-cli/pull/1304))

## Docs

-   describe commit types ([#1364](https://github.com/webpack/webpack-cli/pull/1364))
-   cli: changed README to notify the beta version ([#1223](https://github.com/webpack/webpack-cli/pull/1223))
-   fix jsdoc comment for run util function ([#1377](https://github.com/webpack/webpack-cli/pull/1377))
-   add info regarding force flag ([#1707](https://github.com/webpack/webpack-cli/pull/1707))
-   fix yarn installation guide ([#1692](https://github.com/webpack/webpack-cli/pull/1692))
-   add --env type ([#1687](https://github.com/webpack/webpack-cli/pull/1687))
-   improving init and migrate ([#1379](https://github.com/webpack/webpack-cli/pull/1379))
-   correct stats type ([#1577](https://github.com/webpack/webpack-cli/pull/1577))
-   remove --global instance ([#1561](https://github.com/webpack/webpack-cli/pull/1561))
-   fix supported arguments & commands link in README ([#1244](https://github.com/webpack/webpack-cli/pull/1244))
-   fix loading doc link in loader-generator ([#1410](https://github.com/webpack/webpack-cli/pull/1410))
-   remove typedoc, auto-generated docs ([#1406](https://github.com/webpack/webpack-cli/pull/1406))
-   improving packages Readme ([#1357](https://github.com/webpack/webpack-cli/pull/1357))
-   improve badges ([#1390](https://github.com/webpack/webpack-cli/pull/1390))
-   enhance CONTRIBUTING.md ([#1262](https://github.com/webpack/webpack-cli/pull/1262))
-   show download stats for serve ([#1705](https://github.com/webpack/webpack-cli/pull/1705))
-   improving contributing.md ([#1350](https://github.com/webpack/webpack-cli/pull/1350))
-   general corrections and improvements ([#1354](https://github.com/webpack/webpack-cli/pull/1354))
-   fix links to angular commit guidelines ([#1266](https://github.com/webpack/webpack-cli/pull/1266))
-   use a consistent format ([#1338](https://github.com/webpack/webpack-cli/pull/1338))
-   reflect branch next ([#1294](https://github.com/webpack/webpack-cli/pull/1294))
-   add core-team link to CODE_OF_CONDUCT.md ([#1329](https://github.com/webpack/webpack-cli/pull/1329))
-   minor typographical fix ([#1791](https://github.com/webpack/webpack-cli/pull/1791))
-   contributing: update table of contents ([#1332](https://github.com/webpack/webpack-cli/pull/1332))
-   info: remove old flags ([#1745](https://github.com/webpack/webpack-cli/pull/1745))
-   info: update --output flag ([#1496](https://github.com/webpack/webpack-cli/pull/1496))
-   init: ✏️ fix init command in README ([#1273](https://github.com/webpack/webpack-cli/pull/1273))
-   readme: update table of contents ([#1341](https://github.com/webpack/webpack-cli/pull/1341))
-   README: Node CI badge added ([#1292](https://github.com/webpack/webpack-cli/pull/1292))

## Fix

-   webpack-cli: verbose flag functionality ([#1549](https://github.com/webpack/webpack-cli/pull/1549))
-   ci for webpack@beta.30 ([#1801](https://github.com/webpack/webpack-cli/pull/1801))
-   use compiler.apply for Progress Plugin ([#1772](https://github.com/webpack/webpack-cli/pull/1772))
-   remove yes ([279c43f](https://github.com/webpack/webpack-cli/commit/279c43f))
-   throw err when supplied config is absent ([#1760](https://github.com/webpack/webpack-cli/pull/1760))
-   allow unknown files to use default require as fallback ([#1747](https://github.com/webpack/webpack-cli/pull/1747))
-   use appropriate exit codes ([#1755](https://github.com/webpack/webpack-cli/pull/1755))
-   peer dependencies for `webpack serve` ([#1317](https://github.com/webpack/webpack-cli/pull/1317))
-   yarn.lock conflicts on setup ([#1367](https://github.com/webpack/webpack-cli/pull/1367))
-   conditionally install terser-webpack-plugin for webpack@next ([#1732](https://github.com/webpack/webpack-cli/pull/1732))
-   generated loader template ([#1720](https://github.com/webpack/webpack-cli/pull/1720))
-   supply argv to config with functions ([#1721](https://github.com/webpack/webpack-cli/pull/1721))
-   rename sourcemap flag to devtool ([#1723](https://github.com/webpack/webpack-cli/pull/1723))
-   generated plugin template ([#1717](https://github.com/webpack/webpack-cli/pull/1717))
-   warn about merge config resolution cases ([#1674](https://github.com/webpack/webpack-cli/pull/1674))
-   use fileTypes from interpret ([#1690](https://github.com/webpack/webpack-cli/pull/1690))
-   set mode=production by default ([#1688](https://github.com/webpack/webpack-cli/pull/1688))
-   promise support in config ([#1666](https://github.com/webpack/webpack-cli/pull/1666))
-   show version information for plugin and loader ([#1661](https://github.com/webpack/webpack-cli/pull/1661))
-   prevent info from running unnecessarily ([#1650](https://github.com/webpack/webpack-cli/pull/1650))
-   json flag, enable tests ([#1460](https://github.com/webpack/webpack-cli/pull/1460))
-   consistent webpack plugin name ([#1480](https://github.com/webpack/webpack-cli/pull/1480))
-   typo in Compiler.js ([#1580](https://github.com/webpack/webpack-cli/pull/1580))
-   🐛 do not apply own defaults while setting mode ([#1565](https://github.com/webpack/webpack-cli/pull/1565))
-   compatibility with webpack@next ([#1779](https://github.com/webpack/webpack-cli/pull/1779))
-   throw error for invalid args ([#1462](https://github.com/webpack/webpack-cli/pull/1462))
-   regression with migrate command ([7ebcbb8](https://github.com/webpack/webpack-cli/commit/7ebcbb8))
-   generators: fix generators init loader's test regex ([#1309](https://github.com/webpack/webpack-cli/pull/1309))
-   release beta ([f1f05d8](https://github.com/webpack/webpack-cli/commit/f1f05d8))
-   cli: fix file resolution inside group helper ([#1221](https://github.com/webpack/webpack-cli/pull/1221))
-   generators: fix and refactor entry util, add tests ([#1392](https://github.com/webpack/webpack-cli/pull/1392))
-   generators: fix small issues with generators ([#1385](https://github.com/webpack/webpack-cli/pull/1385))
-   info: throw an error if help or version is passed as an arg ([#1737](https://github.com/webpack/webpack-cli/pull/1737))
-   init: fix the invalid package name ([#1228](https://github.com/webpack/webpack-cli/pull/1228))
-   init: fix webpack config scaffold ([#1231](https://github.com/webpack/webpack-cli/pull/1231))
-   packages: make packages have correct main paths to index ([#1366](https://github.com/webpack/webpack-cli/pull/1366))
-   serve: merge CLI and devServer options correctly ([#1649](https://github.com/webpack/webpack-cli/pull/1649))
-   serve: supplying help or version as an arg should throw error ([#1694](https://github.com/webpack/webpack-cli/pull/1694))
-   utils: respect package-lock.json ([#1375](https://github.com/webpack/webpack-cli/pull/1375))
-   webpack-cli: to void defaultEntry override the webpack config entry ([#1289](https://github.com/webpack/webpack-cli/pull/1289))
-   webpack-cli: add configuration for mode option none ([#1303](https://github.com/webpack/webpack-cli/pull/1303))
-   webpack-cli: handle promise rejection with package installation ([#1284](https://github.com/webpack/webpack-cli/pull/1284))
-   webpack-cli: correct cli-flags usage ([#1441](https://github.com/webpack/webpack-cli/pull/1441))
-   webpack-cli: fixed support for SCSS entry points ([#1271](https://github.com/webpack/webpack-cli/pull/1271))
-   webpack-cli: handle promise rejection happening with cli-executor ([#1269](https://github.com/webpack/webpack-cli/pull/1269))
-   webpack-cli: prefer import local ([#1345](https://github.com/webpack/webpack-cli/pull/1345))
-   webpack-cli: remove invalid stats warning with json flag ([#1587](https://github.com/webpack/webpack-cli/pull/1587))
-   webpack-cli: add value none in mode usage ([#1411](https://github.com/webpack/webpack-cli/pull/1411))
-   webpack-cli: prefetch flag implementation ([#1583](https://github.com/webpack/webpack-cli/pull/1583))

## Perf

-   do not spawn new process for running webpack ([#1741](https://github.com/webpack/webpack-cli/pull/1741))

## Refactor

-   remove --dev and --prod flags ([#1693](https://github.com/webpack/webpack-cli/pull/1693))
-   remove duplicate invocation ([#1790](https://github.com/webpack/webpack-cli/pull/1790))
-   cliExecuter consumes runCLI ([#1754](https://github.com/webpack/webpack-cli/pull/1754))
-   remove --mode flag validation ([#1744](https://github.com/webpack/webpack-cli/pull/1744))
-   use console for logging ([#1740](https://github.com/webpack/webpack-cli/pull/1740))
-   use logger ([#1748](https://github.com/webpack/webpack-cli/pull/1748))
-   remove stale code ([#1670](https://github.com/webpack/webpack-cli/pull/1670))
-   remove plugin flag ([#1571](https://github.com/webpack/webpack-cli/pull/1571))
-   💡 remove defaults flag ([#1543](https://github.com/webpack/webpack-cli/pull/1543))
-   refactor info package ([#1382](https://github.com/webpack/webpack-cli/pull/1382))
-   webpack-cli: remove --no-mode flag ([#1503](https://github.com/webpack/webpack-cli/pull/1503))

## Tests

-   ignore type inconsistency for now, fix build ([#1523](https://github.com/webpack/webpack-cli/pull/1523))
-   generator: enable init generator test ([#1233](https://github.com/webpack/webpack-cli/pull/1233))
-   generator: add tests for plugin generator ([#1235](https://github.com/webpack/webpack-cli/pull/1235))
-   generator: enhance init generator tests ([#1236](https://github.com/webpack/webpack-cli/pull/1236))
-   add tests for project root finder util ([#1483](https://github.com/webpack/webpack-cli/pull/1483))
-   --output flag handles invalid arg ([#1751](https://github.com/webpack/webpack-cli/pull/1751))
-   add tests for coffeescript config ([#1749](https://github.com/webpack/webpack-cli/pull/1749))
-   remove --module-rules-options instances ([#1735](https://github.com/webpack/webpack-cli/pull/1735))
-   add tests for optimization mangleExports ([#1724](https://github.com/webpack/webpack-cli/pull/1724))
-   add tests for entry in config ([#1718](https://github.com/webpack/webpack-cli/pull/1718))
-   improve webpackCLITestPlugin ([#1699](https://github.com/webpack/webpack-cli/pull/1699))
-   add more cases in ZeroConfigGroup test ([#1682](https://github.com/webpack/webpack-cli/pull/1682))
-   add scripts to cleanup stale test data ([#1667](https://github.com/webpack/webpack-cli/pull/1667))
-   update stats test case assertion ([#1656](https://github.com/webpack/webpack-cli/pull/1656))
-   add stats with config tests ([#1651](https://github.com/webpack/webpack-cli/pull/1651))
-   add tests for prefetch flag ([#1641](https://github.com/webpack/webpack-cli/pull/1641))
-   add tests to ensure progress plugin is applied only once ([#1777](https://github.com/webpack/webpack-cli/pull/1777))
-   add test for multiple config in dotfolder ([#1631](https://github.com/webpack/webpack-cli/pull/1631))
-   add tests for --hot flag ([#1628](https://github.com/webpack/webpack-cli/pull/1628))
-   create WebpackCLITest Plugin ([#1624](https://github.com/webpack/webpack-cli/pull/1624))
-   add test for progress flag ([#1604](https://github.com/webpack/webpack-cli/pull/1604))
-   create unit test for OutputGroup ([#1579](https://github.com/webpack/webpack-cli/pull/1579))
-   add test for config in init ([#1576](https://github.com/webpack/webpack-cli/pull/1576))
-   add more tests for init ([#1508](https://github.com/webpack/webpack-cli/pull/1508))
-   add cases for json and verbose ([#1573](https://github.com/webpack/webpack-cli/pull/1573))
-   improve --node-args test cases ([#1546](https://github.com/webpack/webpack-cli/pull/1546))
-   add e2e tests for plugin ([#1478](https://github.com/webpack/webpack-cli/pull/1478))
-   add case to ensure entry and output resolve path same way ([#1524](https://github.com/webpack/webpack-cli/pull/1524))
-   add config resolving tests for ConfigGroup ([#1770](https://github.com/webpack/webpack-cli/pull/1770))
-   add test case for mode value none ([#1511](https://github.com/webpack/webpack-cli/pull/1511))
-   loader's tests for errors and warnings ([#1736](https://github.com/webpack/webpack-cli/pull/1736))
-   test case to ensure writing to stdin ([#1501](https://github.com/webpack/webpack-cli/pull/1501))
-   remove temp loader directory before and after test ([#1482](https://github.com/webpack/webpack-cli/pull/1482))
-   fix tests ([#1315](https://github.com/webpack/webpack-cli/pull/1315))
-   add tests for loader command ([#1476](https://github.com/webpack/webpack-cli/pull/1476))
-   remove the redundancy extractSummary method for entry test ([#1313](https://github.com/webpack/webpack-cli/pull/1313))
-   add test for zero config ([#1418](https://github.com/webpack/webpack-cli/pull/1418))
-   add tests for init ([#1419](https://github.com/webpack/webpack-cli/pull/1419))
-   add tests for test utils ([#1451](https://github.com/webpack/webpack-cli/pull/1451))
-   add more tests cases for serve ([#1446](https://github.com/webpack/webpack-cli/pull/1446))
-   add test for entry flag ([#1445](https://github.com/webpack/webpack-cli/pull/1445))
-   webpack-cli: remove intrusive snapshot ([#1293](https://github.com/webpack/webpack-cli/pull/1293))
-   for snapshot config related flags ([#1789](https://github.com/webpack/webpack-cli/pull/1789))
-   generators: added style support tests ([#1471](https://github.com/webpack/webpack-cli/pull/1471))
-   generators: languageSupport ([#1447](https://github.com/webpack/webpack-cli/pull/1447))
-   generators: Add test case for production CSS config ([#1473](https://github.com/webpack/webpack-cli/pull/1473))
-   generators: plugins util tests ([#1448](https://github.com/webpack/webpack-cli/pull/1448))
-   loader-generator: add tests for loader generator ([#1234](https://github.com/webpack/webpack-cli/pull/1234))
-   plugin & loader: refactor tests ([#1787](https://github.com/webpack/webpack-cli/pull/1787))
-   sourcemap: fix flaky stats statement ([#1232](https://github.com/webpack/webpack-cli/pull/1232))
-   webpack-cli: correct descriptions for no-mode test cases ([#1319](https://github.com/webpack/webpack-cli/pull/1319))
-   webpack-cli: add case for mode option none in ZeroConfigGroup ([#1301](https://github.com/webpack/webpack-cli/pull/1301))
-   webpack-cli: add test case for defaults flag ([#1254](https://github.com/webpack/webpack-cli/pull/1254))
-   webpack-cli: add tests for --target flag ([#1548](https://github.com/webpack/webpack-cli/pull/1548))
-   webpack-cli: executer tests ([#1280](https://github.com/webpack/webpack-cli/pull/1280))
-   webpack-cli: correct node-test ([#1455](https://github.com/webpack/webpack-cli/pull/1455))
-   webpack-cli: fix folder structure, add more default tests ([#1258](https://github.com/webpack/webpack-cli/pull/1258))

## Misc

-   feat[utils]: opt to use config schema from core ([#1655](https://github.com/webpack/webpack-cli/pull/1655))
-   migrate to commander ([#1481](https://github.com/webpack/webpack-cli/pull/1481))
-   Fix loader-generator and plugin-generator tests ([#1250](https://github.com/webpack/webpack-cli/pull/1250))
-   Fixing the typos and grammatical errors in Readme files ([#1246](https://github.com/webpack/webpack-cli/pull/1246))
-   remove code: remove unused code ([#1800](https://github.com/webpack/webpack-cli/pull/1800))

<a name="3.3.12"></a>

# 3.3.12 (2020-06-03)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.11...v3.3.12)

## Chore

-   update dependencies

<a name="3.3.11"></a>

# 3.3.11 (2020-02-11)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.10...v3.3.11)

## Chore

-   update dependencies

<a name="3.3.10"></a>

# 3.3.10 (2019-10-31)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.9...v3.3.10)

## New Features

-   add new flag and patch sec dep ([#1102](https://github.com/webpack/webpack-cli/pull/1102))

## Chore

-   remove un-synced tests ([08a7650](https://github.com/webpack/webpack-cli/commit/08a7650))
-   sec patch ([6ad6099](https://github.com/webpack/webpack-cli/commit/6ad6099))

<a name="3.3.9"></a>

# 3.3.9 (2019-09-17)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.8...v3.3.9)

## Fix

-   use process.exitCode instead of process.exit in compilerCallback ([ee001bd](https://github.com/webpack/webpack-cli/commit/ee001bd))

<a name="3.3.8"></a>

# 3.3.8 (2019-09-05)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.7...v3.3.8)

## Chore

-   remove lint err ([4275fd5](https://github.com/webpack/webpack-cli/commit/4275fd5))
-   abstract validation ([065e87e](https://github.com/webpack/webpack-cli/commit/065e87e))
-   vuln patch ([55b770c](https://github.com/webpack/webpack-cli/commit/55b770c))

## Fix

-   support both webpack versions ([d28f9f5](https://github.com/webpack/webpack-cli/commit/d28f9f5))

## Tests

-   add schema tests ([70bf934](https://github.com/webpack/webpack-cli/commit/70bf934))

<a name="3.3.7"></a>

# 3.3.7 (2019-08-18)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.6...v3.3.7)

## Chore

-   resolve differently ([45b9127](https://github.com/webpack/webpack-cli/commit/45b9127))
-   update lockfile & pass nil ([43fc033](https://github.com/webpack/webpack-cli/commit/43fc033))
-   lock deps ([97d5c75](https://github.com/webpack/webpack-cli/commit/97d5c75))
-   lock deps ([635bfa3](https://github.com/webpack/webpack-cli/commit/635bfa3))

## Fix

-   resolve opts when no-config ([fb31cc4](https://github.com/webpack/webpack-cli/commit/fb31cc4))

<a name="3.3.6"></a>

# 3.3.6 (2019-07-14)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.5...v3.3.6)

## Chore

-   serve: refactor code to be more concise ([d2e3e80](https://github.com/webpack/webpack-cli/commit/d2e3e80))
-   utils: fixes typo in scaffold ([bd5c1ce](https://github.com/webpack/webpack-cli/commit/bd5c1ce))
-   fix sec vuln ([110fa5e](https://github.com/webpack/webpack-cli/commit/110fa5e))
-   prevent weird behaviour of pre-commit hook ([#973](https://github.com/webpack/webpack-cli/pull/973))
-   include comments ([941da90](https://github.com/webpack/webpack-cli/commit/941da90))

## Docs

-   remove deprecated packages description ([#979](https://github.com/webpack/webpack-cli/pull/979))

## Fix

-   minor refactor ([a30a027](https://github.com/webpack/webpack-cli/commit/a30a027))
-   update comments ([7553ae7](https://github.com/webpack/webpack-cli/commit/7553ae7))
-   minor fix ([0d9aa9a](https://github.com/webpack/webpack-cli/commit/0d9aa9a))

<a name="3.3.5"></a>

# 3.3.5 (2019-06-23)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.4...v3.3.5)

## Chore

-   remove donation section ([76b75ac](https://github.com/webpack/webpack-cli/commit/76b75ac))
-   update pkg lock ([8913928](https://github.com/webpack/webpack-cli/commit/8913928))
-   deps: update major versions ([#969](https://github.com/webpack/webpack-cli/pull/969))
-   packages: lock dependencies versions ([#958](https://github.com/webpack/webpack-cli/pull/958))
-   scripts: clean opencollective ([cd54ba5](https://github.com/webpack/webpack-cli/commit/cd54ba5))
-   scripts: clean postinstall ([0c1f6b6](https://github.com/webpack/webpack-cli/commit/0c1f6b6))
-   ts: enables source map in the ts ([#961](https://github.com/webpack/webpack-cli/pull/961))
-   added await in order to resolve the pending promise ([#948](https://github.com/webpack/webpack-cli/pull/948))

## CLI

-   remove donation prompt ([a37477d](https://github.com/webpack/webpack-cli/commit/a37477d))

## Fix

-   deps: move prettier from dependencies to devDependencies ([#968](https://github.com/webpack/webpack-cli/pull/968))
-   change "usr strict" to "use strict" ([670efc7](https://github.com/webpack/webpack-cli/commit/670efc7))
-   update deps ([69f364e](https://github.com/webpack/webpack-cli/commit/69f364e))

<a name="3.3.4"></a>

# 3.3.4 (2019-06-11)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/3.3.3...3.3.4)

## New Features

-   add workbox + offline support ([589253e](https://github.com/webpack/webpack-cli/commit/589253e))
-   better defaults ([77bf564](https://github.com/webpack/webpack-cli/commit/77bf564))

## Chore

-   fix prompt ([478340d](https://github.com/webpack/webpack-cli/commit/478340d))
-   improved err msg ([23eddcb](https://github.com/webpack/webpack-cli/commit/23eddcb))
-   removed the commented statement ([bf0efa5](https://github.com/webpack/webpack-cli/commit/bf0efa5))
-   remove unused dep ([7dd8ff2](https://github.com/webpack/webpack-cli/commit/7dd8ff2))
-   fix sec vuln ([545ef3a](https://github.com/webpack/webpack-cli/commit/545ef3a))
-   fix sec vuln ([4760125](https://github.com/webpack/webpack-cli/commit/4760125))
-   readd docs ([830eaf3](https://github.com/webpack/webpack-cli/commit/830eaf3))
-   reset prompting for cmd ([a16f8dc](https://github.com/webpack/webpack-cli/commit/a16f8dc))
-   remove unused file ([a0a06b3](https://github.com/webpack/webpack-cli/commit/a0a06b3))

## Docs

-   added auto flag in docs for init command ([dede7d8](https://github.com/webpack/webpack-cli/commit/dede7d8))

## Fix

-   module not found error ([a2062f2](https://github.com/webpack/webpack-cli/commit/a2062f2))
-   remove unused pkgs and refactor init generator ([7608d4b](https://github.com/webpack/webpack-cli/commit/7608d4b))

## Tests

-   fix failing ones ([d154d0e](https://github.com/webpack/webpack-cli/commit/d154d0e))

## Misc

-   finetune 0cjs ([bd2cd86](https://github.com/webpack/webpack-cli/commit/bd2cd86))
-   improve cjs ([60ecc02](https://github.com/webpack/webpack-cli/commit/60ecc02))

<a name="3.3.3"></a>

# 3.3.3 (2019-06-07)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.2...v3.3.3)

## New Features

-   chore: Added type definitions for the data returned by envinfo ([#921](https://github.com/webpack/webpack-cli/pull/921))
-   add htmlWebpackPlugin in development ([88fcfa8](https://github.com/webpack/webpack-cli/commit/88fcfa8))
-   add mergeHandler ([248b9cc](https://github.com/webpack/webpack-cli/commit/248b9cc))
-   generators: add generated file templates ([6be9291](https://github.com/webpack/webpack-cli/commit/6be9291))
-   init: generate README ([c090b17](https://github.com/webpack/webpack-cli/commit/c090b17))
-   init: generate tsconfig ([25ab7e6](https://github.com/webpack/webpack-cli/commit/25ab7e6))
-   init: support ts in configuration ([283e089](https://github.com/webpack/webpack-cli/commit/283e089))
-   init: wip typescript support ([093a36d](https://github.com/webpack/webpack-cli/commit/093a36d))
-   md: formats md before committing ([#851](https://github.com/webpack/webpack-cli/pull/851))
-   webpack-scaffold: adds Input defaults, doc & tests ([0a648f7](https://github.com/webpack/webpack-cli/commit/0a648f7))

## Chore

-   monorepo version update ([69f7683](https://github.com/webpack/webpack-cli/commit/69f7683))
-   update jest snapshots ([efe8c2a](https://github.com/webpack/webpack-cli/commit/efe8c2a))
-   monorepo version update ([12a38be](https://github.com/webpack/webpack-cli/commit/12a38be))
-   lockfile updates ([2608179](https://github.com/webpack/webpack-cli/commit/2608179))
-   v.3.2.2 until mnorepo versioning ([25c6e7b](https://github.com/webpack/webpack-cli/commit/25c6e7b))
-   update utils version for init pkg ([67b3dc7](https://github.com/webpack/webpack-cli/commit/67b3dc7))
-   monorepo version update ([ace0d4a](https://github.com/webpack/webpack-cli/commit/ace0d4a))
-   lerna independent ([16079a1](https://github.com/webpack/webpack-cli/commit/16079a1))
-   sec fixes ([b9711e8](https://github.com/webpack/webpack-cli/commit/b9711e8))
-   sec patch monorepo ([9b78911](https://github.com/webpack/webpack-cli/commit/9b78911))
-   v.3.3.3 ([d577b0c](https://github.com/webpack/webpack-cli/commit/d577b0c))
-   ast-utils: undo return statements as per review ([418c72c](https://github.com/webpack/webpack-cli/commit/418c72c))
-   dep: commit lock ([5a28a77](https://github.com/webpack/webpack-cli/commit/5a28a77))
-   dep: add eslint-plugin-prettier as dev dep ([98ccd6f](https://github.com/webpack/webpack-cli/commit/98ccd6f))
-   eslint: add eslint-prettier plugin ([671abd5](https://github.com/webpack/webpack-cli/commit/671abd5))
-   interfaces: minor modifications based on reviews ([abb1a48](https://github.com/webpack/webpack-cli/commit/abb1a48))
-   lint: rm unused lint disables ([ae4260a](https://github.com/webpack/webpack-cli/commit/ae4260a))
-   group imports ([7fe04e9](https://github.com/webpack/webpack-cli/commit/7fe04e9))
-   lint: fix code as per conflicting config ([5bf847c](https://github.com/webpack/webpack-cli/commit/5bf847c))
-   reorder imports ([0e0ba8a](https://github.com/webpack/webpack-cli/commit/0e0ba8a))
-   reorder imports ([8a66c21](https://github.com/webpack/webpack-cli/commit/8a66c21))
-   reorder imports ([57b47c3](https://github.com/webpack/webpack-cli/commit/57b47c3))
-   add some comments ([95275ac](https://github.com/webpack/webpack-cli/commit/95275ac))
-   lint: extend prettier config ([5943f26](https://github.com/webpack/webpack-cli/commit/5943f26))
-   lint: add eslint-config-prettier ([4019049](https://github.com/webpack/webpack-cli/commit/4019049))
-   linting ([ba0116a](https://github.com/webpack/webpack-cli/commit/ba0116a))
-   revise typo ([a4597dd](https://github.com/webpack/webpack-cli/commit/a4597dd))
-   lint: format all files as per prettier plugin ([f6992e6](https://github.com/webpack/webpack-cli/commit/f6992e6))
-   remove eslint disable comments ([d72ac08](https://github.com/webpack/webpack-cli/commit/d72ac08))
-   use import instead of require ([5ee4169](https://github.com/webpack/webpack-cli/commit/5ee4169))
-   update variable name ([8e3f4ae](https://github.com/webpack/webpack-cli/commit/8e3f4ae))
-   update error message ([8609b2b](https://github.com/webpack/webpack-cli/commit/8609b2b))
-   create questions.ts ([7481974](https://github.com/webpack/webpack-cli/commit/7481974))
-   revise typo ([be88ca9](https://github.com/webpack/webpack-cli/commit/be88ca9))
-   update lockfiles ([a0216fe](https://github.com/webpack/webpack-cli/commit/a0216fe))
-   deps: update lock file ([ea55cd5](https://github.com/webpack/webpack-cli/commit/ea55cd5))
-   format: fix formatting using prettier ([0b6437e](https://github.com/webpack/webpack-cli/commit/0b6437e))
-   infra: fix typo ([98466d6](https://github.com/webpack/webpack-cli/commit/98466d6))
-   infra: format all staged files on precommit ([2a2e9a1](https://github.com/webpack/webpack-cli/commit/2a2e9a1))
-   infra: fix scripts to format files ([876471c](https://github.com/webpack/webpack-cli/commit/876471c))
-   lint: fix lint warnings ([#926](https://github.com/webpack/webpack-cli/pull/926))
-   refactored the add-generator ([80713fc](https://github.com/webpack/webpack-cli/commit/80713fc))
-   migrate: replaces console with process stream ([1df301d](https://github.com/webpack/webpack-cli/commit/1df301d))
-   refactor: use all utils from the root file in generators ([faabbfb](https://github.com/webpack/webpack-cli/commit/faabbfb))
-   utils: add valueType ([43040fe](https://github.com/webpack/webpack-cli/commit/43040fe))
-   utils: refactor util types ([e7c5170](https://github.com/webpack/webpack-cli/commit/e7c5170))
-   fix azure ([19e039f](https://github.com/webpack/webpack-cli/commit/19e039f))
-   utils: refactors modify config helper ([39be039](https://github.com/webpack/webpack-cli/commit/39be039))
-   utils: refactors ast utils ([9f35073](https://github.com/webpack/webpack-cli/commit/9f35073))
-   add types to import functions ([8b88980](https://github.com/webpack/webpack-cli/commit/8b88980))
-   refactor serve command action handler ([d2c7ae4](https://github.com/webpack/webpack-cli/commit/d2c7ae4))
-   keep lowercase ([c01a80b](https://github.com/webpack/webpack-cli/commit/c01a80b))
-   formatting ([20ff530](https://github.com/webpack/webpack-cli/commit/20ff530))
-   add errors for invalid params ([27c6198](https://github.com/webpack/webpack-cli/commit/27c6198))
-   cli: fixes linting err ([9f1deb2](https://github.com/webpack/webpack-cli/commit/9f1deb2))
-   utils: seperates interfaces from the core module ([d0a4177](https://github.com/webpack/webpack-cli/commit/d0a4177))
-   remove trivial type ([5e23da2](https://github.com/webpack/webpack-cli/commit/5e23da2))
-   create isImportPresent ([a89645a](https://github.com/webpack/webpack-cli/commit/a89645a))
-   use replaceWith ([6a7e662](https://github.com/webpack/webpack-cli/commit/6a7e662))
-   update prop name ([55d237b](https://github.com/webpack/webpack-cli/commit/55d237b))
-   update parseMerge ([b6a438d](https://github.com/webpack/webpack-cli/commit/b6a438d))
-   fix linting ([c7c1a83](https://github.com/webpack/webpack-cli/commit/c7c1a83))
-   format and revise code w.r.t style ([e9d426d](https://github.com/webpack/webpack-cli/commit/e9d426d))
-   make config const ([445ab31](https://github.com/webpack/webpack-cli/commit/445ab31))
-   update parseMerge ([cf85535](https://github.com/webpack/webpack-cli/commit/cf85535))
-   pluginarrlength for length of the plugin ([4872416](https://github.com/webpack/webpack-cli/commit/4872416))
-   made condition strict ([88eec7c](https://github.com/webpack/webpack-cli/commit/88eec7c))
-   update types of the config ([a2c49e2](https://github.com/webpack/webpack-cli/commit/a2c49e2))
-   update variable name ([1323bbf](https://github.com/webpack/webpack-cli/commit/1323bbf))
-   revise SECURITY.md ([2a9e304](https://github.com/webpack/webpack-cli/commit/2a9e304))
-   revise SECURITY.md ([9cdc357](https://github.com/webpack/webpack-cli/commit/9cdc357))
-   revise version support ([90f397c](https://github.com/webpack/webpack-cli/commit/90f397c))
-   add JSDoc descriptions ([e023d23](https://github.com/webpack/webpack-cli/commit/e023d23))
-   lint ([cb5a15f](https://github.com/webpack/webpack-cli/commit/cb5a15f))
-   lint ([0782944](https://github.com/webpack/webpack-cli/commit/0782944))
-   lint ([5778bdf](https://github.com/webpack/webpack-cli/commit/5778bdf))
-   ci: add node 12 ([#872](https://github.com/webpack/webpack-cli/pull/872))
-   cli: fixes code indentation ([ff263f9](https://github.com/webpack/webpack-cli/commit/ff263f9))
-   cli: cleanup ([ed4095f](https://github.com/webpack/webpack-cli/commit/ed4095f))
-   cli: remove findup-sync from package dir and move to utils ([fe9c289](https://github.com/webpack/webpack-cli/commit/fe9c289))
-   cli: move constants to a separate file ([#798](https://github.com/webpack/webpack-cli/pull/798))
-   plugins.ts: added if-stmt for native plugins ([fc9e259](https://github.com/webpack/webpack-cli/commit/fc9e259))
-   refactor: move questions to utils ([915c4ab](https://github.com/webpack/webpack-cli/commit/915c4ab))
-   refactor: add generator ([66bde9f](https://github.com/webpack/webpack-cli/commit/66bde9f))
-   utils: fix deprecated babylon ([99304c4](https://github.com/webpack/webpack-cli/commit/99304c4))
-   loop change ([818e43e](https://github.com/webpack/webpack-cli/commit/818e43e))
-   add sec & versioning policy ([5e33f8a](https://github.com/webpack/webpack-cli/commit/5e33f8a))
-   add-generator: changed the naming of the plugin in config file ([7fbc3a4](https://github.com/webpack/webpack-cli/commit/7fbc3a4))
-   github: add sponsor button ([88f2408](https://github.com/webpack/webpack-cli/commit/88f2408))
-   refactor: update package list ([e5c7f67](https://github.com/webpack/webpack-cli/commit/e5c7f67))
-   style: fixed the indentation ([e583aab](https://github.com/webpack/webpack-cli/commit/e583aab))
-   added a generatePluginName method in generators utils ([7d83453](https://github.com/webpack/webpack-cli/commit/7d83453))
-   refactor: move schema to utils ([2299848](https://github.com/webpack/webpack-cli/commit/2299848))
-   refactor: add generator ([d901d49](https://github.com/webpack/webpack-cli/commit/d901d49))
-   util: use relative for now ([5a0952e](https://github.com/webpack/webpack-cli/commit/5a0952e))
-   utils: use absolute path ([00a6348](https://github.com/webpack/webpack-cli/commit/00a6348))

## CLI

-   fix watch options for array config ([#892](https://github.com/webpack/webpack-cli/pull/892))

## Docs

-   contribute: adds section seperator ([cff0c55](https://github.com/webpack/webpack-cli/commit/cff0c55))
-   contribute: combines seperate sections for npm and yarn ([aefa8eb](https://github.com/webpack/webpack-cli/commit/aefa8eb))
-   contributing: updates the docs for the test ([7656637](https://github.com/webpack/webpack-cli/commit/7656637))
-   fix link to webpack-scaffold ([de0b4a0](https://github.com/webpack/webpack-cli/commit/de0b4a0))
-   init: improve description ([9856bab](https://github.com/webpack/webpack-cli/commit/9856bab))
-   utils: update prettier ([8b6d47b](https://github.com/webpack/webpack-cli/commit/8b6d47b))

## Fix

-   improve checking file permission ([de41351](https://github.com/webpack/webpack-cli/commit/de41351))
-   chore: Minor fix ([6810182](https://github.com/webpack/webpack-cli/commit/6810182))
-   use fork cause original repo is unmaintained ([383125a](https://github.com/webpack/webpack-cli/commit/383125a))
-   add: apply suggestions ([ccf0dce](https://github.com/webpack/webpack-cli/commit/ccf0dce))
-   add: add handling of merge option ([eb43443](https://github.com/webpack/webpack-cli/commit/eb43443))
-   add: add handling of merge option ([ce51a0a](https://github.com/webpack/webpack-cli/commit/ce51a0a))
-   ci: fixes linting error in ci ([cfc0117](https://github.com/webpack/webpack-cli/commit/cfc0117))
-   cli: updates err message ([b5e1913](https://github.com/webpack/webpack-cli/commit/b5e1913))
-   cli: removes the comment before err handling block ([ac5a53f](https://github.com/webpack/webpack-cli/commit/ac5a53f))
-   cli: --config-register resolves relative to root ([23375bd](https://github.com/webpack/webpack-cli/commit/23375bd))
-   cli: removes func return in catch instance ([7d31321](https://github.com/webpack/webpack-cli/commit/7d31321))
-   cli: sets stack trace limit ([869024f](https://github.com/webpack/webpack-cli/commit/869024f))
-   cli: err when no args passed, refactored nested conditional blocks ([a9bc0bd](https://github.com/webpack/webpack-cli/commit/a9bc0bd))
-   cli: shows error message based on package manager ([a3ce273](https://github.com/webpack/webpack-cli/commit/a3ce273))
-   cli: error when no webpack and args found ([2250af0](https://github.com/webpack/webpack-cli/commit/2250af0))
-   generator: fixed the support of native plugins in add command ([123a150](https://github.com/webpack/webpack-cli/commit/123a150))
-   infra: fixes npm run docs ([65c08e2](https://github.com/webpack/webpack-cli/commit/65c08e2))
-   formatting files ([eb3909b](https://github.com/webpack/webpack-cli/commit/eb3909b))
-   remove type from inherited type ([960e73a](https://github.com/webpack/webpack-cli/commit/960e73a))
-   remove type from inherited type ([0552f76](https://github.com/webpack/webpack-cli/commit/0552f76))
-   change parser options ([4e8bc76](https://github.com/webpack/webpack-cli/commit/4e8bc76))
-   json module resolve ([61697b8](https://github.com/webpack/webpack-cli/commit/61697b8))
-   cli: improves error handling with args ([cc64955](https://github.com/webpack/webpack-cli/commit/cc64955))
-   generator: generate correct module.rule for babel & ts ([263b83c](https://github.com/webpack/webpack-cli/commit/263b83c))
-   generator: using configFile in configPath to get the config file name ([#883](https://github.com/webpack/webpack-cli/pull/883))
-   genrators/utils/style: typo & fix ([f46f4e5](https://github.com/webpack/webpack-cli/commit/f46f4e5))

## Tests

-   inputvalidate: remove undefined ([fb25bd2](https://github.com/webpack/webpack-cli/commit/fb25bd2))

## Misc

-   update internal docs ([7071b5c](https://github.com/webpack/webpack-cli/commit/7071b5c))
-   add lerna publish cmnd ([5c8c6a1](https://github.com/webpack/webpack-cli/commit/5c8c6a1))
-   generators: remove comment ([bd06a69](https://github.com/webpack/webpack-cli/commit/bd06a69))
-   generators: refactor ([376dcbd](https://github.com/webpack/webpack-cli/commit/376dcbd))
-   generators: small text improvements ([782f56c](https://github.com/webpack/webpack-cli/commit/782f56c))
-   generators: improve prompts ([ac35a31](https://github.com/webpack/webpack-cli/commit/ac35a31))
-   generators: refactor init-generator ([d574846](https://github.com/webpack/webpack-cli/commit/d574846))
-   generators: refactor utils ([17e4511](https://github.com/webpack/webpack-cli/commit/17e4511))
-   generators/utils/style: refactor ([392fcfe](https://github.com/webpack/webpack-cli/commit/392fcfe))
-   init: refactor with async/await ([1b07d2b](https://github.com/webpack/webpack-cli/commit/1b07d2b))
-   init: small refactor ([4627ea1](https://github.com/webpack/webpack-cli/commit/4627ea1))
-   init-generator: improve readme ([f971632](https://github.com/webpack/webpack-cli/commit/f971632))
-   init-generator: small refactor ([dcf44c1](https://github.com/webpack/webpack-cli/commit/dcf44c1))
-   init-generator: use webpackOption types, improve test rules ([a650e0e](https://github.com/webpack/webpack-cli/commit/a650e0e))
-   init-generator: improve types & defaults ([fb23aa4](https://github.com/webpack/webpack-cli/commit/fb23aa4))
-   packages: complete rebase ([488b06c](https://github.com/webpack/webpack-cli/commit/488b06c))
-   types: correct types ([85ef3e7](https://github.com/webpack/webpack-cli/commit/85ef3e7))

<a name="3.3.2"></a>

# 3.3.2 (2019-05-04)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.1.5...v3.3.2)

## New Features

-   opencollective prompt: add option to disable it + doc ([d4643ae](https://github.com/webpack/webpack-cli/commit/d4643ae))
-   terser: clean old files ([89e6b74](https://github.com/webpack/webpack-cli/commit/89e6b74))
-   terser: remove leftover files ([27d5b4d](https://github.com/webpack/webpack-cli/commit/27d5b4d))
-   terser: replace after merging master ([c404655](https://github.com/webpack/webpack-cli/commit/c404655))
-   replace Uglify with Terser in generators ([2b8651b](https://github.com/webpack/webpack-cli/commit/2b8651b))
-   use terserPlugin in loaderOptionsPlugin ([14f5337](https://github.com/webpack/webpack-cli/commit/14f5337))
-   use terserJsPlugin for transformations during migrate ([33c6185](https://github.com/webpack/webpack-cli/commit/33c6185))
-   replace uglifyJsPlugin with terserPlugin in migrate ([d467f3b](https://github.com/webpack/webpack-cli/commit/d467f3b))
-   opencollective prompt: work on windows setting atime by code ([3af73a8](https://github.com/webpack/webpack-cli/commit/3af73a8))
-   opencollective prompt: fix typo ([c2351b1](https://github.com/webpack/webpack-cli/commit/c2351b1))
-   opencollective prompt: remove .lastocprint file from fs ([b96ad56](https://github.com/webpack/webpack-cli/commit/b96ad56))
-   opencollective prompt: extract weekday to variable ([790d27a](https://github.com/webpack/webpack-cli/commit/790d27a))
-   opencollective prompt: set terminal cols to 80 ([badc32d](https://github.com/webpack/webpack-cli/commit/badc32d))
-   opencollective prompt: fix azure ci ([ea0039a](https://github.com/webpack/webpack-cli/commit/ea0039a))
-   opencollective prompt: lint ([ea906d8](https://github.com/webpack/webpack-cli/commit/ea906d8))
-   opencollective prompt: clear package.json modifications ([f080733](https://github.com/webpack/webpack-cli/commit/f080733))
-   opencollective prompt: add prompt in postinstall script ([dd9d528](https://github.com/webpack/webpack-cli/commit/dd9d528))

## Ast

-   change tooltip property from uglify to terser ([ea9e4b8](https://github.com/webpack/webpack-cli/commit/ea9e4b8))
-   replace requires and inits for uglify with terser ([3011a6c](https://github.com/webpack/webpack-cli/commit/3011a6c))
-   replace UglifyJsPlugin with TerserPlugin ([21da35f](https://github.com/webpack/webpack-cli/commit/21da35f))

## Chore

-   cli: move constants to a separate file ([#798](https://github.com/webpack/webpack-cli/pull/798))
-   deps: fix security vulnerabilities ([#857](https://github.com/webpack/webpack-cli/pull/857))
-   deps: upgrade lerna to fix vulnerabilities & update webpack-dev-server ([#823](https://github.com/webpack/webpack-cli/pull/823))
-   docs: minor fixes in the docs ([#874](https://github.com/webpack/webpack-cli/pull/874))
-   docs: removes scaffolding docs from the root ([8c1db03](https://github.com/webpack/webpack-cli/commit/8c1db03))
-   junit: reverting the junit.xml ([80fd4fa](https://github.com/webpack/webpack-cli/commit/80fd4fa))
-   travis: removed stable ([#871](https://github.com/webpack/webpack-cli/pull/871))
-   types: move to @types/yeoman-generator ([#869](https://github.com/webpack/webpack-cli/pull/869))
-   addon generator to async/await ([#849](https://github.com/webpack/webpack-cli/pull/849))
-   v.3.1.1 ([d3f8e20](https://github.com/webpack/webpack-cli/commit/d3f8e20))
-   tests: updated test regex, some helper scripts ([#809](https://github.com/webpack/webpack-cli/pull/809))
-   types: add type information ([#791](https://github.com/webpack/webpack-cli/pull/791))
-   replace instances of uglify with terser ([f9cb8ce](https://github.com/webpack/webpack-cli/commit/f9cb8ce))
-   use actual package name in comment about removing uglify ([b1cf4cc](https://github.com/webpack/webpack-cli/commit/b1cf4cc))
-   align file in the same way as other terserPlugin test fixtures ([b6c6484](https://github.com/webpack/webpack-cli/commit/b6c6484))
-   remove gitHash from package.json ([2af08be](https://github.com/webpack/webpack-cli/commit/2af08be))

## Docs

-   code of conduct ([#873](https://github.com/webpack/webpack-cli/pull/873))
-   contribute: adds table of contents and info about dependencies. ([#842](https://github.com/webpack/webpack-cli/pull/842))
-   contributing: fixes dead link ([#835](https://github.com/webpack/webpack-cli/pull/835))
-   opencollective prompt: improve code clarity ([55992a4](https://github.com/webpack/webpack-cli/commit/55992a4))
-   packages: adds downloads/month shield ([6a0375a](https://github.com/webpack/webpack-cli/commit/6a0375a))
-   readme: fix typos, add summary of all commands ([#845](https://github.com/webpack/webpack-cli/pull/845))
-   readme: adds contributors shield ([958d064](https://github.com/webpack/webpack-cli/commit/958d064))
-   README: phrase change ([3a11a16](https://github.com/webpack/webpack-cli/commit/3a11a16))
-   README: add link to webpack-scaffold-starter ([e35a194](https://github.com/webpack/webpack-cli/commit/e35a194))
-   README: update scaffolding links ([74179b5](https://github.com/webpack/webpack-cli/commit/74179b5))
-   serve: link to webpack-dev-server ([cb68b1b](https://github.com/webpack/webpack-cli/commit/cb68b1b))
-   serve: update docs to use webpack-dev-server ([f7451d4](https://github.com/webpack/webpack-cli/commit/f7451d4))
-   replace tooltip link to terser plugin ([4254730](https://github.com/webpack/webpack-cli/commit/4254730))
-   replace Uglify with Terser in comments ([799577d](https://github.com/webpack/webpack-cli/commit/799577d))
-   replace UglifyJsPlugin with TerserPlugin in migrate docs ([326f783](https://github.com/webpack/webpack-cli/commit/326f783))

## Enh

-   webpack-scaffold: improve prompt and doc ([#794](https://github.com/webpack/webpack-cli/pull/794))

## Fix

-   add: add types ([d4ce6f2](https://github.com/webpack/webpack-cli/commit/d4ce6f2))
-   add: fix runTransform ([dbc3e9e](https://github.com/webpack/webpack-cli/commit/dbc3e9e))
-   add: lint code ([163b309](https://github.com/webpack/webpack-cli/commit/163b309))
-   add: add handling for topScope ([1162cf5](https://github.com/webpack/webpack-cli/commit/1162cf5))
-   bin, serve: force default package export, add serve default ([#815](https://github.com/webpack/webpack-cli/pull/815))
-   init: refactored the init.ts success message ([#810](https://github.com/webpack/webpack-cli/pull/810))
-   opencollective prompt: fix grammar ([246db42](https://github.com/webpack/webpack-cli/commit/246db42))
-   opencollective-prompt: check write permissions ([5284b7e](https://github.com/webpack/webpack-cli/commit/5284b7e))
-   scaffold: config file is always generated at the project root ([#801](https://github.com/webpack/webpack-cli/pull/801))
-   utils: refactors utils ([7fe3543](https://github.com/webpack/webpack-cli/commit/7fe3543))
-   clear up comment about default function purpose ([e48507d](https://github.com/webpack/webpack-cli/commit/e48507d))
-   remove unused files ([ec242ab](https://github.com/webpack/webpack-cli/commit/ec242ab))
-   reset files ([9863445](https://github.com/webpack/webpack-cli/commit/9863445))
-   replace lookups for TerserPlugin in webpack.optimise ([ef23fec](https://github.com/webpack/webpack-cli/commit/ef23fec))

## Tests

-   update snapshots ([ce9fbc8](https://github.com/webpack/webpack-cli/commit/ce9fbc8))
-   replace uglify with terser in ast-utils tests ([73f493f](https://github.com/webpack/webpack-cli/commit/73f493f))
-   migration: typescript ([#613](https://github.com/webpack/webpack-cli/pull/613))

## Misc

-   chore(docs): Refactors links for badges ([#859](https://github.com/webpack/webpack-cli/pull/859))
-   opencollective-prompt: improve grammar ([e17a26d](https://github.com/webpack/webpack-cli/commit/e17a26d))
-   Remove tslint in favour of eslint ([#834](https://github.com/webpack/webpack-cli/pull/834))
-   cli: refactor functions into utils and config dirs, merge yargs options ([#781](https://github.com/webpack/webpack-cli/pull/781))
-   utils: refactors scaffold ([0b28fb3](https://github.com/webpack/webpack-cli/commit/0b28fb3))

<a name="3.3.1"></a>

# 3.3.1 (2019-04-21)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.1.5...v3.3.1)

## New Features

-   terser: clean old files ([89e6b74](https://github.com/webpack/webpack-cli/commit/89e6b74))
-   terser: remove leftover files ([27d5b4d](https://github.com/webpack/webpack-cli/commit/27d5b4d))
-   terser: replace after merging master ([c404655](https://github.com/webpack/webpack-cli/commit/c404655))
-   replace Uglify with Terser in generators ([2b8651b](https://github.com/webpack/webpack-cli/commit/2b8651b))
-   use terserPlugin in loaderOptionsPlugin ([14f5337](https://github.com/webpack/webpack-cli/commit/14f5337))
-   use terserJsPlugin for transformations during migrate ([33c6185](https://github.com/webpack/webpack-cli/commit/33c6185))
-   replace uglifyJsPlugin with terserPlugin in migrate ([d467f3b](https://github.com/webpack/webpack-cli/commit/d467f3b))
-   opencollective prompt: work on windows setting atime by code ([3af73a8](https://github.com/webpack/webpack-cli/commit/3af73a8))
-   opencollective prompt: fix typo ([c2351b1](https://github.com/webpack/webpack-cli/commit/c2351b1))
-   opencollective prompt: remove .lastocprint file from fs ([b96ad56](https://github.com/webpack/webpack-cli/commit/b96ad56))
-   opencollective prompt: extract weekday to variable ([790d27a](https://github.com/webpack/webpack-cli/commit/790d27a))
-   opencollective prompt: set terminal cols to 80 ([badc32d](https://github.com/webpack/webpack-cli/commit/badc32d))
-   opencollective prompt: fix azure ci ([ea0039a](https://github.com/webpack/webpack-cli/commit/ea0039a))
-   opencollective prompt: lint ([ea906d8](https://github.com/webpack/webpack-cli/commit/ea906d8))
-   opencollective prompt: clear package.json modifications ([f080733](https://github.com/webpack/webpack-cli/commit/f080733))
-   opencollective prompt: add prompt in postinstall script ([dd9d528](https://github.com/webpack/webpack-cli/commit/dd9d528))

## Ast

-   change tooltip property from uglify to terser ([ea9e4b8](https://github.com/webpack/webpack-cli/commit/ea9e4b8))
-   replace requires and inits for uglify with terser ([3011a6c](https://github.com/webpack/webpack-cli/commit/3011a6c))
-   replace UglifyJsPlugin with TerserPlugin ([21da35f](https://github.com/webpack/webpack-cli/commit/21da35f))

## Chore

-   cli: move constants to a separate file ([#798](https://github.com/webpack/webpack-cli/pull/798))
-   deps: upgrade lerna to fix vulnerabilities & update webpack-dev-server ([#823](https://github.com/webpack/webpack-cli/pull/823))
-   docs: removes scaffolding docs from the root ([8c1db03](https://github.com/webpack/webpack-cli/commit/8c1db03))
-   junit: reverting the junit.xml ([80fd4fa](https://github.com/webpack/webpack-cli/commit/80fd4fa))
-   tests: updated test regex, some helper scripts ([#809](https://github.com/webpack/webpack-cli/pull/809))
-   types: add type information ([#791](https://github.com/webpack/webpack-cli/pull/791))
-   replace instances of uglify with terser ([f9cb8ce](https://github.com/webpack/webpack-cli/commit/f9cb8ce))
-   use actual package name in comment about removing uglify ([b1cf4cc](https://github.com/webpack/webpack-cli/commit/b1cf4cc))
-   align file in the same way as other terserPlugin test fixtures ([b6c6484](https://github.com/webpack/webpack-cli/commit/b6c6484))
-   remove gitHash from package.json ([2af08be](https://github.com/webpack/webpack-cli/commit/2af08be))

## Docs

-   contributing: fixes dead link ([#835](https://github.com/webpack/webpack-cli/pull/835))
-   opencollective prompt: improve code clarity ([55992a4](https://github.com/webpack/webpack-cli/commit/55992a4))
-   packages: adds downloads/month shield ([6a0375a](https://github.com/webpack/webpack-cli/commit/6a0375a))
-   readme: adds contributors shield ([958d064](https://github.com/webpack/webpack-cli/commit/958d064))
-   README: phrase change ([3a11a16](https://github.com/webpack/webpack-cli/commit/3a11a16))
-   README: add link to webpack-scaffold-starter ([e35a194](https://github.com/webpack/webpack-cli/commit/e35a194))
-   README: update scaffolding links ([74179b5](https://github.com/webpack/webpack-cli/commit/74179b5))
-   serve: link to webpack-dev-server ([cb68b1b](https://github.com/webpack/webpack-cli/commit/cb68b1b))
-   serve: update docs to use webpack-dev-server ([f7451d4](https://github.com/webpack/webpack-cli/commit/f7451d4))
-   replace tooltip link to terser plugin ([4254730](https://github.com/webpack/webpack-cli/commit/4254730))
-   replace Uglify with Terser in comments ([799577d](https://github.com/webpack/webpack-cli/commit/799577d))
-   replace UglifyJsPlugin with TerserPlugin in migrate docs ([326f783](https://github.com/webpack/webpack-cli/commit/326f783))

## Enh

-   webpack-scaffold: improve prompt and doc ([#794](https://github.com/webpack/webpack-cli/pull/794))

## Fix

-   add: add types ([d4ce6f2](https://github.com/webpack/webpack-cli/commit/d4ce6f2))
-   add: fix runTransform ([dbc3e9e](https://github.com/webpack/webpack-cli/commit/dbc3e9e))
-   add: lint code ([163b309](https://github.com/webpack/webpack-cli/commit/163b309))
-   add: add handling for topScope ([1162cf5](https://github.com/webpack/webpack-cli/commit/1162cf5))
-   bin, serve: force default package export, add serve default ([#815](https://github.com/webpack/webpack-cli/pull/815))
-   init: refactored the init.ts success message ([#810](https://github.com/webpack/webpack-cli/pull/810))
-   scaffold: config file is always generated at the project root ([#801](https://github.com/webpack/webpack-cli/pull/801))
-   utils: refactors utils ([7fe3543](https://github.com/webpack/webpack-cli/commit/7fe3543))
-   clear up comment about default function purpose ([e48507d](https://github.com/webpack/webpack-cli/commit/e48507d))
-   remove unused files ([ec242ab](https://github.com/webpack/webpack-cli/commit/ec242ab))
-   reset files ([9863445](https://github.com/webpack/webpack-cli/commit/9863445))
-   replace lookups for TerserPlugin in webpack.optimise ([ef23fec](https://github.com/webpack/webpack-cli/commit/ef23fec))

## Tests

-   update snapshots ([ce9fbc8](https://github.com/webpack/webpack-cli/commit/ce9fbc8))
-   replace uglify with terser in ast-utils tests ([73f493f](https://github.com/webpack/webpack-cli/commit/73f493f))
-   migration: typescript ([#613](https://github.com/webpack/webpack-cli/pull/613))

## Misc

-   Remove tslint in favour of eslint ([#834](https://github.com/webpack/webpack-cli/pull/834))
-   cli: refactor functions into utils and config dirs, merge yargs options ([#781](https://github.com/webpack/webpack-cli/pull/781))
-   utils: refactors scaffold ([0b28fb3](https://github.com/webpack/webpack-cli/commit/0b28fb3))

<a name="3.3.0"></a>

# 3.3.0 (2019-03-15)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.1.3...v3.3.0)

## New Features

-   use webpack.config as default name in dev scaffold ([385a672](https://github.com/webpack/webpack-cli/commit/385a672))
-   only display once a week ([b6199e5](https://github.com/webpack/webpack-cli/commit/b6199e5))
-   add util to run-and-get watch proc ([1d2ccd5](https://github.com/webpack/webpack-cli/commit/1d2ccd5))
-   add test-util to append data to file ([e9e1dcb](https://github.com/webpack/webpack-cli/commit/e9e1dcb))
-   log: clean single line logs ([5d2284b](https://github.com/webpack/webpack-cli/commit/5d2284b))
-   log: add gitignore ([7c830b5](https://github.com/webpack/webpack-cli/commit/7c830b5))
-   log: make log package ([df7c224](https://github.com/webpack/webpack-cli/commit/df7c224))
-   log: add clrscr function ([11b3bff](https://github.com/webpack/webpack-cli/commit/11b3bff))
-   log: few changes ([bc32727](https://github.com/webpack/webpack-cli/commit/bc32727))
-   log: add newline for title ([4047213](https://github.com/webpack/webpack-cli/commit/4047213))
-   log: remove unwanted commits ([c088f3e](https://github.com/webpack/webpack-cli/commit/c088f3e))
-   log: task based custom loggers ([2c43a41](https://github.com/webpack/webpack-cli/commit/2c43a41))

## Chore

-   revise typo ([a14908e](https://github.com/webpack/webpack-cli/commit/a14908e))
-   deps: @std/esm -> esm ([a8b46bf](https://github.com/webpack/webpack-cli/commit/a8b46bf))
-   remove commit lint from travis ([ccec130](https://github.com/webpack/webpack-cli/commit/ccec130))
-   revise contributing location ([13a3a87](https://github.com/webpack/webpack-cli/commit/13a3a87))
-   deps: fix vulnerabilities ([c632d1a](https://github.com/webpack/webpack-cli/commit/c632d1a))
-   tests: skipping broken test ([f7b6b3a](https://github.com/webpack/webpack-cli/commit/f7b6b3a))
-   rewrite changelog ([62ab32d](https://github.com/webpack/webpack-cli/commit/62ab32d))
-   v.3.2.3 ([70138b7](https://github.com/webpack/webpack-cli/commit/70138b7))
-   v.3.2.2 ([24b6387](https://github.com/webpack/webpack-cli/commit/24b6387))
-   update tests ([70bfbd9](https://github.com/webpack/webpack-cli/commit/70bfbd9))
-   one liner ([0f55d5a](https://github.com/webpack/webpack-cli/commit/0f55d5a))
-   one liner after log ([6d8fb67](https://github.com/webpack/webpack-cli/commit/6d8fb67))
-   watch: remove console log ([0952317](https://github.com/webpack/webpack-cli/commit/0952317))
-   v.3.2.1 ([54805ae](https://github.com/webpack/webpack-cli/commit/54805ae))
-   dependency: add `node-ts` as devDependency ([#724](https://github.com/webpack/webpack-cli/pull/724))

## Docs

-   scaffolding: lowercase Webpack ([d19c1f7](https://github.com/webpack/webpack-cli/commit/d19c1f7))
-   scaffolding: fix typos ([b94b0de](https://github.com/webpack/webpack-cli/commit/b94b0de))
-   scaffolding: improve grammar ([6b79072](https://github.com/webpack/webpack-cli/commit/6b79072))
-   add lerna badge in README ([#786](https://github.com/webpack/webpack-cli/pull/786))
-   contributing: refactor & formatting ([1042cb2](https://github.com/webpack/webpack-cli/commit/1042cb2))
-   contributing: improve formatting ([47fcd7f](https://github.com/webpack/webpack-cli/commit/47fcd7f))
-   contributing: : at the end of paragraphs ([48d65fd](https://github.com/webpack/webpack-cli/commit/48d65fd))
-   contributing: update instructions to run individual tests ([b7cca58](https://github.com/webpack/webpack-cli/commit/b7cca58))
-   contributing: update instructions to run individual tests ([bc0297a](https://github.com/webpack/webpack-cli/commit/bc0297a))
-   contributing: add yarn before running jest ([126cf55](https://github.com/webpack/webpack-cli/commit/126cf55))
-   contributing: commands to install jest globally ([18b7c2e](https://github.com/webpack/webpack-cli/commit/18b7c2e))
-   contributing: fixes typo ([c458380](https://github.com/webpack/webpack-cli/commit/c458380))
-   contributing: improves formatting ([abac823](https://github.com/webpack/webpack-cli/commit/abac823))
-   contributing: adds prebuild instructions ([81cb46a](https://github.com/webpack/webpack-cli/commit/81cb46a))
-   readme: add downloads badge ([dc2423c](https://github.com/webpack/webpack-cli/commit/dc2423c))
-   scaffold: add link option for local ([f8424be](https://github.com/webpack/webpack-cli/commit/f8424be))
-   scaffold: Add installation guide for packages/webpack-scaffold ([#727](https://github.com/webpack/webpack-cli/pull/727))
-   scaffolding: fix typo ([98818a1](https://github.com/webpack/webpack-cli/commit/98818a1))
-   scaffolding: improve description & formatting ([0f657d0](https://github.com/webpack/webpack-cli/commit/0f657d0))
-   scaffolding: fix links ([e11c524](https://github.com/webpack/webpack-cli/commit/e11c524))
-   scaffolding: add yarn example ([d47eea0](https://github.com/webpack/webpack-cli/commit/d47eea0))
-   scaffolding: fix typo ([87ba169](https://github.com/webpack/webpack-cli/commit/87ba169))
-   scaffolding: improved structure, formatting, typos ([8949f82](https://github.com/webpack/webpack-cli/commit/8949f82))
-   init documentaion ([4b130bb](https://github.com/webpack/webpack-cli/commit/4b130bb))
-   rename Webpack to webpack ([900c13e](https://github.com/webpack/webpack-cli/commit/900c13e))
-   init documentaion ([14d2b47](https://github.com/webpack/webpack-cli/commit/14d2b47))

## Fix

-   bin: use compiler.close API correctly for stats ([568161d](https://github.com/webpack/webpack-cli/commit/568161d))
-   bin: extension detection ([#724](https://github.com/webpack/webpack-cli/pull/724))
-   init: lint code ([20aab48](https://github.com/webpack/webpack-cli/commit/20aab48))
-   init: support global installation ([1cb0166](https://github.com/webpack/webpack-cli/commit/1cb0166))
-   init: revert to local installation ([48b3b23](https://github.com/webpack/webpack-cli/commit/48b3b23))
-   init: update prompt command ([c1c0739](https://github.com/webpack/webpack-cli/commit/c1c0739))
-   init: update prompt command ([1cab3cb](https://github.com/webpack/webpack-cli/commit/1cab3cb))
-   readme: remove old dependency status link ([4df0000](https://github.com/webpack/webpack-cli/commit/4df0000))
-   readme: add fallback badge for dependency status ([0e3753b](https://github.com/webpack/webpack-cli/commit/0e3753b))
-   tests: remove snapshot for static compilation ([54a3ac4](https://github.com/webpack/webpack-cli/commit/54a3ac4))
-   tests: remove snapshot for static compilation ([3af0948](https://github.com/webpack/webpack-cli/commit/3af0948))
-   tests: update jest ([d195774](https://github.com/webpack/webpack-cli/commit/d195774))
-   close compiler, own sh script and output clearing ([6ded275](https://github.com/webpack/webpack-cli/commit/6ded275))
-   failing test ([88888bb](https://github.com/webpack/webpack-cli/commit/88888bb))
-   failing test ([986472a](https://github.com/webpack/webpack-cli/commit/986472a))
-   test: fix travis ts build ([22d3acc](https://github.com/webpack/webpack-cli/commit/22d3acc))

## Tests

-   azure pipelines ([c9c3fea](https://github.com/webpack/webpack-cli/commit/c9c3fea))
-   bin: add `webpack.config.ts` related test ([#724](https://github.com/webpack/webpack-cli/pull/724))
-   bin: add `webpack.config.babel.js` related test ([#724](https://github.com/webpack/webpack-cli/pull/724))
-   module: use extractSummary ([7bde073](https://github.com/webpack/webpack-cli/commit/7bde073))
-   watch: use copyFile functionality ([c61fe92](https://github.com/webpack/webpack-cli/commit/c61fe92))
-   add copyFile function in test-utils ([1b21e81](https://github.com/webpack/webpack-cli/commit/1b21e81))
-   config-file: use extractSummary ([7554fe7](https://github.com/webpack/webpack-cli/commit/7554fe7))
-   config-name: use extractSummary ([3e30a57](https://github.com/webpack/webpack-cli/commit/3e30a57))
-   env: use extractSummary ([aa0cf25](https://github.com/webpack/webpack-cli/commit/aa0cf25))
-   fix: fix failing tests ([5669311](https://github.com/webpack/webpack-cli/commit/5669311))
-   fix: fix failing tests ([f1f7db1](https://github.com/webpack/webpack-cli/commit/f1f7db1))
-   help: use extractSummary ([0ba72c4](https://github.com/webpack/webpack-cli/commit/0ba72c4))
-   watch: use switch pattern for verbosity off ([c00386b](https://github.com/webpack/webpack-cli/commit/c00386b))
-   watch: hash assertion for single-config-opt ([55632d6](https://github.com/webpack/webpack-cli/commit/55632d6))
-   watch: hash assertion for single-config ([48f34d1](https://github.com/webpack/webpack-cli/commit/48f34d1))
-   watch: hash assertion for multi-config-watch-opt ([6dd2327](https://github.com/webpack/webpack-cli/commit/6dd2327))
-   watch: hash assertion multi-config ([6b4d339](https://github.com/webpack/webpack-cli/commit/6b4d339))
-   watch: hash assertion info-verbosity-verbose ([42e5ee8](https://github.com/webpack/webpack-cli/commit/42e5ee8))
-   watch: remove test.only for info-verbosity-off ([675d5c0](https://github.com/webpack/webpack-cli/commit/675d5c0))
-   improve appendFile test-case ([18bde78](https://github.com/webpack/webpack-cli/commit/18bde78))
-   remove eslint comment for requireReturn ([be7b259](https://github.com/webpack/webpack-cli/commit/be7b259))
-   watch: test failure using done(error) ([46d2e37](https://github.com/webpack/webpack-cli/commit/46d2e37))
-   watch: use native require first ([20e8579](https://github.com/webpack/webpack-cli/commit/20e8579))
-   watch: use better comments ([b6efe2d](https://github.com/webpack/webpack-cli/commit/b6efe2d))
-   add type to appendDataIfFileExists util ([f853302](https://github.com/webpack/webpack-cli/commit/f853302))
-   make comment clear about fs.copyFileSync ([d1d3d02](https://github.com/webpack/webpack-cli/commit/d1d3d02))
-   use 10E6 instead of 10e6 ([c9c5832](https://github.com/webpack/webpack-cli/commit/c9c5832))
-   bin: add `.babelrc` to webpack-babel-config test ([#724](https://github.com/webpack/webpack-cli/pull/724))
-   bin-cases: expose extractSummary as function ([73714f5](https://github.com/webpack/webpack-cli/commit/73714f5))
-   config-type: use extractSummary ([ed36260](https://github.com/webpack/webpack-cli/commit/ed36260))
-   entry: use extractSummary ([745a369](https://github.com/webpack/webpack-cli/commit/745a369))
-   errors: use extractSummary ([3c8628c](https://github.com/webpack/webpack-cli/commit/3c8628c))
-   fix: fix failing tests ([7cb531b](https://github.com/webpack/webpack-cli/commit/7cb531b))
-   fix: fix failing tests ([a967485](https://github.com/webpack/webpack-cli/commit/a967485))
-   mode: use extractSummary ([3277d41](https://github.com/webpack/webpack-cli/commit/3277d41))
-   output: use extractSummary ([cb60b15](https://github.com/webpack/webpack-cli/commit/cb60b15))
-   plugins: use extractSummary ([02e08dc](https://github.com/webpack/webpack-cli/commit/02e08dc))
-   silent: use extractSummary ([ea89a82](https://github.com/webpack/webpack-cli/commit/ea89a82))
-   stats: use extractSummary ([7f4e504](https://github.com/webpack/webpack-cli/commit/7f4e504))
-   watch: hash assertion for info-verbosity-off ([e0a0d97](https://github.com/webpack/webpack-cli/commit/e0a0d97))
-   watch: use extractSummary ([8357dbc](https://github.com/webpack/webpack-cli/commit/8357dbc))

## Misc

-   Correction of the webpack-merge configuration ([2ed8c60](https://github.com/webpack/webpack-cli/commit/2ed8c60))
-   replace opencollective with light vers ([848bf4b](https://github.com/webpack/webpack-cli/commit/848bf4b))

<a name="3.2.2"></a>

# 3.2.2 (2019-02-05)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.1.3...v3.2.2)

## New Features

-   only display once a week ([b6199e5](https://github.com/webpack/webpack-cli/commit/b6199e5))
-   add util to run-and-get watch proc ([1d2ccd5](https://github.com/webpack/webpack-cli/commit/1d2ccd5))
-   add test-util to append data to file ([e9e1dcb](https://github.com/webpack/webpack-cli/commit/e9e1dcb))
-   log: clean single line logs ([5d2284b](https://github.com/webpack/webpack-cli/commit/5d2284b))
-   log: add gitignore ([7c830b5](https://github.com/webpack/webpack-cli/commit/7c830b5))
-   log: make log package ([df7c224](https://github.com/webpack/webpack-cli/commit/df7c224))
-   log: add clrscr function ([11b3bff](https://github.com/webpack/webpack-cli/commit/11b3bff))
-   log: few changes ([bc32727](https://github.com/webpack/webpack-cli/commit/bc32727))
-   log: add newline for title ([4047213](https://github.com/webpack/webpack-cli/commit/4047213))
-   log: remove unwanted commits ([c088f3e](https://github.com/webpack/webpack-cli/commit/c088f3e))
-   log: task based custom loggers ([2c43a41](https://github.com/webpack/webpack-cli/commit/2c43a41))

## Chore

-   v.3.2.3 ([70138b7](https://github.com/webpack/webpack-cli/commit/70138b7))
-   v.3.2.2 ([24b6387](https://github.com/webpack/webpack-cli/commit/24b6387))
-   update tests ([70bfbd9](https://github.com/webpack/webpack-cli/commit/70bfbd9))
-   one liner ([0f55d5a](https://github.com/webpack/webpack-cli/commit/0f55d5a))
-   one liner after log ([6d8fb67](https://github.com/webpack/webpack-cli/commit/6d8fb67))
-   watch: remove console log ([0952317](https://github.com/webpack/webpack-cli/commit/0952317))
-   v.3.2.1 ([54805ae](https://github.com/webpack/webpack-cli/commit/54805ae))
-   dependency: add `node-ts` as devDependency ([#724](https://github.com/webpack/webpack-cli/pull/724))

## Docs

-   init documentaion ([14d2b47](https://github.com/webpack/webpack-cli/commit/14d2b47))
-   scaffold: Add installation guide for packages/webpack-scaffold ([#727](https://github.com/webpack/webpack-cli/pull/727))

## Fix

-   close compiler, own sh script and output clearing ([6ded275](https://github.com/webpack/webpack-cli/commit/6ded275))
-   bin: extension detection ([#724](https://github.com/webpack/webpack-cli/pull/724))
-   readme: remove old dependency status link ([4df0000](https://github.com/webpack/webpack-cli/commit/4df0000))
-   readme: add fallback badge for dependency status ([0e3753b](https://github.com/webpack/webpack-cli/commit/0e3753b))
-   failing test ([88888bb](https://github.com/webpack/webpack-cli/commit/88888bb))
-   test: fix travis ts build ([22d3acc](https://github.com/webpack/webpack-cli/commit/22d3acc))

## Tests

-   azure pipelines ([c9c3fea](https://github.com/webpack/webpack-cli/commit/c9c3fea))
-   bin: add `webpack.config.ts` related test ([#724](https://github.com/webpack/webpack-cli/pull/724))
-   module: use extractSummary ([7bde073](https://github.com/webpack/webpack-cli/commit/7bde073))
-   watch: use copyFile functionality ([c61fe92](https://github.com/webpack/webpack-cli/commit/c61fe92))
-   add copyFile function in test-utils ([1b21e81](https://github.com/webpack/webpack-cli/commit/1b21e81))
-   bin: add `webpack.config.babel.js` related test ([#724](https://github.com/webpack/webpack-cli/pull/724))
-   config-file: use extractSummary ([7554fe7](https://github.com/webpack/webpack-cli/commit/7554fe7))
-   config-name: use extractSummary ([3e30a57](https://github.com/webpack/webpack-cli/commit/3e30a57))
-   env: use extractSummary ([aa0cf25](https://github.com/webpack/webpack-cli/commit/aa0cf25))
-   fix: fix failing tests ([5669311](https://github.com/webpack/webpack-cli/commit/5669311))
-   help: use extractSummary ([0ba72c4](https://github.com/webpack/webpack-cli/commit/0ba72c4))
-   watch: use switch pattern for verbosity off ([c00386b](https://github.com/webpack/webpack-cli/commit/c00386b))
-   watch: hash assertion for single-config-opt ([55632d6](https://github.com/webpack/webpack-cli/commit/55632d6))
-   watch: hash assertion for single-config ([48f34d1](https://github.com/webpack/webpack-cli/commit/48f34d1))
-   watch: hash assertion for multi-config-watch-opt ([6dd2327](https://github.com/webpack/webpack-cli/commit/6dd2327))
-   watch: hash assertion multi-config ([6b4d339](https://github.com/webpack/webpack-cli/commit/6b4d339))
-   watch: hash assertion info-verbosity-verbose ([42e5ee8](https://github.com/webpack/webpack-cli/commit/42e5ee8))
-   watch: remove test.only for info-verbosity-off ([675d5c0](https://github.com/webpack/webpack-cli/commit/675d5c0))
-   improve appendFile test-case ([18bde78](https://github.com/webpack/webpack-cli/commit/18bde78))
-   remove eslint comment for requireReturn ([be7b259](https://github.com/webpack/webpack-cli/commit/be7b259))
-   watch: test failure using done(error) ([46d2e37](https://github.com/webpack/webpack-cli/commit/46d2e37))
-   watch: use native require first ([20e8579](https://github.com/webpack/webpack-cli/commit/20e8579))
-   watch: use better comments ([b6efe2d](https://github.com/webpack/webpack-cli/commit/b6efe2d))
-   add type to appendDataIfFileExists util ([f853302](https://github.com/webpack/webpack-cli/commit/f853302))
-   make comment clear about fs.copyFileSync ([d1d3d02](https://github.com/webpack/webpack-cli/commit/d1d3d02))
-   use 10E6 instead of 10e6 ([c9c5832](https://github.com/webpack/webpack-cli/commit/c9c5832))
-   bin: add `.babelrc` to webpack-babel-config test ([#724](https://github.com/webpack/webpack-cli/pull/724))
-   bin-cases: expose extractSummary as function ([73714f5](https://github.com/webpack/webpack-cli/commit/73714f5))
-   config-type: use extractSummary ([ed36260](https://github.com/webpack/webpack-cli/commit/ed36260))
-   entry: use extractSummary ([745a369](https://github.com/webpack/webpack-cli/commit/745a369))
-   errors: use extractSummary ([3c8628c](https://github.com/webpack/webpack-cli/commit/3c8628c))
-   fix: fix failing tests ([7cb531b](https://github.com/webpack/webpack-cli/commit/7cb531b))
-   mode: use extractSummary ([3277d41](https://github.com/webpack/webpack-cli/commit/3277d41))
-   output: use extractSummary ([cb60b15](https://github.com/webpack/webpack-cli/commit/cb60b15))
-   plugins: use extractSummary ([02e08dc](https://github.com/webpack/webpack-cli/commit/02e08dc))
-   silent: use extractSummary ([ea89a82](https://github.com/webpack/webpack-cli/commit/ea89a82))
-   stats: use extractSummary ([7f4e504](https://github.com/webpack/webpack-cli/commit/7f4e504))
-   watch: hash assertion for info-verbosity-off ([e0a0d97](https://github.com/webpack/webpack-cli/commit/e0a0d97))
-   watch: use extractSummary ([8357dbc](https://github.com/webpack/webpack-cli/commit/8357dbc))

## Misc

-   Correction of the webpack-merge configuration ([2ed8c60](https://github.com/webpack/webpack-cli/commit/2ed8c60))
-   replace opencollective with light vers ([848bf4b](https://github.com/webpack/webpack-cli/commit/848bf4b))

<a name="3.1.2"></a>

# 3.1.2 (2018-09-29)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.1.1...v3.1.2)

## Chore

-   deps: upgrade husky ([#611](https://github.com/webpack/webpack-cli/pull/611))
-   docs: update readme ([93ebcc2](https://github.com/webpack/webpack-cli/commit/93ebcc2))
-   scripts: add commit script, cz-customizable ([#612](https://github.com/webpack/webpack-cli/pull/612))

## Docs

-   init: update headers ([dc4ded9](https://github.com/webpack/webpack-cli/commit/dc4ded9))
-   init: update init documentation ([2ccf9a9](https://github.com/webpack/webpack-cli/commit/2ccf9a9))
-   readme: update webpack-cli to webpack CLI ([f3a225a](https://github.com/webpack/webpack-cli/commit/f3a225a))
-   readme: change addons to scaffolds ([747aef9](https://github.com/webpack/webpack-cli/commit/747aef9))
-   readme: update links ([f8187f1](https://github.com/webpack/webpack-cli/commit/f8187f1))
-   readme: update README.md ([#614](https://github.com/webpack/webpack-cli/pull/614))
-   readme: update Readme based on feedback ([da05c2f](https://github.com/webpack/webpack-cli/commit/da05c2f))

## Fix

-   tapable: fix hook options ([9aed0dc](https://github.com/webpack/webpack-cli/commit/9aed0dc))
-   replace test regex ([d4e1614](https://github.com/webpack/webpack-cli/commit/d4e1614))

<a name="3.1.1"></a>

# 3.1.1 (2018-09-23)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.1.0...v3.1.1)

## New Features

-   migrate: CommonChunksPlugin to SplitChunksPlugin ([#558](https://github.com/webpack/webpack-cli/pull/558))
-   types: types for packages ([#578](https://github.com/webpack/webpack-cli/pull/578))

## Chore

-   ci: add commitlint when trying to commit ([#595](https://github.com/webpack/webpack-cli/pull/595))
-   ci: Set up CI with Azure Pipelines ([89d3a19](https://github.com/webpack/webpack-cli/commit/89d3a19))
-   ci: fix commitlint ([#592](https://github.com/webpack/webpack-cli/pull/592))
-   ci: Add a status badge for the azure pipelines CI build ([#601](https://github.com/webpack/webpack-cli/pull/601))
-   deps: resync package-lock, upgrade major version ([d892b4d](https://github.com/webpack/webpack-cli/commit/d892b4d))
-   deps: Bump lerna version ([#583](https://github.com/webpack/webpack-cli/pull/583))
-   deps: removing inquirer as default package ([#555](https://github.com/webpack/webpack-cli/pull/555))
-   fix: fix clean all script ([6be0478](https://github.com/webpack/webpack-cli/commit/6be0478))
-   Update schema-utils to the latest version 🚀 ([#565](https://github.com/webpack/webpack-cli/pull/565))
-   update pkg.lock ([76c8277](https://github.com/webpack/webpack-cli/commit/76c8277))
-   remove editorconfig from testfixtures ([#560](https://github.com/webpack/webpack-cli/pull/560))
-   lint: fix tslint warnings ([cf0bf4a](https://github.com/webpack/webpack-cli/commit/cf0bf4a))
-   lint: turn off console log warning ([db5f570](https://github.com/webpack/webpack-cli/commit/db5f570))
-   lint: remove or replace console.log with console.error ([e425642](https://github.com/webpack/webpack-cli/commit/e425642))
-   package: update lerna to version 3.0.0 ([08c424d](https://github.com/webpack/webpack-cli/commit/08c424d))
-   scripts: update ts watch ([336ad3e](https://github.com/webpack/webpack-cli/commit/336ad3e))
-   tests: added first ts test for info package ([#584](https://github.com/webpack/webpack-cli/pull/584))

## CLI

-   allow array value for --ouput-library ([#559](https://github.com/webpack/webpack-cli/pull/559))

## Docs

-   fixed latest changelog link ([#556](https://github.com/webpack/webpack-cli/pull/556))
-   migrate documentaion ([#554](https://github.com/webpack/webpack-cli/pull/554))
-   init documentaion ([#547](https://github.com/webpack/webpack-cli/pull/547))
-   contribution: fix the setup workflow #591 ([#597](https://github.com/webpack/webpack-cli/pull/597))
-   typedoc: add ts docs ([#571](https://github.com/webpack/webpack-cli/pull/571))

## Fix

-   generate-loader: include example template in npm package ([d26ea82](https://github.com/webpack/webpack-cli/commit/d26ea82))
-   generate-plugin: include example template in npm package ([77fa723](https://github.com/webpack/webpack-cli/commit/77fa723))
-   package: update import-local to version 2.0.0 🚀 ([#576](https://github.com/webpack/webpack-cli/pull/576))
-   prettier: add parser, filePath ([#553](https://github.com/webpack/webpack-cli/pull/553))
-   schema: resolve references in schema ([#605](https://github.com/webpack/webpack-cli/pull/605))

## Misc

-   Revert "cli: allow array value for --ouput-library (#559)" ([#561](https://github.com/webpack/webpack-cli/pull/561))

<a name="3.1.0"></a>

# 3.1.0 (2018-07-18)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.0.8...v.3.1.0)

## New Features

-   generators: add typescript support ([c1844f8](https://github.com/webpack/webpack-cli/commit/c1844f8))
-   init: add typescript support ([222ccdc](https://github.com/webpack/webpack-cli/commit/222ccdc))
-   make: add typescript support ([4b574d9](https://github.com/webpack/webpack-cli/commit/4b574d9))
-   remove: add typescript support ([f1623ed](https://github.com/webpack/webpack-cli/commit/f1623ed))
-   scaffold: add typescript support ([eaf6fdf](https://github.com/webpack/webpack-cli/commit/eaf6fdf))
-   scaffold: add typescript support ([f611c27](https://github.com/webpack/webpack-cli/commit/f611c27))
-   serve: add typescript support ([d313421](https://github.com/webpack/webpack-cli/commit/d313421))
-   types: add webpack types schema ([90909e4](https://github.com/webpack/webpack-cli/commit/90909e4))
-   typescript: setup base infra ([fe25465](https://github.com/webpack/webpack-cli/commit/fe25465))
-   typescript: setup base infra ([373a304](https://github.com/webpack/webpack-cli/commit/373a304))
-   update: add typescript support ([53505b9](https://github.com/webpack/webpack-cli/commit/53505b9))
-   utils: add typescript support ([47702cb](https://github.com/webpack/webpack-cli/commit/47702cb))

## Ast

-   parser: remove ([7f51c27](https://github.com/webpack/webpack-cli/commit/7f51c27))
-   parser: remove ([faeec57](https://github.com/webpack/webpack-cli/commit/faeec57))

## Chore

-   add-cmd: add typescript support ([fb98933](https://github.com/webpack/webpack-cli/commit/fb98933))
-   add-cmd: add typescript support ([d730841](https://github.com/webpack/webpack-cli/commit/d730841))
-   build: fix eslint pattern ([#529](https://github.com/webpack/webpack-cli/pull/529))
-   build: fix ci ([#535](https://github.com/webpack/webpack-cli/pull/535))
-   ci: fix build ([#534](https://github.com/webpack/webpack-cli/pull/534))
-   ci: fix build ([#534](https://github.com/webpack/webpack-cli/pull/534))
-   ci: remove semantic release ([#516](https://github.com/webpack/webpack-cli/pull/516))
-   ci: update appveyor config, script ([f220c9e](https://github.com/webpack/webpack-cli/commit/f220c9e))
-   ci: update travis script ([00df5ba](https://github.com/webpack/webpack-cli/commit/00df5ba))
-   update pkg.lock ([817f99c](https://github.com/webpack/webpack-cli/commit/817f99c))
-   fix minor build infra ([87dd419](https://github.com/webpack/webpack-cli/commit/87dd419))
-   Update eslint to the latest version 🚀 ([#526](https://github.com/webpack/webpack-cli/pull/526))
-   update gitignore ([fdc82b9](https://github.com/webpack/webpack-cli/commit/fdc82b9))
-   add missing READMES to packages ([#545](https://github.com/webpack/webpack-cli/pull/545))
-   docs: Updated working link for webpack addon. ([#543](https://github.com/webpack/webpack-cli/pull/543))
-   generate-loader,plugin: add typescript support ([971b31a](https://github.com/webpack/webpack-cli/commit/971b31a))
-   info: add typescript support ([ca133ab](https://github.com/webpack/webpack-cli/commit/ca133ab))
-   info: add typescript support ([2c69df0](https://github.com/webpack/webpack-cli/commit/2c69df0))
-   migrate: add typescript support ([82a7dec](https://github.com/webpack/webpack-cli/commit/82a7dec))
-   package: update eslint-plugin-node to version 7.0.0 ([507a4a6](https://github.com/webpack/webpack-cli/commit/507a4a6))
-   package: update lockfile ([a3d41fb](https://github.com/webpack/webpack-cli/commit/a3d41fb))
-   release: whitelist/blacklist release files ([#514](https://github.com/webpack/webpack-cli/pull/514))
-   release: whitelist/blacklist release files ([#514](https://github.com/webpack/webpack-cli/pull/514))
-   release: whitelist/blacklist release files ([#514](https://github.com/webpack/webpack-cli/pull/514))
-   scripts: fix pretest ([55efce6](https://github.com/webpack/webpack-cli/commit/55efce6))
-   scripts: remove semantic-release ([#525](https://github.com/webpack/webpack-cli/pull/525))
-   template: tiny fix for bug template ([51dc005](https://github.com/webpack/webpack-cli/commit/51dc005))

## Docs

-   update jsdoc ([#507](https://github.com/webpack/webpack-cli/pull/507))
-   update jsdoc ([#507](https://github.com/webpack/webpack-cli/pull/507))
-   update jsdoc ([#507](https://github.com/webpack/webpack-cli/pull/507))
-   pkg: readme file for add package ([#498](https://github.com/webpack/webpack-cli/pull/498))
-   pkg: readme info ([#497](https://github.com/webpack/webpack-cli/pull/497))
-   pkg: readme info ([#497](https://github.com/webpack/webpack-cli/pull/497))

## Fix

-   default named import bug ([ce956c0](https://github.com/webpack/webpack-cli/commit/ce956c0))
-   generators: named export ([8adbe9e](https://github.com/webpack/webpack-cli/commit/8adbe9e))

## Tests

-   fix: bin test outputs ([#552](https://github.com/webpack/webpack-cli/pull/552))
-   migrate: fix transforms order issue ([938e5f9](https://github.com/webpack/webpack-cli/commit/938e5f9))

## Misc

-   Update yargs to the latest version 🚀 ([#533](https://github.com/webpack/webpack-cli/pull/533))

    <a name="0.0.8-development"></a>

# 0.0.8-development (2018-06-15, webpack CLI v.3)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.1.5...v0.0.8-development)

## Ast

-   parser: add ([#456](https://github.com/webpack/webpack-cli/pull/456))

## Chore

-   deps: add lerna ([a7d8085](https://github.com/webpack/webpack-cli/commit/a7d8085))
-   lockfile: update pkglock ([0b024bf](https://github.com/webpack/webpack-cli/commit/0b024bf))
-   monorepo: fix windows build ([0310fd3](https://github.com/webpack/webpack-cli/commit/0310fd3))
-   monorepo: add bootstrap to run ([17c2c88](https://github.com/webpack/webpack-cli/commit/17c2c88))
-   monorepo: fix windows build ([8c58d24](https://github.com/webpack/webpack-cli/commit/8c58d24))
-   monorepo: add rimraf globally ([7c0e245](https://github.com/webpack/webpack-cli/commit/7c0e245))
-   monorepo: fix versions and use clean bootstrap ([7de58ea](https://github.com/webpack/webpack-cli/commit/7de58ea))
-   monorepo: fix appveyor build ([206749b](https://github.com/webpack/webpack-cli/commit/206749b))
-   monorepo: add eslint-plugin-prettier ([ae55183](https://github.com/webpack/webpack-cli/commit/ae55183))
-   monorepo: fix appveyor build ([a08b899](https://github.com/webpack/webpack-cli/commit/a08b899))
-   monorepo: fix appveyor build ([42468d3](https://github.com/webpack/webpack-cli/commit/42468d3))
-   next: dev version bump ([78b48a6](https://github.com/webpack/webpack-cli/commit/78b48a6))
-   pkg: v.6 on next ([3a82b7d](https://github.com/webpack/webpack-cli/commit/3a82b7d))
-   semantic: configure plugins ([#475](https://github.com/webpack/webpack-cli/pull/475))
-   v.6: update init ([ebe5c6b](https://github.com/webpack/webpack-cli/commit/ebe5c6b))

## CLI

-   add: re-add add command ([bf78411](https://github.com/webpack/webpack-cli/commit/bf78411))
-   color: don't use color on non-tty ([#452](https://github.com/webpack/webpack-cli/pull/452))
-   init: Better defaults ([#451](https://github.com/webpack/webpack-cli/pull/451))
-   symlinks: Fix paths ([#453](https://github.com/webpack/webpack-cli/pull/453))

## Fix

-   cli: show help flag when defaults fail ([#466](https://github.com/webpack/webpack-cli/pull/466))
-   vulnerabilities: vulnerabilities patch for v3 ([#460](https://github.com/webpack/webpack-cli/pull/460))

## Tests

-   cov: use regular nyc on tests ([3aa96ce](https://github.com/webpack/webpack-cli/commit/3aa96ce))
-   coverage: fix coverage ([#473](https://github.com/webpack/webpack-cli/pull/473))
-   no-options: refactor tests ([7be10d8](https://github.com/webpack/webpack-cli/commit/7be10d8))
-   parser: fix recursive-tests signature ([#470](https://github.com/webpack/webpack-cli/pull/470))

## Misc

-   Added yarn lock file to gitignore ([#455](https://github.com/webpack/webpack-cli/pull/455))

<a name="0.0.6"></a>

# 0.0.6 (2018-05-17)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.0.5...v0.0.6)

## CLI

-   path: resolve better ([7fca948](https://github.com/webpack/webpack-cli/commit/7fca948))

## Misc

-   v0.0.6 ([f544578](https://github.com/webpack/webpack-cli/commit/f544578))

<a name="0.0.5"></a>

# 0.0.5 (2018-05-17)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.0.4...v0.0.5)

## Chore

-   deps: update deps ([58a437d](https://github.com/webpack/webpack-cli/commit/58a437d))
-   prompt: revise prompt cmd ([bccc56e](https://github.com/webpack/webpack-cli/commit/bccc56e))

## Misc

-   v0.0.5 ([062fa28](https://github.com/webpack/webpack-cli/commit/062fa28))

<a name="0.0.4"></a>

# 0.0.4 (2018-05-17)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.0.3...v0.0.4)

## Chore

-   v: back to v1 ([3ed29c6](https://github.com/webpack/webpack-cli/commit/3ed29c6))

## Misc

-   v0.0.4 ([e29a173](https://github.com/webpack/webpack-cli/commit/e29a173))
-   v0.0.3 ([01cef3f](https://github.com/webpack/webpack-cli/commit/01cef3f))
-   v0.0.2 ([6489b10](https://github.com/webpack/webpack-cli/commit/6489b10))

<a name="0.0.3"></a>

# 0.0.3 (2018-05-17)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.0.2...v0.0.3)

## Misc

-   v0.0.3 ([b51e66d](https://github.com/webpack/webpack-cli/commit/b51e66d))

<a name="0.0.2"></a>

# 0.0.2 (2018-05-17)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.0.1...v0.0.2)

## Chore

-   v: revise some deps ([c36f3e8](https://github.com/webpack/webpack-cli/commit/c36f3e8))

## Misc

-   v0.0.2 ([91be3fd](https://github.com/webpack/webpack-cli/commit/91be3fd))

<a name="0.0.1"></a>

# 0.0.1 (2018-05-17)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.1.3...v0.0.1)

## Chore

-   cli: move to lerna and scoped packages ([#434](https://github.com/webpack/webpack-cli/pull/434))
-   linting: resolve linting ([80c9e9a](https://github.com/webpack/webpack-cli/commit/80c9e9a))
-   linting: resolve linting ([8f6f1db](https://github.com/webpack/webpack-cli/commit/8f6f1db))
-   linting: fix linting errors ([a76c46f](https://github.com/webpack/webpack-cli/commit/a76c46f))
-   linting: resolve linter errors ([1db677e](https://github.com/webpack/webpack-cli/commit/1db677e))
-   monorepo: fix plugin package.json ([3c822cf](https://github.com/webpack/webpack-cli/commit/3c822cf))
-   monorepo: prune files and update eslint rules ([059d6f9](https://github.com/webpack/webpack-cli/commit/059d6f9))
-   monorepo: move to lerna ([ec6cc38](https://github.com/webpack/webpack-cli/commit/ec6cc38))
-   monorepo: use commands as normal instead of package ([bdafce0](https://github.com/webpack/webpack-cli/commit/bdafce0))
-   monorepo: fix the no-missing-require error ([8ef1804](https://github.com/webpack/webpack-cli/commit/8ef1804))
-   monorepo: updated package.json ([ff6c371](https://github.com/webpack/webpack-cli/commit/ff6c371))
-   monorepo: merge package lock json ([d4c7c5d](https://github.com/webpack/webpack-cli/commit/d4c7c5d))
-   monorepo: prune package json ([64cfef7](https://github.com/webpack/webpack-cli/commit/64cfef7))
-   monorepo: fix typo ([a6a2715](https://github.com/webpack/webpack-cli/commit/a6a2715))
-   monorepo: fix typo ([a1d5406](https://github.com/webpack/webpack-cli/commit/a1d5406))
-   rebase: refactor stuff ([b02070d](https://github.com/webpack/webpack-cli/commit/b02070d))
-   scaffold: move addons to scaffold ([b2a7470](https://github.com/webpack/webpack-cli/commit/b2a7470))
-   scaffold: fix linting errors ([df8287d](https://github.com/webpack/webpack-cli/commit/df8287d))
-   v: revise pkg ([ab38a3a](https://github.com/webpack/webpack-cli/commit/ab38a3a))

## CLI

-   pkgs: re-add entries ([b2c2bbd](https://github.com/webpack/webpack-cli/commit/b2c2bbd))
-   prompt: wip ([5f357c9](https://github.com/webpack/webpack-cli/commit/5f357c9))
-   prompt: initial comment for prompt file ([f8a71c0](https://github.com/webpack/webpack-cli/commit/f8a71c0))

## Fix

-   monorepo: fix versions in pacakges ([2b3035c](https://github.com/webpack/webpack-cli/commit/2b3035c))
-   monorepo: update lock files ([ca8f5c1](https://github.com/webpack/webpack-cli/commit/ca8f5c1))
-   monorepo: fix cross spawn versions ([0fcc5b3](https://github.com/webpack/webpack-cli/commit/0fcc5b3))
-   monorepo: fix lint errors ([74fb759](https://github.com/webpack/webpack-cli/commit/74fb759))
-   revert: packagejson ([3dd244b](https://github.com/webpack/webpack-cli/commit/3dd244b))

## Misc

-   v0.0.1 ([faae7aa](https://github.com/webpack/webpack-cli/commit/faae7aa))

<a name="2.1.3"></a>

# 2.1.3 (2018-05-06)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.1.2...v2.1.3)

## Chore

-   pkg: remove prefer global ([4149c53](https://github.com/webpack/webpack-cli/commit/4149c53))
-   templates: Update issue templates ([#432](https://github.com/webpack/webpack-cli/pull/432))

## CLI

-   cmds: revise yargs command ([#422](https://github.com/webpack/webpack-cli/pull/422))

<a name="2.0.14"></a>

# 2.0.14 (2018-04-05)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/2.0.13...2.0.14)

## New Features

-   use npm ci for tests (#367) ([#368](https://github.com/webpack/webpack-cli/pull/368))
-   add envinfo as `webpack-cli info` command ([51ab19f](https://github.com/webpack/webpack-cli/commit/51ab19f))
-   --entry should override config.entry (#155) ([#358](https://github.com/webpack/webpack-cli/pull/358))

## Chore

-   coverage: added reporters inside package.json ([c7d80fb](https://github.com/webpack/webpack-cli/commit/c7d80fb))
-   upgrade: webpack 4.2 and other dependencies ([#362](https://github.com/webpack/webpack-cli/pull/362))
-   version: v.2.0.13 ([2222f1d](https://github.com/webpack/webpack-cli/commit/2222f1d))

## CLI

-   refactor: improve folder structure ([#371](https://github.com/webpack/webpack-cli/pull/371))

## Fix

-   loader,plugin: fix generators path bug ([b4bfafb](https://github.com/webpack/webpack-cli/commit/b4bfafb))

<a name="2.0.13"></a>

# 2.0.13 (2018-03-22)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/2.0.12...2.0.13)

## Chore

-   pkg: explicitly include files for release ([#349](https://github.com/webpack/webpack-cli/pull/349))

## CLI

-   init: add webpack-cli dep ([#347](https://github.com/webpack/webpack-cli/pull/347))

<a name="2.0.12"></a>

# 2.0.12 (2018-03-14)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.11...v2.0.12)

## New Features

-   support --build-delimiter for opt-in output delimiter (#192) ([#340](https://github.com/webpack/webpack-cli/pull/340))

## Chore

-   gitignore: add vim swap files to gitignore ([3448fb5](https://github.com/webpack/webpack-cli/commit/3448fb5))
-   scaffolding: update docs ([#336](https://github.com/webpack/webpack-cli/pull/336))

## Fix

-   removes debug in migrate ([#342](https://github.com/webpack/webpack-cli/pull/342))

## Tests

-   snapshot: update snapshot ([bd8ccda](https://github.com/webpack/webpack-cli/commit/bd8ccda))

## Misc

-   cz: fix type description ([#339](https://github.com/webpack/webpack-cli/pull/339))
-   init: fix global-modules require statement in package-manager ([610aa02](https://github.com/webpack/webpack-cli/commit/610aa02))
-   init-generator: cleanup ([b8c3145](https://github.com/webpack/webpack-cli/commit/b8c3145))

<a name="2.0.11"></a>

# 2.0.11 (2018-03-10)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.10...v2.0.11)

## Chore

-   bundlesize: change threshold ([2aedfda](https://github.com/webpack/webpack-cli/commit/2aedfda))
-   deps: upgrade deps ([#319](https://github.com/webpack/webpack-cli/pull/319))
-   docs: update docs ([3307e3b](https://github.com/webpack/webpack-cli/commit/3307e3b))
-   es6: changed 'var' into 'const' where convenient ([#325](https://github.com/webpack/webpack-cli/pull/325))
-   test: updated tests file names ([#324](https://github.com/webpack/webpack-cli/pull/324))

## CLI

-   init: Refactor Yeoman ([#323](https://github.com/webpack/webpack-cli/pull/323))
-   tapable: Remove Tapable#apply calls ([#305](https://github.com/webpack/webpack-cli/pull/305))

## Docs

-   update README to remove inconsistent CLI messaging (#327) ([#328](https://github.com/webpack/webpack-cli/pull/328))

## Fix

-   migrate: move options to use ([#308](https://github.com/webpack/webpack-cli/pull/308))
-   adding 'fix' to whitelist ([10a00df](https://github.com/webpack/webpack-cli/commit/10a00df))

## Misc

-   deps: clean up dependencies ([7078282](https://github.com/webpack/webpack-cli/commit/7078282))
-   generator: Allow local paths to generators ([#265](https://github.com/webpack/webpack-cli/pull/265))
-   grammar: revise spelling and incorrect syntax ([#293](https://github.com/webpack/webpack-cli/pull/293))
-   readme: add npm badge ([#303](https://github.com/webpack/webpack-cli/pull/303))

<a name="2.0.10"></a>

# 2.0.10 (2018-03-02)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.4...v2.0.10)

## New Features

-   show help when no options given ([a7ee15a](https://github.com/webpack/webpack-cli/commit/a7ee15a))
-   chore: add project tools and utilities ([#270](https://github.com/webpack/webpack-cli/pull/270))

## Ast

-   init: fix init command ([d36cd4f](https://github.com/webpack/webpack-cli/commit/d36cd4f))

## Chore

-   .gitignore: ignore .vscode ([a322505](https://github.com/webpack/webpack-cli/commit/a322505))
-   .gitignore: ignore .vscode ([ab0eacc](https://github.com/webpack/webpack-cli/commit/ab0eacc))
-   add: temp remove add from cli ([f663215](https://github.com/webpack/webpack-cli/commit/f663215))
-   changelog: v.2.0.7 changelog ([a165269](https://github.com/webpack/webpack-cli/commit/a165269))
-   clean: remove unused dependency ([4a395d7](https://github.com/webpack/webpack-cli/commit/4a395d7))
-   deps: bump uglify dep and cli version ([81a9f1e](https://github.com/webpack/webpack-cli/commit/81a9f1e))
-   packager: remove yarn ([#302](https://github.com/webpack/webpack-cli/pull/302))
-   pkg.json: remove commitmsg cmd ([4dff074](https://github.com/webpack/webpack-cli/commit/4dff074))
-   refactor: update supports-color usage ([4566fde](https://github.com/webpack/webpack-cli/commit/4566fde))
-   refactor: update supports-color usage ([97b2df3](https://github.com/webpack/webpack-cli/commit/97b2df3))
-   revert: revert yargs to 9.0.1 ([7ef13ef](https://github.com/webpack/webpack-cli/commit/7ef13ef))
-   upgrade: update all dependencies, devDependencies ([4bf64bf](https://github.com/webpack/webpack-cli/commit/4bf64bf))
-   version: v.2.0.9 ([4cf5e17](https://github.com/webpack/webpack-cli/commit/4cf5e17))

## CLI

-   devServer: change devServer path ([c27e961](https://github.com/webpack/webpack-cli/commit/c27e961))
-   version: v.2.0.8 ([9406912](https://github.com/webpack/webpack-cli/commit/9406912))

## Fix

-   generator: use yeoman clone ([0b4269c](https://github.com/webpack/webpack-cli/commit/0b4269c))
-   yeoman-generator fork issue ([#294](https://github.com/webpack/webpack-cli/pull/294))
-   Resolve webpack dependencies ([#251](https://github.com/webpack/webpack-cli/pull/251))
-   change help logic ([d67f4b7](https://github.com/webpack/webpack-cli/commit/d67f4b7))

## Improvement

-   add an option to watch messaging. Add .idea to .gitignore ([#200](https://github.com/webpack/webpack-cli/pull/200))

## Refactor

-   convert-args: remove unused arguments ([#253](https://github.com/webpack/webpack-cli/pull/253))

## Style

-   run formatter ([7be0da7](https://github.com/webpack/webpack-cli/commit/7be0da7))

## Tests

-   add test for showing help on no options ([cf43939](https://github.com/webpack/webpack-cli/commit/cf43939))
-   mode: add mode tests ([#285](https://github.com/webpack/webpack-cli/pull/285))
-   update: migrate snapshot ([3c4e6f7](https://github.com/webpack/webpack-cli/commit/3c4e6f7))
-   update: migrate snapshot ([c322067](https://github.com/webpack/webpack-cli/commit/c322067))

## Misc

-   refactor: reduce code duplication use process.exitCode instead of process.exit ([#272](https://github.com/webpack/webpack-cli/pull/272))
-   [feature] configuration validation ([#240](https://github.com/webpack/webpack-cli/pull/240))
-   Commitlint ([#300](https://github.com/webpack/webpack-cli/pull/300))
-   Change from git:// to https:// ([#259](https://github.com/webpack/webpack-cli/pull/259))
-   Add jsdoc comments for migrate ([#255](https://github.com/webpack/webpack-cli/pull/255))
-   strict Promise configuration validation ([#298](https://github.com/webpack/webpack-cli/pull/298))
-   Refactor bin directory ([#263](https://github.com/webpack/webpack-cli/pull/263))
-   Issue 249 fixed and other enums refactored ([#264](https://github.com/webpack/webpack-cli/pull/264))
-   remove yargs major update due security compromise ([9bd7ed4](https://github.com/webpack/webpack-cli/commit/9bd7ed4))
-   Revert "Show help on no command" ([#276](https://github.com/webpack/webpack-cli/pull/276))
-   2.0.5 ([94ac6db](https://github.com/webpack/webpack-cli/commit/94ac6db))
-   v.2.0.6 ([4333088](https://github.com/webpack/webpack-cli/commit/4333088))
-   fix typo.. ([0f1cee6](https://github.com/webpack/webpack-cli/commit/0f1cee6))
-   binTestCases: remove obsolete snapshot ([42301d7](https://github.com/webpack/webpack-cli/commit/42301d7))
-   dep: add webpack 4 as peer dependency ([#297](https://github.com/webpack/webpack-cli/pull/297))
-   migrate: prettify output ([#281](https://github.com/webpack/webpack-cli/pull/281))
-   revert: revert supports-color usage ([f8e819a](https://github.com/webpack/webpack-cli/commit/f8e819a))
-   revert: revert supports-color usage ([75f706b](https://github.com/webpack/webpack-cli/commit/75f706b))
-   syntax: prettify ([5cb146f](https://github.com/webpack/webpack-cli/commit/5cb146f))
-   yargs: add description for module-bind-\* args ([#286](https://github.com/webpack/webpack-cli/pull/286))

<a name="2.0.9"></a>

# 2.0.9 (2018-02-25)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.4...v2.0.9)

## Ast

-   init: fix init command ([d36cd4f](https://github.com/webpack/webpack-cli/commit/d36cd4f))

## Chore

-   .gitignore: ignore .vscode ([ab0eacc](https://github.com/webpack/webpack-cli/commit/ab0eacc))
-   .gitignore: ignore .vscode ([a322505](https://github.com/webpack/webpack-cli/commit/a322505))
-   add: temp remove add from cli ([f663215](https://github.com/webpack/webpack-cli/commit/f663215))
-   changelog: v.2.0.7 changelog ([a165269](https://github.com/webpack/webpack-cli/commit/a165269))
-   deps: bump uglify dep and cli version ([81a9f1e](https://github.com/webpack/webpack-cli/commit/81a9f1e))
-   pkg.json: remove commitmsg cmd ([4dff074](https://github.com/webpack/webpack-cli/commit/4dff074))

## CLI

-   devServer: change devServer path ([c27e961](https://github.com/webpack/webpack-cli/commit/c27e961))
-   version: v.2.0.8 ([9406912](https://github.com/webpack/webpack-cli/commit/9406912))

## Feat

-   show help when no options given ([a7ee15a](https://github.com/webpack/webpack-cli/commit/a7ee15a))
-   chore: add project tools and utilities ([#270](https://github.com/webpack/webpack-cli/pull/270))

## Fix

-   Resolve webpack dependencies ([#251](https://github.com/webpack/webpack-cli/pull/251))
-   change help logic ([d67f4b7](https://github.com/webpack/webpack-cli/commit/d67f4b7))
-   generator: use yeoman clone ([0b4269c](https://github.com/webpack/webpack-cli/commit/0b4269c))

## Improvement

-   add an option to watch messaging. Add .idea to .gitignore ([#200](https://github.com/webpack/webpack-cli/pull/200))

## Refactor

-   convert-args: remove unused arguments ([#253](https://github.com/webpack/webpack-cli/pull/253))

## Style

-   run formatter ([7be0da7](https://github.com/webpack/webpack-cli/commit/7be0da7))

## Tests

-   add test for showing help on no options ([cf43939](https://github.com/webpack/webpack-cli/commit/cf43939))

## Misc

-   remove yargs major update due security compromise ([9bd7ed4](https://github.com/webpack/webpack-cli/commit/9bd7ed4))
-   Revert "Show help on no command" ([#276](https://github.com/webpack/webpack-cli/pull/276))
-   v.2.0.6 ([4333088](https://github.com/webpack/webpack-cli/commit/4333088))
-   fix typo.. ([0f1cee6](https://github.com/webpack/webpack-cli/commit/0f1cee6))
-   2.0.5 ([94ac6db](https://github.com/webpack/webpack-cli/commit/94ac6db))
-   Change from git:// to https:// ([#259](https://github.com/webpack/webpack-cli/pull/259))
-   Issue 249 fixed and other enums refactored ([#264](https://github.com/webpack/webpack-cli/pull/264))
-   Refactor bin directory ([#263](https://github.com/webpack/webpack-cli/pull/263))
-   Add jsdoc comments for migrate ([#255](https://github.com/webpack/webpack-cli/pull/255))
-   [feature] configuration validation ([#240](https://github.com/webpack/webpack-cli/pull/240))
-   refactor: reduce code duplication use process.exitCode instead of process.exit ([#272](https://github.com/webpack/webpack-cli/pull/272))

<a name="2.0.7"></a>

# 2.0.7 (2018-02-24)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.4...v2.0.7)

## Chore

-   .gitignore: ignore .vscode ([ab0eacc](https://github.com/webpack/webpack-cli/commit/ab0eacc))
-   .gitignore: ignore .vscode ([a322505](https://github.com/webpack/webpack-cli/commit/a322505))
-   add: temp remove add from cli ([f663215](https://github.com/webpack/webpack-cli/commit/f663215))
-   deps: bump uglify dep and cli version ([81a9f1e](https://github.com/webpack/webpack-cli/commit/81a9f1e))

## Feat

-   show help when no options given ([a7ee15a](https://github.com/webpack/webpack-cli/commit/a7ee15a))
-   chore: add project tools and utilities ([#270](https://github.com/webpack/webpack-cli/pull/270))

## Fix

-   Resolve webpack dependencies ([#251](https://github.com/webpack/webpack-cli/pull/251))
-   change help logic ([d67f4b7](https://github.com/webpack/webpack-cli/commit/d67f4b7))

## Improvement

-   add an option to watch messaging. Add .idea to .gitignore ([#200](https://github.com/webpack/webpack-cli/pull/200))

## Refactor

-   convert-args: remove unused arguments ([#253](https://github.com/webpack/webpack-cli/pull/253))

## Style

-   run formatter ([7be0da7](https://github.com/webpack/webpack-cli/commit/7be0da7))

## Tests

-   add test for showing help on no options ([cf43939](https://github.com/webpack/webpack-cli/commit/cf43939))

## Misc

-   remove yargs major update due security compromise ([9bd7ed4](https://github.com/webpack/webpack-cli/commit/9bd7ed4))
-   Revert "Show help on no command" ([#276](https://github.com/webpack/webpack-cli/pull/276))
-   v.2.0.6 ([4333088](https://github.com/webpack/webpack-cli/commit/4333088))
-   fix typo.. ([0f1cee6](https://github.com/webpack/webpack-cli/commit/0f1cee6))
-   2.0.5 ([94ac6db](https://github.com/webpack/webpack-cli/commit/94ac6db))
-   Change from git:// to https:// ([#259](https://github.com/webpack/webpack-cli/pull/259))
-   Issue 249 fixed and other enums refactored ([#264](https://github.com/webpack/webpack-cli/pull/264))
-   Refactor bin directory ([#263](https://github.com/webpack/webpack-cli/pull/263))
-   Add jsdoc comments for migrate ([#255](https://github.com/webpack/webpack-cli/pull/255))
-   [feature] configuration validation ([#240](https://github.com/webpack/webpack-cli/pull/240))
-   refactor: reduce code duplication use process.exitCode instead of process.exit ([#272](https://github.com/webpack/webpack-cli/pull/272))

<a name="2.0.6"></a>

# 2.0.6 (2018-02-20)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.4...v2.0.6)

## Chore

-   .gitignore: ignore .vscode ([ab0eacc](https://github.com/webpack/webpack-cli/commit/ab0eacc))
-   .gitignore: ignore .vscode ([a322505](https://github.com/webpack/webpack-cli/commit/a322505))
-   add new items to chore: adds chore command ([db243b6](https://github.com/webpack/webpack-cli/commit/db243b6))
-   linting: lint added files ([6dc12af](https://github.com/webpack/webpack-cli/commit/6dc12af))
-   remove cmd: removes f command ([7adfdcf](https://github.com/webpack/webpack-cli/commit/7adfdcf))

## Feat

-   show help when no options given ([a7ee15a](https://github.com/webpack/webpack-cli/commit/a7ee15a))

## Fix

-   Resolve webpack dependencies ([#251](https://github.com/webpack/webpack-cli/pull/251))
-   change help logic ([d67f4b7](https://github.com/webpack/webpack-cli/commit/d67f4b7))

## Improvement

-   add an option to watch messaging. Add .idea to .gitignore ([#200](https://github.com/webpack/webpack-cli/pull/200))

## Refactor

-   convert-args: remove unused arguments ([#253](https://github.com/webpack/webpack-cli/pull/253))

## Style

-   run formatter ([7be0da7](https://github.com/webpack/webpack-cli/commit/7be0da7))

## Tests

-   add test for showing help on no options ([cf43939](https://github.com/webpack/webpack-cli/commit/cf43939))

## Misc

-   remove yargs major update due security compromise ([9bd7ed4](https://github.com/webpack/webpack-cli/commit/9bd7ed4))
-   [feature] configuration validation ([#240](https://github.com/webpack/webpack-cli/pull/240))
-   v.2.0.6 ([4333088](https://github.com/webpack/webpack-cli/commit/4333088))
-   fix typo.. ([0f1cee6](https://github.com/webpack/webpack-cli/commit/0f1cee6))
-   2.0.5 ([94ac6db](https://github.com/webpack/webpack-cli/commit/94ac6db))
-   Change from git:// to https:// ([#259](https://github.com/webpack/webpack-cli/pull/259))
-   Issue 249 fixed and other enums refactored ([#264](https://github.com/webpack/webpack-cli/pull/264))
-   Refactor bin directory ([#263](https://github.com/webpack/webpack-cli/pull/263))
-   Add jsdoc comments for migrate ([#255](https://github.com/webpack/webpack-cli/pull/255))
-   add commitlinting: adds commit linting to the cli ([7e4dd3d](https://github.com/webpack/webpack-cli/commit/7e4dd3d))
-   add eslint ignore items: adds build folder and commit linter to ignore ([a400809](https://github.com/webpack/webpack-cli/commit/a400809))

<a name="2.0.0"></a>

## 2.0.0 (2017-12-21)

-   Adds add
-   Remove some mocks
-   Remove validationschema and ajv dependencies
-   Update Jest & Jest-cli
-   Remove unused dependencies
-   Creator is now init
-   Using env preset ([#197](https://github.com/webpack/webpack-cli/pull/197))
-   Using Yarn ([#203](https://github.com/webpack/webpack-cli/pull/203))
-   Using peer dep of webpack
-   Transformations is now migrate
-   Init has its own generator
-   Commands are refactored into a HOC and sent to a folder for each command with an helper for scaffolding aliases
-   Using RawList instead of List for better usability ([82c64db](https://github.com/webpack/webpack-cli/commit/541ba62f02c4a1fcc807eac62a551fcae3f2d2c3))
-   lib/transformations/util is now in lib/utils/ast-utils
-   Each AST module now has an extra argument that specifies action to be done
-   FindPluginsByRoot is now FindRootByName and more generalistic
-   Added ast util function createEmptyCallableFunctionWithArguments
-   Refactor for readability ([#214](https://github.com/webpack/webpack-cli/pull/214))
-   Remove dist from repo ([#215](https://github.com/webpack/webpack-cli/pull/215))
-   Remove entry and output validation ([#217](https://github.com/webpack/webpack-cli/pull/217))
-   topScope now checks if the import already is present
-   Updated test errors/issue-5576, remember to sync with webpack/next
-   User friendly startup message ([#218](https://github.com/webpack/webpack-cli/pull/218))
-   Migrate now uses prettier ([88aaaa2](https://github.com/webpack/webpack-cli/commit/972d4cd90061644aa2f4aaac33d2d80cb4a56d57)
-   Added transform for mode ([972d4cd](https://github.com/webpack/webpack-cli/commit/e1f512c9bb96694dd623562dc4cef411ed004c2c)
-   Remove recast fork ([fba04da](https://github.com/webpack/webpack-cli/commit/b416d9c50138ef343b8bac6e3f66fdd5b917857d))
-   New transforms ([b416d9c](https://github.com/webpack/webpack-cli/commit/28680c944dca0860ca59a38910840a641b418d18))
-   JSdocs are added ([47de46a](https://github.com/webpack/webpack-cli/commit/285846a4cb1f976edcdb36629cf247d8017ff956))
-   Added serve alias ([#204](https://github.com/webpack/webpack-cli/pull/204))
-   Migrate has new validate logic ([c4c68e8](https://github.com/webpack/webpack-cli/commit/5d4430a6a5531cd8084e5a591f7884e746e21b2f))
-   webpack serve logic ([5d4430a](https://github.com/webpack/webpack-cli/commit/992bfe2b08b98aebb43c68d5e5a92320ba3e32a8))
-   webpack --config-register and webpack -r is added ([1f24d19](https://github.com/webpack/webpack-cli/commit/ab9421136887b7e9e10f25a39b59fb32f07b5037))
-   work on makefile generation ([d86e1ce](https://github.com/webpack/webpack-cli/commit/4f9a4f88a8bd113762a54c05b3b9fe6f459855db))
-   Appveyor is added ([9b2f6f5](https://github.com/webpack/webpack-cli/commit/c5c97462d6ccfa4c02fd79206fa075815520cd88))
-   Remove commit-validate from docs ([#222](https://github.com/webpack/webpack-cli/pull/222))
-   Added transform ResolveLoader ([7c713ce](https://github.com/webpack/webpack-cli/commit/3c90e83fa7b8dd5fbecaee5d1b9d8f0279600096))
-   Using v8-compile-cache ([7e57314](https://github.com/webpack/webpack-cli/commit/0564ceb77a995239d0be7a022b948cbd727773a4))
-   Adds webpack-cli bot ([#224](https://github.com/webpack/webpack-cli/pull/224))

<a name="1.3.2"></a>

## 1.3.2 (2017-05-15)

### Bug Fixes

-   add css-loader appropriately ([#141](https://github.com/webpack/webpack-cli/issues/141)) ([a71600e](https://github.com/webpack/webpack-cli/commit/a71600e))
-   Deps 'webpack' and 'uglifyjs-webpack-plugin' not installed when user answers yes to 'using ES2015' ([#135](https://github.com/webpack/webpack-cli/issues/135)). ([#136](https://github.com/webpack/webpack-cli/issues/136)) ([524f035](https://github.com/webpack/webpack-cli/commit/524f035))
-   Install correct (`es2015`) babel preset to match generated config ([#138](https://github.com/webpack/webpack-cli/issues/138)) ([b0af53f](https://github.com/webpack/webpack-cli/commit/b0af53f))
-   use correct test function ([#129](https://github.com/webpack/webpack-cli/issues/129)) ([3464d9e](https://github.com/webpack/webpack-cli/commit/3464d9e))

<a name="1.3.1"></a>

## 1.3.1 (2017-05-02)

### Bug Fixes

-   add safe traverse to loaderoptionsplugin ([#77](https://github.com/webpack/webpack-cli/issues/77)) ([4020043](https://github.com/webpack/webpack-cli/commit/4020043))
-   Do not create LoaderOptionsPlugin if loaderOptions is empty ([#72](https://github.com/webpack/webpack-cli/issues/72)) ([b9d22c9](https://github.com/webpack/webpack-cli/commit/b9d22c9))
    ([68a2dfd](https://github.com/webpack/webpack-cli/commit/68a2dfd))
-   Upgrade to Jest 19 ([#71](https://github.com/webpack/webpack-cli/issues/71)) ([fe62523](https://github.com/webpack/webpack-cli/commit/fe62523))
-   Use `safeTraverse` where appropriate ([#94](https://github.com/webpack/webpack-cli/issues/94)) ([dcde2b6](https://github.com/webpack/webpack-cli/commit/dcde2b6))
    ([3464d9e](https://github.com/webpack/webpack-cli/commit/3464d9e))
-   Use real paths from argvs instead of dummy hard-coded file ([#65](https://github.com/webpack/webpack-cli/issues/65)) ([a46edbb](https://github.com/webpack/webpack-cli/commit/a46edbb))

### Features

-   Add beautifier config for JS code ([64c88ea](https://github.com/webpack/webpack-cli/commit/64c88ea))
-   Add commit validation and commits template ([d0cbfc0](https://github.com/webpack/webpack-cli/commit/d0cbfc0))
-   Add editorconfig settings from core webpack ([89809de](https://github.com/webpack/webpack-cli/commit/89809de))
-   Add yarn settings to handle dependencies ([34579c7](https://github.com/webpack/webpack-cli/commit/34579c7))
-   Adds a resolved path for output ([#80](https://github.com/webpack/webpack-cli/issues/80)) ([37a594d](https://github.com/webpack/webpack-cli/commit/37a594d))
-   Introduce reserve and timestamps ([#24](https://github.com/webpack/webpack-cli/issues/24)) ([ed267b4](https://github.com/webpack/webpack-cli/commit/ed267b4))
-   Webpack-CLI version 1([#105](https://github.com/webpack/webpack-cli/pull/105))
-   Feature: Use listr to display progress and errors for transformations([#92](https://github.com/webpack/webpack-cli/pull/92))
-   Feature: Jscodeshift Transformations for --migrate ([#40](https://github.com/webpack/webpack-cli/pull/40))
