import React from 'react'
import Alert from 'react-bootstrap/Alert';

export default function MessageBox({variant , err ,key} ) {
  return (
    <Alert key={key} variant={variant}>
        {err.message}
  </Alert>
  )
}
