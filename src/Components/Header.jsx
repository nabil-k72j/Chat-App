import { LogOut } from "react-feather"
import { useAuth } from "../Utils/AuthContext"

const Header = () => {
    const {user, handleLogout} = useAuth()

  return (
    <div id="header--wrapper">

        {user ? (
            <>
                Welcome {user.name}
                <LogOut onClick={handleLogout} className="header--link"/>
            </>
        ):(
            <button>LogOut</button>
        )}

    </div>
  )
}

export default Header