import { Link } from 'react-router'
import { useSeo } from '../hooks/useSeo'

export default function NotFound() {
  useSeo({ ...notFoundSeo })
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page Not Found</h1>
      <p className="mt-3 text-muted-foreground">
        The page you're looking for doesn't exist — but our peptides do.
      </p>
      <Link to="/shop" className="mt-8 rounded-xl bg-primary px-7 py-3.5 font-bold text-primary-foreground hover:opacity-90">
        Browse the Catalogue
      </Link>
    </div>
  )
}
