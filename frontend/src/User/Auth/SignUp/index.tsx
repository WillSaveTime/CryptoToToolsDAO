import React, { useState } from 'react'
import Layout from '../Layout'
import { Title } from '../Shared'
import Field from "Shared/Field"
import Button from 'Shared/Button'
import { Link, Redirect } from 'react-router-dom'
import routes from 'routes'
import style from './style.module.scss'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import { register, sendConfirmCode, checkConfirmCode } from 'services/auth.service'

type Props = {
  setAccessToken: (val: string) => void
  userId?: string
}

const ThanksPage = ({ setAccessToken, userId }: Props) => {
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

export default ({ setAccessToken }: Props) => {
  const [registered, setRegistered] = React.useState(false);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('')
  const [userId, setUserId] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [conPassword, setConPassword] = React.useState('')

  const handleRegister = async () => {
    const res: any = await register(firstName, lastName, email, password, conPassword);
    if (res._id) {
      setRegistered(true)
      setUserId(res._id)
      const code = Math.floor(100000 + Math.random() * 900000)
      const res1 = await sendConfirmCode(res._id, firstName, lastName, email, code)
    } else {
      Object.keys(res).forEach((key, index) => {
        toast.warning(
          res[key],
        );
      })
    }
  }

  if (registered)
    return <ThanksPage setAccessToken={setAccessToken} userId={userId} />

  return <Layout>
    <Title>Register</Title>
    <Field label='First Name' value={firstName} setValue={(str: string) => setFirstName(str)} />
    <Field label='Last Name' value={lastName} setValue={(str: string) => setLastName(str)} />
    <Field label='Email' type='email' value={email} setValue={(str: string) => setEmail(str)} />
    <Field label='Password' type='password' value={password} setValue={(str: string) => setPassword(str)} />
    <Field label='Confirm Password' type='password' value={conPassword} setValue={(str: string) => setConPassword(str)} />
    <div className={style.buttons}>
      <Button onClick={() => handleRegister()} className={style.button} primary shadow>Register</Button>
      <div className={style.center}>
        <Link to={routes.auth.logIn()} className={style.textButton}>Log in</Link>
      </div>
    </div>
    <ToastContainer />
  </Layout>
}
