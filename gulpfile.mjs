import { Octokit } from '@octokit/core';
import { writeFile } from 'fs/promises';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import { join, dirname } from 'path';

const path = dirname(import.meta.url).replace(/^file:\/\//, '');
const { API_KEY, user = 'noahtkeller' } = process.env;
const octokit = new Octokit({ auth: API_KEY });

async function githubUserData() {
  await rimraf.sync(join(path, 'data/user.json'))
  const { data: profile } = await octokit.request('GET /users/{user}', { user });
  await writeFile(join(path, 'data/user.json'), JSON.stringify(profile, null, '    '), 'utf8');
}

async function githubRepos() {
  await rimraf.sync(join(path, 'data/repos.json'))
  const { data: repos } = await octokit.request('GET /users/{user}/repos', { user });
  const repositories = [];
  for (const repo of repos) {
    const {
      fork,
      name,
      description,
      open_issues_count,
      watchers_count,
      created_at,
      updated_at,
      forks_count,
      html_url,
      languages_url,
    } = repo;
    if (!fork) {
      const {data: lang} = await octokit.request(`GET ${languages_url}`);
      for (const key in lang) {
        // if (languages.indexOf(key) === -1) {
        //   languages.push(key);
        // }
      }
      repositories.push({
        name,
        url: html_url,
        description,
        issues: open_issues_count,
        forks: forks_count,
        watchers: watchers_count,
        created: created_at,
        updated: updated_at,
      });
    }
  }
  await writeFile(join(path, 'data/repos.json'), JSON.stringify(repositories, null, '    '), 'utf8');
}

export default async function() {
  await githubUserData();
  await githubRepos();

  // const languages = [];


}
