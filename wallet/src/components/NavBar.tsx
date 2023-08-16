import { NavLink } from "react-router-dom";
import style from "./NavBar.module.sass";
import { WalletIcon } from "@navikt/aksel-icons";

function NavBar() {
  return (
    <nav className={style.nav}>
      <NavLink to="/wallet">
        <WalletIcon title="Wallet" fontSize="3rem" />
        <span>Wallet</span>
      </NavLink>
      <NavLink to="/add">Add</NavLink>
    </nav>
  );
}
export default NavBar;
