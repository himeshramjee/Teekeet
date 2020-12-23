import Link from "next/link";

const HeaderComponent = ({ userIsAuthenticated }) => {
  const authLinks = [
    !userIsAuthenticated && { label: "Sign up", href: "/auth/sign-up" },
    !userIsAuthenticated && { label: "Sign in", href: "/auth/sign-in" },
    userIsAuthenticated && { label: "Sign out", href: "/auth/sign-out" },
  ]
    .filter((link) => link)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  const appLinks = [
    { label: "Events Catalogue", href: "#" },
    { label: "Orders", href: "#" },
  ]
    .filter((link) => link)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <Link href="/">
          <a className="navbar-brand">Teekeet</a>
        </Link>
        <div className="d-flex">
          <ul className="nav d-flex align-items-center">{appLinks}</ul>
        </div>
        <div className="d-flex justify-content-end">
          <ul className="nav d-flex align-items-center">{authLinks}</ul>
        </div>
      </nav>
    </div>
  );
};

export default HeaderComponent;
