"use client";

import BasicNftCard from "@/components/BasicNftCard";
import MoodNftCard from "@/components/MoodNftCard";
import { useEthers } from "@/utils/ethers.js";

export default function Home() {
  const { connectWallet, account } = useEthers();
  return (
    <div className="nft-dashboard-container">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <button className="connect-wallet-button" onClick={connectWallet}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
          {account ? account.slice(0, 4) + "..." + account.slice(-4) : "连接钱包"}
        </button>
      </nav>

      <div className="dashboard-wrapper">
        {/* Header Section */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">NFT 铸造控制台</h1>
          <p className="dashboard-subtitle">
            在区块链上与你的自定义 NFT 合约进行交互。铸造独特的狗狗 NFT 或表达你当前的心情。
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid-layout">
          {/* Basic NFT Section */}
          <div className="section-container">
            <h2 className="section-title">
              <span className="icon-badge-blue">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </span>
              基础狗狗 NFT
            </h2>
            <BasicNftCard />
          </div>

          {/* Mood NFT Section */}
          <div className="section-container">
            <h2 className="section-title">
              <span className="icon-badge-purple">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </span>
              动态心情 NFT
            </h2>
            <MoodNftCard />
          </div>
        </div>

        {/* Footer Info */}
        <div className="footer-section">
          <p>基于 Foundry & Next.js 开发。已准备好交互逻辑。</p>
        </div>
      </div>
    </div>
  );
}
