const githubQuery = require('./githubQuery');
const { allCohorts } = require('../config/cohorts');

// so node won't throw an error and crash when a student doesn't have a fork
process.on('uncaughtException', err => {
  console.log('Caught exception: ', err);
});

const getStudentsList = cohortName => {
  const studentsList = allCohorts.filter(cohort => cohort.name === cohortName);
  return studentsList && studentsList.length ? studentsList[0].students : [];
};

const getCommits = async repoWithAuthor => {
  // @note: return up to 500 commits
  const maxPage = 5;
  let responses = [];
  for (let page = 1; page <= maxPage; page += 1) {
    const url = `http://api.github.com/repos/${repoWithAuthor}&page=${page}&per_page=100`;
    const response = await githubQuery(url);
    if (!response.length) break;
    responses = [...responses, ...response];
  }
  const commits = responses.map(res => ({
    // exclude commit message body
    name: res.commit.message.split('\n')[0],
    date: res.commit.author.date,
    author: res.author && res.author.login
  }));
  return commits || [];
};

const getRepoListWithCommits = async urls => {
  const repoList = urls.split(',').map(url => url.replace('https://github.com/', '').trim());
  const commitsMap = {};
  const promises = repoList.map(async repo => {
    commitsMap[repo.split('/commits')[0]] = await getCommits(repo);
  });
  await Promise.all(promises);
  return commitsMap;
};

module.exports = {
  getStudentsList,
  getCommits,
  getRepoListWithCommits
};
