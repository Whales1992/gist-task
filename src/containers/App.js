import React, { useState } from 'react';
import { connect } from 'react-redux';
import '../App.scss';
import Search from '../components/Search';
import Error from '../components/Error';
import Loading from '../components/Loading';
import Cell from '../components/Cell';
import Details from '../components/Details';
import Sort from '../components/Sort';

function App() {
  const [isLoading, setLoadingState] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [repositories, updateRepositories] = useState([]);
  const [selectedRepoDetails, updateSelectedDetails] = useState(null);
  const [favoriteReposList, updateFavoriteReposList] = useState([]);
  const [next, setNext] = useState("");

  /**
   * Called when GitHub API calls finishes
   * @param results - Object containing "error" and "repos" properties
   * @type error - string or null
   * @type repos - Object, contains "items" property, which is an array of RepoItem
   * @type RepoItem - contains info about individual repo on github:
   *          id: repo id
   *          name: repo name
   *          created_at: timestamp when repo was created
   *          html_url: github url to the Repo
   *          stargazers_count: number of stars repo has
   *          owner: Object containing info about owner:
   *              login: github handle of the author
   */
  function onSearchResults(results) {
    const { repos, error } = results;

    if (error) {
      setErrorMessage(error);
    } else {
      updateRepositories(repos || []);
    }
  }

  /**
   *
   * @param repoId - string, id of the repo to be added to favorites
   */
  function onAddToFavorite(repoId) {
    let favList = [...favoriteReposList];
    let index = favList.indexOf(repoId);

    if (index > -1) {
      favList = [...favList.slice(0, index), ...favList.slice(index)];
    } else {
      favList = [...favList, repoId];
    }

    updateFavoriteReposList(favList);
  }

  const hasResults = repositories.length > 0;

  return (
    <div className="container">
      <div className="listContainer">
        <Search
          updateLoadingState={setLoadingState}
          onSearchResults={onSearchResults}
        />

        {errorMessage ? (
          <Error onClear={() => setErrorMessage(null)} message={errorMessage} />
        ) : null}
        {isLoading ? <Loading /> : null}

        {hasResults ? (
          <div className="resultContainer">
            <Sort onSort={updateRepositories} currentRepos={repositories} />
            {repositories.map(repo => (
              <Cell
                  onAddToFavorite={(repoId) => onAddToFavorite(repoId)}
                onPress={() => updateSelectedDetails(repo)}
                key="repo"
                id={repo.id}
                avatar={repo.avatar}
                owner={repo.owner}
                title={repo.title}
                stars={repo.stars}
                timestamp={repo.timestamp}
                url={repo.url}
                  isFavorite={favoriteReposList.includes(repo.id)}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="detailsContainer">
        <Details repo={selectedRepoDetails} />
      </div>

      {
        next.trim().length !== 0 ? <p>Next</p> : null
      }
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  errorMessage: state.errorMessage,
  inputValue: ownProps.location.pathname.substring(1)
})

export default connect(mapStateToProps)(App);
