import React, { useState } from 'react'

function Community() {
  const [creations, setCreations]=useState([]);
  const {user}=useUser();
  return (
    <div>Community</div>
  )
}

export default Community