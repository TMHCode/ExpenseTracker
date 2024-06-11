import React from 'react'
import { Loader } from '@mantine/core';

function Spinner() {
  return (
    <div>
        <Loader size="lg"
        type='oval'
        color="lime"
        />
    </div>
  )
}

export default Spinner