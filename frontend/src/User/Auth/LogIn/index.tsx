import React, {useState} from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../Layout'
import { Title } from '../Shared'
import Field from "Shared/Field"
import Button from 'Shared/Button'
import routes from 'routes'
import style from './style.module.scss'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default () => {
  const [logined, setLogined] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword]=  useState('')
  const login = (): {} | void => {
    const info = {
      email,
      password
    }
    fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info)
    }).then((response) => {
      return response.json();
    }).then((data) => {
      
    }).catch((err) => TransformStream)
    setLogined(true)
  }
  if (logined)
    return <Redirect to="/"/>

  return <Layout>
    <Title>Login</Title>
    <Field label='Email' value={email} setValue={(str: string) => setEmail(str)} />
    <Field label='Password' type='password' value={password} setValue={(str: string) => setPassword(str)} />
    <div className={style.forgot}>Forgot passport?</div>
    <div className={style.buttons}>
      <Button onClick={() => login()} className={style.button} primary shadow>Login</Button>
      <Button component={Link} to={routes.auth.logInWithNumio()} className={style.button} primary outline shadow>
        Login with Numio
      </Button>
      <Link to={routes.auth.signUp()} className={style.center}>
        <div className={style.textButton}>Create account</div>
      </Link>
    </div>
  </Layout>
}

