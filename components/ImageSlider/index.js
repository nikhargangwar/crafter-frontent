import React from 'react';
import './ImageSlider.css';
import ImageGallery from 'react-image-gallery';
import PropTypes from 'prop-types';

function ImageSlider({ text, images, emoji }) {
  return (
    <div className='image-slider'>
      <h1>{text} <span>Developer</span> {emoji}</h1>
      <div className='image-slider-images'>
        <ImageGallery 
          items={images}
          showNav={false}
          showThumbnails={false}
          showFullscreenButton={false}
          showPlayButton={false}
          slideInterval={3000}
          autoPlay={true}
        />
      </div>
    </div>
  );
}

ImageSlider.propTypes = {
  text: PropTypes.string.isRequired,
  images: PropTypes.shape({
    original: PropTypes.string.isRequired
  }),
  emoji: PropTypes.string.isRequired
};

export default ImageSlider;
