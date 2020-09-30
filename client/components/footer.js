import Link from "next/link";

const FooterComponent = () => {
  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <Link href="/">
          <a className="navbar-brand">Teekeet</a>
        </Link>
        <div className="d-flex justify-content-end">
          Copyright &copy;2020 All rights reserved
        </div>
      </nav>
    </div>
  );
};

export default FooterComponent;
