import React from 'react'

const PostImage = ({url}) => {
  return (
    <div>
        {url &&  (<img src={url} alt="post-image"className='m-1'height={300} />)}
    </div>
  )
}

export default PostImage;