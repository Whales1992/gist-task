import React from 'react';
import './details.scss';

/**
 * @param Repo - null or object containing properties:
 *    @property id - string
 *    @property title - string
 *    @property owner - string
 *    @property stars - number
 *    @property timestamp - number
 *    @property url - string
 *    @property avatar - string
 */
function Details({ repo, onClose }) {
  if (!repo) return null;

  const { avatar, owner, title, stars, timestamp, url } = repo;

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString();
  }

  return (
    <div className="detailsTopContainer">
      <span className="detailCloseIcon" onClick={onClose}>&#10006;</span>
      <div className="imageContainer">
        <img alt="github repo owner" src={avatar} />
      </div>

      <div className="contentContainer">
        <p className="detail">
          <span>Name:</span>
          <strong>{`${owner}/${title}`}</strong>
        </p>

        <p className="detail">
          <span>Created:</span>
          <strong>{formatDate(timestamp)}</strong>
        </p>

        <div className="detail">
          <span>Stars:</span>
          <strong>
            {stars} <span>&#9733;</span>
          </strong>
        </div>

        <div className="detail">
          <span>GitHub:</span>
          <a target="_blank" rel="noreferrer noopener" href={url}>
            Visit
          </a>
        </div>
      </div>
    </div>
  );
}

export default Details;
