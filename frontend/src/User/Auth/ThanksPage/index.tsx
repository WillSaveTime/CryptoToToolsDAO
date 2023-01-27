import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import routes from 'routes'
import Button from 'Shared/Button'
import Field from "Shared/Field"
import Layout from '../Layout'
import { Title } from '../Shared'
import style from './style.module.scss'

import { checkConfirmCode } from 'services/auth.service'

type Props = {
  setAccessToken: (val: string) => void
  userId?: string
}

export default ({ setAccessToken, userId }: Props) => {
  const [confirmCode, setConfirmCode] = useState('');
  const [loggedIn, setLoggedIn] = useState(false)

  const verifyConfirmCode = async () => {
    const res: any = await checkConfirmCode(confirmCode, userId);
    console.log('res', res)
    if (res.success) {
      sessionStorage.setItem('user', JSON.stringify(res));
      setAccessToken(res.token)
      setLoggedIn(true)
    } else {
      Object.keys(res).forEach((key, index) => {
        toast.warning(res[key]);
      })
    }
  }

  if (loggedIn)
    return <Redirect to={routes.root()} />

    return <Layout className={style.thanksPage}>
    <Title>Thank you for creating an account and joining the DAO!</Title>
    <div className={style.verifyText}>Please verify your email to complete registration to login.</div>
    <Field label='Please input Verify Code' value={confirmCode} setValue={(str: string) => setConfirmCode(str)} />
    <div className={style.buttons}>
      <Button onClick={() => verifyConfirmCode()} className={style.button} primary shadow>Confirm</Button>
      <Button component={Link} to={routes.auth.logIn()} className={style.button} primary shadow>Log In</Button>
    </div>
  </Layout>

}