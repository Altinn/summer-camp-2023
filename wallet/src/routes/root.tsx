import { Outlet } from "react-router-dom";
import style from "./root.module.sass";
import NavBar from "../components/NavBar";

function Root() {
  return (
    <>
      <header></header>
      <main>
        <Outlet />
      </main>
      <footer className={style.footer}>
        <NavBar />
        {/* <a href="https://www.flaticon.com/free-icons/money" title="money icons">
          Money icons created by Freepik - Flaticon
        </a> */}
      </footer>
    </>
  );
}

export default Root;
