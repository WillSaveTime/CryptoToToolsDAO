import React, { useEffect } from 'react'
import { Link } from "react-router-dom"
import ProfileModal from 'User/ProfileModal'
import routes from "routes"
import logo from "assets/images/logo.png"
import avatar from "assets/images/avatar.png"
import style from './style.module.scss'
import { getUserBoard } from 'services/user.service'

import { useDispatch, useSelector } from 'react-redux'
import { setUserInfo } from 'app/reducers/userReducer'
import { RootState } from 'app/store'

export default () => {
  const walletAddress = useSelector((state: RootState) => state.user.walletAddress);
  const dispatch = useDispatch()

  const [modalOpen, setModalOpen] = React.useState(false)
  const [currentUser, setCurrentUser] = React.useState({
    id: null,
    firstName: null,
    lastName: null,
    email: null
  })
  useEffect(() => {
    console.log(walletAddress)
    if (!walletAddress)
      getUserBoard()
        .then((data) => {
          setCurrentUser(data);
          dispatch(setUserInfo(data))
        })
  }, [modalOpen])

  return <>
    {
      modalOpen &&
      <ProfileModal close={() => setModalOpen(false)} walletAddress={walletAddress} currentUser={currentUser} />
    }
    <div className={style.topBar}>
      <Link className={style.logo} to={routes.root}>
        <img src={logo} alt="logo" />
      </Link>
      <div className={style.user} onClick={() => setModalOpen(true)}>
        {walletAddress ? (
          <div>
            <div className={style.name}>{walletAddress.slice(0,4)}...{walletAddress.slice(-4)}</div>
          </div>
        ) : (
          <div>
            <div className={style.name}>{currentUser.firstName} {currentUser.lastName}</div>
            <div className={style.email}>{currentUser.email}</div>
          </div>
        )}
        <div className={style.avatar} style={{ backgroundImage: `url(${avatar})` }} />
      </div>
    </div>
  </>
}
