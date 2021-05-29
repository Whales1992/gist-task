import React, { useState,Fragment } from 'react';
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
  const [arrayDataSize,setArrayDataSize] = useState({
    start:0,
    end:20
  });

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
      setTimeout(()=>{
        setErrorMessage(null);
      },1500);
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

  const setArraySize = (start,end)=>{
    setArrayDataSize({start,end});
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
            {repositories
              .slice(arrayDataSize.start, arrayDataSize.end)
              .map(repo => (
                <Cell
                  onAddToFavorite={repoId => onAddToFavorite(repoId)}
                  onPress={() => updateSelectedDetails(repo)}
                  key={'repo' + repo.id}
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
            <div className="buttonContainer">
              <button
                onClick={e => {
                  e.preventDefault();
                  if (arrayDataSize.end - 20 <= 0) {
                  } else {
                    setArraySize(
                      arrayDataSize.start - 20,
                      arrayDataSize.end - 20,
                    );
                  }
                }}>
                Prev
              </button>
              <button
                onClick={e => {
                  e.preventDefault();
                  setArraySize(0, 20);
                }}>
                1
              </button>
              <button
                onClick={e => {
                  e.preventDefault();
                  setArraySize(20, 40);
                }}>
                2
              </button>
              <button
                onClick={e => {
                  e.preventDefault();
                  setArraySize(40, 60);
                }}>
                3
              </button>
              <button
                onClick={e => {
                  e.preventDefault();
                  setArraySize(60, 80);
                }}>
                4
              </button>
              <button
                onClick={e => {
                  e.preventDefault();
                  setArraySize(80, 100);
                }}>
                5
              </button>
              <button
                onClick={e => {
                  e.preventDefault();
                  if (arrayDataSize.end + 20 > repositories.length) {
                  } else {
                    setArraySize(
                      arrayDataSize.start + 20,
                      arrayDataSize.end + 20,
                    );
                  }
                }}>
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
      {selectedRepoDetails && (
        <div className="detailsContainer">
          <Details repo={selectedRepoDetails} />
        </div>
      )}
      {selectedRepoDetails && (
        <div className="detailsContainerModal">
          <Details
            repo={selectedRepoDetails}
            onClose={() => {
              updateSelectedDetails(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  errorMessage: state.errorMessage,
  inputValue: ownProps.location.pathname.substring(1)
})

export default connect(mapStateToProps)(App);
