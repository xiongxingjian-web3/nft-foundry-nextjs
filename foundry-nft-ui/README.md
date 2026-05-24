# foundry-nft-ui — 前端

基于 **Next.js** 与 **ethers.js v6** 的 NFT 铸造控制台，通过 MetaMask 与 `foundry-nft` 部署的合约交互。

> 完整仓库说明见上级目录 [README.md](../README.md)。

## 功能

| 模块 | 能力 |
|------|------|
| 钱包 | 连接 MetaMask，显示缩短地址 |
| 基础狗狗 NFT | 输入或选择 Token URI，预览元数据图片，调用 `mintNft` |
| 动态心情 NFT | 铸造、按 Token ID 预览链上 SVG、调用 `flipMood` 切换心情 |

## 目录结构

```
foundry-nft-ui/
├── app/
│   ├── page.tsx          # 主控制台
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── BasicNftCard.tsx  # BasicNft 铸造卡片
│   └── MoodNftCard.tsx   # MoodNft 铸造 / 翻转卡片
├── constants/
│   ├── contractAddresses.ts
│   └── abi/
├── utils/
│   └── ethers.js         # useEthers 钩子：钱包与合约交互
└── package.json
```

## 环境要求

- Node.js 18+
- 浏览器安装 [MetaMask](https://metamask.io/)
- 已部署的 `BasicNft`、`MoodNft` 合约地址（与 MetaMask 网络一致）

## 快速开始

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
NEXT_PUBLIC_BASIC_NFT_ADDRESS=0xYourBasicNftAddress
NEXT_PUBLIC_MOOD_NFT_ADDRESS=0xYourMoodNftAddress
```

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)，点击「连接钱包」，确保 MetaMask 网络与合约部署网络一致（本地 Anvil 或 Sepolia 等）。

## 环境变量

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_BASIC_NFT_ADDRESS` | BasicNft 合约地址 |
| `NEXT_PUBLIC_MOOD_NFT_ADDRESS` | MoodNft 合约地址 |

地址从 `foundry-nft` 部署脚本输出或 `broadcast/` 中获取；**不要**将含私钥的文件提交到 Git。

## 使用说明

### 基础狗狗 NFT

1. 在输入框填入 Token URI，或从下拉选择预设 IPFS 链接
2. 页面会尝试解析 JSON 元数据并预览图片
3. 连接钱包后点击「铸造 NFT」

预设 URI 对应 `foundry-nft/images/dogNft/` 中的示例元数据（柴犬、帕格、圣伯纳等）。

### 动态心情 NFT

1. 点击「铸造 NFT」获得新 Token
2. 输入 Token ID，自动解码链上 `tokenURI` 并显示 SVG
3. 点击「切换心情」调用 `flipMood`（需为 Token 持有人）

心情标签根据 SVG 特征推断（开心 / 难过）。

## 脚本命令

| 命令 | 作用 |
|------|------|
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建 |
| `npm run start` | 运行生产构建 |
| `npm run lint` | ESLint 检查 |

## 技术栈

- Next.js 16（App Router）
- React 19
- ethers.js 6
- Tailwind CSS 4
- TypeScript（组件）+ JavaScript（`utils/ethers.js`）

## 与合约的对应关系

| 前端 | 合约方法 |
|------|----------|
| BasicNftCard → `mintBasicNft` | `BasicNft.mintNft(string)` |
| MoodNftCard → `mintMoodNft` | `MoodNft.mintNft()` |
| MoodNftCard → `flipMoodNft` | `MoodNft.flipMood(uint256)` |
| 预览 | `tokenURI(uint256)` |

ABI 定义在 `constants/abi/`。

## 常见问题

**连接钱包后交易失败？**  
检查合约地址、网络链 ID 是否与部署环境一致，账户是否有足够 Gas。

**合约地址为空？**  
确认已配置 `.env.local` 并重启 `npm run dev`（Next.js 仅在启动时读取环境变量）。

**Mood NFT 预览失败？**  
确认 Token ID 已铸造且属于当前网络上的 MoodNft 合约。

## 许可证

MIT
