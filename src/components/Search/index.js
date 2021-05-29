import React,{useEffect} from 'react';
import './search.scss';
import { fetchGitHubRepo } from '../../api';

/*
 * onSearchStart - method that accepts a search keyword (string)
 * updateLoadingState - method that changes loading state (boolean)
 */
function Search({ onSearchResults, updateLoadingState, stopUpdating }) {
  const [text, updateText] = React.useState('');


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        updateLoadingState(true);
        fetchGitHubRepo(text).then(res => {
          onSearchResults(res);
          updateLoadingState(false);
        });       
      }, 3000);
    return () => clearTimeout(delayDebounceFn);
  }, [text]);

 


  return (
    <div className="searchContainer">
      <input
        value={text}
        placeholder="Github repository name"
        onChange={({ target: { value } }) => updateText(value)}
        type="text"
      />
    </div>
  );
}

export default Search;
