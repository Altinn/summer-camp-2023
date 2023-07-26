import { NavLink } from "react-router-dom";
import style from "./NavBar.module.sass";

function NavBar() {
  return (
    <nav className={style.nav}>
      <NavLink to="/wallet">Wallet</NavLink>
      <NavLink to="/add">Add</NavLink>
    </nav>
  );
}
export default NavBar;
