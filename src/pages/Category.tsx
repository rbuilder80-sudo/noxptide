import { Navigate } from 'react-router'

/** All peptides live under one heading now — legacy category URLs redirect to the shop. */
export default function Category() {
  return <Navigate to="/shop" replace />
}
