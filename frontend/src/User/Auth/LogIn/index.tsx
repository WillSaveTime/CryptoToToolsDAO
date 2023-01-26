import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../Layout'
import { Title } from '../Shared'
import Field from "Shared/Field"
import Button from 'Shared/Button'
import routes from 'routes'
import style from './style.module.scss'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { login } from 'services/auth.service'

import { useDispatch } from 'react-redux'
import { setWalletAddress } from 'app/reducers/userReducer'

type Props = {
  setAccessToken: (val: string) => void
}

export default ({ setAccessToken }: Props) => {
  const dispatch = useDispatch();
  const [logined, setLogined] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if ((window as any).ethereum) {
      setIsMetamaskInstalled(true);
    }
  }, []);

  useEffect(() => {
    if (account) {
      let nonce = {
        token: Math.floor(Math.random() * 1000000) + account
      }
      setAccessToken(nonce.token);
      sessionStorage.setItem('user', JSON.stringify(nonce));
      dispatch(setWalletAddress(account));
      setLogined(true);
    }
  }, [account])

  const handleLogin = async () => {
    const res: any = await login(email, password);
    if (res.success) {
      sessionStorage.setItem('user', JSON.stringify(res));
      setAccessToken(res.token);
      setLogined(true);
    } else {
      toast.error('Email or password is not correct!');
    }
  }

  const connectWallet = async (): Promise<void> => {
    if (!isMetamaskInstalled) {
      toast.error('Please install MetaMask!');
      return
    }
    (window as any).ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts: string[]) => {
        setAccount(accounts[0]);
      })
      .catch((error: any) => {
        toast.error(`Something went wrong: ${error}`);
      });
    // check if the chain to connect to is installed
    await (window as any).ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x38' }], // chainId must be in hexadecimal numbers
    }).catch(async (error: any) => {
      if (error.code === 4902) {
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: 'BNB Smart Chain',
              chainId: '0x38',
              rpcUrls: ['https://bsc-dataseed.binance.org/']
            }
          ]
        });
      } else {
        toast.error(`Something went wrong: ${error}`);
      }
    });
  }

  if (logined)
    return <Redirect to={routes.root()} />

  return <Layout>
    <Title>Login</Title>
    <Field label='Email' value={email} setValue={(str: string) => setEmail(str)} />
    <Field label='Password' type='password' value={password} setValue={(str: string) => setPassword(str)} />
    <div className={style.forgot}>Forgot passport?</div>
    <div className={style.buttons}>
      <Button onClick={() => handleLogin()} className={style.button} primary shadow>Login</Button>
      <Button onClick={() => connectWallet()} className={style.button} primary outline shadow>
        Login with MetaMask
      </Button>
      <Link to={routes.auth.signUp()} className={style.center}>
        <div className={style.textButton}>Create account</div>
      </Link>
    </div>
    <ToastContainer />
  </Layout>
}

