"use client";

import React, { useState } from "react";
import { useEthers } from "@/utils/ethers.js";

const BasicNftCard = () => {
  const { mintBasicNft, tokenUri, setTokenUri } = useEthers();
  const [displayImage, setDisplayImage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 处理 IPFS 地址转换
  const getImageUrl = (uri: string) => {
    if (!uri) return "";
    if (uri.startsWith("ipfs://")) {
      return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return uri;
  };

  // 核心逻辑：解析 Token URI
  const resolveMetadata = async (uri: string) => {
    if (!uri) {
      setDisplayImage("");
      return;
    }

    const url = getImageUrl(uri);
    setIsLoading(true);
    setImageError(false);

    try {
      // 尝试获取内容判断是否为 JSON
      const response = await fetch(url);
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.image) {
          setDisplayImage(getImageUrl(data.image));
        } else {
          setDisplayImage(url); // 如果 JSON 里没图片，回退到原始链接
        }
      } else {
        // 如果不是 JSON，可能直接就是图片链接
        setDisplayImage(url);
      }
    } catch (error) {
      console.error("解析 Metadata 失败:", error);
      // 报错后尝试直接作为图片显示
      setDisplayImage(url);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTokenUri(value);
    setImageError(false);
    // 简单的防抖或即时触发
    if (value) {
      resolveMetadata(value);
    } else {
      setDisplayImage("");
    }
  };

  const PREDEFINED_URIS = [
    { label: "柴犬 (Shiba Inu)", value: "ipfs://QmPUXFbfWNQw2sAyj3KwCCmYLu92bgE3rtJHaqvfsF2yc5" },
    { label: "帕格犬 (Pug)", value: "ipfs://QmTc3NUyTLy6GfDnwz9nfwtxcN7gPJ1mUKE43mCWvK1VpT" },
    { label: "圣伯纳犬 (St. Bernard)", value: "ipfs://QmXeM1tEaMK4gUv4824xCBwSuZ2iN7kWW1gWmoMW11nDP9" }
  ];

  return (
    <div className="nft-card">
      <div className="card-inner">
        <div className="image-container">
          {isLoading ? (
            <div className="placeholder-content">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="placeholder-text">解析中...</p>
            </div>
          ) : displayImage && !imageError ? (
            <img
              src={displayImage}
              alt="NFT 预览"
              className="preview-image"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="placeholder-content">
              <svg className="placeholder-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="placeholder-text">
                {imageError ? "图片加载失败，请检查 URI" : "等待输入 Token URI..."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="content-stack">
        <div>
          <h3 className="card-title">基础狗狗 NFT</h3>
          <p className="card-description">简单的 ERC721 狗狗 NFT</p>
        </div>

        <div className="input-section">
          <label className="input-label">选择或输入 Token URI</label>
          <div className="relative group">
            <input
              type="text"
              list="dog-uris"
              placeholder="ipfs://... 或从下拉列表选择"
              className="input-field"
              value={tokenUri}
              onChange={handleUriChange}
            />
            <datalist id="dog-uris">
              {PREDEFINED_URIS.map((uri, index) => (
                <option key={index} value={uri.value}>
                  {uri.label}
                </option>
              ))}
            </datalist>
          </div>
        </div>

        <button
          className="primary-button"
          disabled={!tokenUri}
          onClick={() => mintBasicNft(tokenUri)}
        >
          铸造 NFT
        </button>
      </div>
    </div>
  );
};

export default BasicNftCard;
