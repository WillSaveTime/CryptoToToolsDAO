import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../Layout'
import { Title } from '../Shared'
import Field from "Shared/Field"
import Button from 'Shared/Button'
import routes from 'routes'
import { ethers } from "ethers";
import Web3Modal from "web3modal"
import WalletConnectProvider from "@walletconnect/web3-provider";
import style from './style.module.scss'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { login } from 'services/auth.service'

import { useDispatch } from 'react-redux'
import { setWalletAddress } from 'app/reducers/userReducer'

type Props = {
  setAccessToken: (val: string) => void
}

const INFURA_ID = '0e42c582d71b4ba5a8750f688fce07da'
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    infuraId: INFURA_ID
  }
}

const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
  providerOptions
})

export default ({ setAccessToken }: Props) => {
  const dispatch = useDispatch();
  const [logined, setLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<object | any>();
  const [chainId, setChainId] = useState<number | null>();
  const [library, setLibrary] = useState<object>();
  const [message, setMessage] = useState<string>("");
  const [network, setNetwork] = useState<number | null | undefined>();

  useEffect(() => {
    if (account) {
      let nonce = {
        token: Math.floor(Math.random() * 1000000) + account
      }
      setAccessToken(nonce.token);
      sessionStorage.setItem('user', JSON.stringify(nonce));
      dispatch(setWalletAddress(account));
      setLoggedIn(true);
    }
  }, [account])

  const handleLogin = async () => {
    const res: any = await login(email, password);
    if (res.success) {
      sessionStorage.setItem('user', JSON.stringify(res));
      setAccessToken(res.token);
      setLoggedIn(true);
    } else {
      Object.keys(res).forEach((key, index) => {
        toast.warning(res[key]);
      })
    }
  }

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const accounts = await web3Provider.listAccounts();
      const network = await web3Provider.getNetwork();
      if (accounts) setAccount(accounts[0]);
      setProvider(provider);
      setChainId(network.chainId);
      setLibrary(web3Provider);
      if(network.chainId != 56) switchNetwork()
    } catch (error) {
      console.log('error', error)
    }
  };

  const handleNetwork = (e: any) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const handleInput = (e: any) => {
    const msg = e.target.value;
    setMessage(msg);
  };

  const switchNetwork = async () => {
    // try {
    //   await library.provider.request({
    //     method: "wallet_switchEthereumChain",
    //     params: [{ chainId: '0x38'  }]
    //   });
    // } catch (switchError: any) {
    //   if (switchError.code === 4902) {
    //     try {
    //       await library.provider.request({
    //         method: "wallet_addEthereumChain",
    //         params: [
    //           {
    //             chainName: 'BNB Smart Chain',
    //             chainId: '0x38',
    //             rpcUrls: ['https://bsc-dataseed.binance.org/']
    //           }
    //         ]
    //       });
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // }
  };

  const refreshState = () => {
    setAccount("");
    setChainId(null);
    setNetwork(null);
    setMessage("");
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
    toast({
      title: "Disconnected.",
      description: "You are disconnected from the App.",
      status: "success",
      duration: 3000,
      isClosable: true
    });
  };

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
      };

      const handleChainChanged = (_hexChainId: number) => {
        setChainId(_hexChainId);
      };

      const handleDisconnect = () => {
        console.log("disconnect");
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

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

