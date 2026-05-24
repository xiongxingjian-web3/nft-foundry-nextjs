"use client";

import React, { useState } from "react";
import { useEthers } from "@/utils/ethers.js";
const MoodNftCard = () => {
  const {
    isHappy,
    mintMoodNft,
    flipMoodNft,
    arg,
    setArg,
    moodImage,
    isMoodLoading,
    resolveMoodMetadata
  } = useEthers();

  // 当用户输入 Token ID 后，自动获取图片
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setArg(val);
    if (val) {
      resolveMoodMetadata(val);
    }
  };

  return (
    <div className="nft-card">
      <div className="card-inner">
        <div className="image-container">
          {isMoodLoading ? (
            <div className="placeholder-content">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
              <p className="placeholder-text">获取心情中...</p>
            </div>
          ) : moodImage ? (
            <img
              src={moodImage}
              alt="Mood NFT"
              className="preview-image"
            />
          ) : (
            <div className="placeholder-content">
              <svg className="placeholder-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="placeholder-text">输入 Token ID 查看心情</p>
            </div>
          )}
        </div>
      </div>

      <div className="content-stack">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">心情 NFT</h3>
            <p className="card-description">在链上反映你的心情</p>
          </div>
          <span className={isHappy ? "badge-happy" : "badge-sad"}>
            {isHappy ? '开心' : '难过'}
          </span>
        </div>

        <div className="input-section">
          <label className="input-label">Token ID</label>
          <input
            type="number"
            placeholder="输入已有的 Token ID"
            className="input-field-purple"
            value={arg}
            onChange={handleIdChange}
          />
        </div>

        <div className="button-group">
          <button className="mint-button" onClick={mintMoodNft}>
            铸造 NFT
          </button>
          <button
            onClick={() => flipMoodNft(arg)}
            disabled={!arg || isMoodLoading}
            className="flip-button"
          >
            切换心情
          </button>
        </div>

      </div>
    </div>
  );
};

export default MoodNftCard;
