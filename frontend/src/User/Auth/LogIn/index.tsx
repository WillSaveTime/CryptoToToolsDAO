import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../Layout'
import { Title } from '../Shared'
import Field from "Shared/Field"
import Button from 'Shared/Button'
import routes from 'routes'
import Web3 from "web3"
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

const INFURA_ID = '88b3ca144c6648df843909df0371ee08'
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    infuraId: INFURA_ID
  }
}

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions
})

export default ({ setAccessToken }: Props) => {
  const dispatch = useDispatch();
  const [logined, setLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<object | any>();
  const [chainId, setChainId] = useState<number | null>();
  const [library, setLibrary] = useState<any>();
  const [error, setError] = useState<string | null>("");
  const [message, setMessage] = useState<string>("");
  const [network, setNetwork] = useState<number | null | undefined>();

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
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      setProvider(provider);
      if (accounts) setAccount(accounts[0]);
      setChainId(network.chainId);
      setLibrary(library);
    } catch (error: any) {
      setError(error);
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
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: '0x38'  }]
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: 'BNB Smart Chain',
                chainId: '0x38',
                rpcUrls: ['https://bsc-dataseed.binance.org/']
              }
            ]
          });
        } catch (error: any) {
          setError(error);
        }
      }
    }
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
        console.log("disconnect", error);
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

  // const connectWallet = async (): Promise<void> => {
  //   if (!isMetamaskInstalled) {
  //     toast.error('Please install MetaMask!');
  //     return
  //   }
  //   (window as any).ethereum
  //     .request({
  //       method: "eth_requestAccounts",
  //     })
  //     .then((accounts: string[]) => {
  //       setAccount(accounts[0]);
  //     })
  //     .catch((error: any) => {
  //       toast.error(`Something went wrong: ${error}`);
  //     });
  //   // check if the chain to connect to is installed
  //   await (window as any).ethereum.request({
  //     method: 'wallet_switchEthereumChain',
  //     params: [{ chainId: '0x38' }], // chainId must be in hexadecimal numbers
  //   }).catch(async (error: any) => {
  //     if (error.code === 4902) {
  //       await (window as any).ethereum.request({
  //         method: 'wallet_addEthereumChain',
  //         params: [
  //           {
  //             chainName: 'BNB Smart Chain',
  //             chainId: '0x38',
  //             rpcUrls: ['https://bsc-dataseed.binance.org/']
  //           }
  //         ]
  //       });
  //     } else {
  //       toast.error(`Something went wrong: ${error}`);
  //     }
  //   });
  // }

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

