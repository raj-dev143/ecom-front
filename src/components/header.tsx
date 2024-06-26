import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

import logo from "../../public/saptarishi-ayurvigyan.svg";

interface PropsType {
  user: User | null;
}

const Header = ({ user }: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Sign Out Successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Sign Out Fail");
    }
  };

  const cartItems = useSelector(
    (state: RootState) => state.cartReducer.cartItems
  );
  const totalItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className="header">
      <img
        src={logo}
        alt="Saptarishi Ayurvigyan"
        title="Saptarishi Ayurvigyan"
        className="logo"
      />
      <div className="nav-link">
        <Link onClick={() => setIsOpen(false)} to={"/"}>
          HOME
        </Link>
        <Link onClick={() => setIsOpen(false)} to={"/search"}>
          <FaSearch />
        </Link>
        <Link onClick={() => setIsOpen(false)} to={"/cart"}>
          <FaShoppingBag />
          {totalItemCount > 0 && (
            <span className="cart-count">{totalItemCount}</span>
          )}
        </Link>

        {user?._id ? (
          <>
            <button onClick={() => setIsOpen((prev) => !prev)}>
              <FaUser />
            </button>
            <dialog open={isOpen}>
              <div>
                {user.role === "admin" && (
                  <Link onClick={() => setIsOpen(false)} to="/admin/dashboard">
                    Admin
                  </Link>
                )}

                <Link onClick={() => setIsOpen(false)} to="/orders">
                  Orders
                </Link>
                <button onClick={logoutHandler}>
                  <FaSignOutAlt />
                </button>
              </div>
            </dialog>
          </>
        ) : (
          <Link to={"/login"}>
            <FaSignInAlt />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
