import { signOut } from "firebase/auth";
import { useContext, useState } from "react";
import { IoLogInOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";

import { auth } from "../../Firebase/FirebaseSDK";
import { UserContext } from "../../context/UserContext";
import { InfoBox } from "../InfoBox";
import "./NavbarAccount.css";
import { useNotification } from "../../context/NotificationContext";

export default function NavbarAccount() {
  const { showNotification } = useNotification();

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  async function signOutFunction(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      await signOut(auth);
      setUser && setUser(null);
    } catch (err) {
      console.error("Error in Firebase signOut:", err);
    }
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="navbar-account"
    >
      <div
        className={`navbar-account__button-container ${isOpen ? "navbar-account__button-container--open" : "navbar-account__button-container--closed"}`}
      >
        <div className="navbar-account__button">
          <button>
            <span className="navbar-account__avatar-container">
              {user ? (
                <RxAvatar className="navbar-account__avatar" />
              ) : (
                <>
                  <IoLogInOutline className="navbar-account__avatar" />
                  <p>Login</p>
                </>
              )}
            </span>
          </button>
        </div>
        {isOpen ? (
          <div className="navbar-account__dropdown">
            <div className="navbar-account__infobox-container">
              <InfoBox
                onClickOutside={() => setIsOpen(false)}
                className={"navbar-account__infobox"}
              >
                {user ? (
                  <>
                    <p className="navbar-account__email">{user?.email}</p>
                    <Link
                      to="/reservations/active"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                      className="navbar-account__details-button"
                    >
                      Reservations
                    </Link>
                    <button
                      onClick={(e) => {
                        signOutFunction(e);
                        setIsOpen(false);
                        navigate("/");
                        showNotification("Signed out successfully!", {
                          backgroundColor: "green",
                          textColor: "white",
                          duration: 3000,
                        });
                      }}
                      className="navbar-account__logout-button"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="login"
                      onClick={() => setIsOpen(false)}
                      className="navbar-account__login-button"
                    >
                      Sign In
                    </Link>
                    <hr className="navbar-account__divider" />
                    <Link
                      to="register"
                      onClick={() => setIsOpen(false)}
                      className="navbar-account__register-button"
                    >
                      Register
                    </Link>
                  </>
                )}
              </InfoBox>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
