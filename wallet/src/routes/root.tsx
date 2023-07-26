import { Link, NavLink, Outlet } from "react-router-dom";
import style from "./root.module.sass";

function Root() {
  return (
    <>
      <header>
        <h1>
          <Link to="/">root</Link>
        </h1>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className={style.footer}>
        <nav>
          <NavLink to="/wallet">Wallet</NavLink>
          <NavLink to="/add">Add</NavLink>
        </nav>
        {/* <a href="https://www.flaticon.com/free-icons/money" title="money icons">
          Money icons created by Freepik - Flaticon
        </a> */}
      </footer>
    </>
  );
}

export default Root;
