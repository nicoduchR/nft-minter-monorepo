import React from 'react'
import { mintRepositoryInstance } from '@/infrastructure/adapters/repositories/InMemoryMintRepository'

const MintList = async () => {

  const mints = await mintRepositoryInstance.getMints();

  return (
    <div>
      <h1>Liste des Mints</h1>
      {mints.map((mint) => (
        <div key={mint.id}>{mint.id}</div>
      ))}
    </div>
  )
}

export default MintList