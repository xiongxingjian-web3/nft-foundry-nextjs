"use client";
import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import {
  BASIC_NFT_ADDRESS,
  MOOD_NFT_ADDRESS,
} from "@/constants/contractAddresses.ts";
import { basicNftAbi } from "@/constants/abi/BasicNftAbi.ts";
import { moodNftAbi } from "@/constants/abi/MoodNftAbi.ts";

// 编写交互代码
export function useEthers() {
  const [isHappy, setIsHappy] = useState(true);
  const [arg, setArg] = useState("");
  const [account, setAccount] = useState("");
  const [tokenUri, setTokenUri] = useState("");
  const [provider, setProvider] = useState(null);
  const [basicNftContract, setBasicNftContract] = useState(null);
  const [moodNftContract, setMoodNftContract] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const providerInstance = new BrowserProvider(window.ethereum);
      setProvider(providerInstance);
    } else {
      console.warn("MetaMask 未安装");
    }
  }, []);
  // 当 provider 就绪后，初始化合约
  useEffect(() => {
    if (!provider) return;
    const basicNftContract = new ethers.Contract(
      BASIC_NFT_ADDRESS,
      basicNftAbi,
      provider,
    );
    setBasicNftContract(basicNftContract);
    const moodNftContract = new ethers.Contract(
      MOOD_NFT_ADDRESS,
      moodNftAbi,
      provider,
    );
    setMoodNftContract(moodNftContract);
  }, [provider]);
  // 更新账户（依赖 provider）
  const updateAccount = async () => {
    if (!provider) {
      console.warn("Provider 未就绪");
      return;
    }
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        console.log("当前用户地址", accounts[0]);
      }
    } catch (error) {
      console.error("获取账号失败:", error);
    }
  };
  // 当 provider 就绪后，尝试获取账户并监听事件
  useEffect(() => {
    if (!provider) return;
    updateAccount();
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        setAccount(accounts[0] || "");
      };
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
      };
    }
  }, [provider]);

  const connectWallet = async () => {
    await updateAccount();
  };

  const mintBasicNft = async (tokenUri) => {
    if (!basicNftContract) {
      console.error("合约未初始化");
      return;
    }
    const signer = await provider.getSigner();
    const contractWithSigner = basicNftContract.connect(signer);
    try {
      const tx = await contractWithSigner.mintNft(tokenUri);
      await tx.wait();
      console.log("铸造成功", tx.hash);
    } catch (error) {
      console.error("铸造失败", error);
    }
  };
  const mintMoodNft = async () => {
    if (!basicNftContract) {
      console.error("合约未初始化");
      return;
    }
    const signer = await provider.getSigner();
    const contractWithSigner = moodNftContract.connect(signer);
    try {
      const tx = await contractWithSigner.mintNft();
      await tx.wait();
      console.log("铸造成功", tx.hash);
    } catch (error) {
      console.error("铸造失败", error);
    }
  };
  const [moodImage, setMoodImage] = useState("");
  const [isMoodLoading, setIsMoodLoading] = useState(false);

  // 解析 Mood NFT 的 Token URI
  const resolveMoodMetadata = async (tokenId) => {
    if (!tokenId || !moodNftContract) return;
    setIsMoodLoading(true);
    try {
      await moodNftContract.ownerOf(tokenId);

      const uri = await moodNftContract.tokenURI(tokenId);
      // 解码 Base64 JSON
      const jsonBase64 = uri.split(",")[1];
      const decodedJson = JSON.parse(atob(jsonBase64));
      setMoodImage(decodedJson.image);

      // 根据图片内容判断心情（用于标签显示）
      if (decodedJson.image.startsWith("data:image/svg+xml;base64,")) {
        const svgBase64 = decodedJson.image.split(",")[1];
        const svgText = atob(svgBase64);
        setIsHappy(svgText.includes('viewBox="0 0 200 200"'));
      }
    } catch (error) {
      console.error("解析 Mood Metadata 失败:", error);
      setMoodImage("");
    } finally {
      setIsMoodLoading(false);
    }
  };

  const flipMoodNft = async (tokenId) => {
    if (!moodNftContract || !tokenId) {
      console.error("合约未初始化或未输入 ID");
      return;
    }
    const signer = await provider.getSigner();
    const contractWithSigner = moodNftContract.connect(signer);
    try {
      const tx = await contractWithSigner.flipMood(tokenId);
      await tx.wait();

      console.log("翻转成功", tx.hash);
      // 翻转成功后重新获取最新的元数据
      await resolveMoodMetadata(tokenId);
    } catch (error) {
      console.error("翻转失败 tokenId错误", error);
    }
  };

  return {
    connectWallet,
    account,
    tokenUri,
    setTokenUri,
    mintBasicNft,
    mintMoodNft,
    flipMoodNft,
    isHappy,
    arg,
    setArg,
    moodImage,
    isMoodLoading,
    resolveMoodMetadata,
  };
}
