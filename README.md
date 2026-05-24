# NFT 系列开发（Foundry + Next.js）

基于 **Foundry** 的智能合约与 **Next.js** 前端，实现两类 ERC-721 NFT：**基础狗狗 NFT**（链下元数据 URI）与 **动态心情 NFT**（链上 JSON + SVG 元数据，可切换心情）。

## 项目结构

```
NFT 系列开发/
├── foundry-nft/          # 智能合约（Solidity + Foundry）
│   ├── src/              # BasicNft、MoodNft
│   ├── script/           # 部署与交互脚本
│   ├── test/             # 单元测试与集成测试
│   ├── images/           # MoodNft 部署用 SVG
│   ├── Makefile          # 常用命令封装
│   └── foundry.toml
└── foundry-nft-ui/       # 前端（Next.js + ethers.js）
    ├── app/              # 页面
    ├── components/       # NFT 交互卡片
    ├── constants/        # ABI 与合约地址（环境变量）
    └── utils/            # 钱包与合约交互
```

## 功能概览

| 模块 | 合约 | 说明 |
|------|------|------|
| BasicNft | `BasicNft.sol` | 标准 ERC-721，铸造时传入 Token URI（如 IPFS） |
| MoodNft | `MoodNft.sol` | 链上 Base64 JSON 元数据，支持 `flipMood` 切换开心/难过 |
| 前端 | `foundry-nft-ui` | MetaMask 连接、铸造、预览、心情翻转 |

## 环境要求

- [Foundry](https://book.getfoundry.sh/getting-started/installation)（`forge`、`cast`、`anvil`）
- [Node.js](https://nodejs.org/) 18+（前端）
- MetaMask 浏览器插件（前端交互）
- （可选）Sepolia 测试网 ETH、Alchemy/Infura RPC、Etherscan API Key

## 快速开始

### 1. 克隆并安装合约依赖

```bash
cd foundry-nft
cp .env.example .env
# 编辑 .env，填入 SEPOLIA_RPC_URL、PRIVATE_KEY、ETHERSCAN_API_KEY

make install
forge build
forge test
```

> `lib/` 目录由 `make install` 根据 `foundry.lock` 安装，无需提交到 Git。

### 2. 本地部署与测试

终端 1 — 启动本地链：

```bash
cd foundry-nft
make anvil
```

终端 2 — 部署与铸造：

```bash
cd foundry-nft
make deploy          # 部署 BasicNft
make deployMood      # 部署 MoodNft
make mint            # 铸造 BasicNft
make mintMoodNft     # 铸造 MoodNft
# make flipMoodNft TOKEN_ID=0  # 翻转心情
```

部署成功后，从终端输出或 `cast` 获取合约地址。

### 3. 部署到 Sepolia（可选）

```bash
cd foundry-nft
make deploy ARGS="--network sepolia"
make deployMood ARGS="--network sepolia"
```

需在 `.env` 中配置 Sepolia RPC 与私钥。Makefile 会自动附加 `--verify` 等参数。

### 4. 启动前端

```bash
cd foundry-nft-ui
cp .env.example .env.local
# 填入 NEXT_PUBLIC_BASIC_NFT_ADDRESS、NEXT_PUBLIC_MOOD_NFT_ADDRESS

npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)，连接 MetaMask（需切换到与合约相同的网络）。

## 合约说明

### BasicNft

- 继承 OpenZeppelin `ERC721`
- `mintNft(string tokenUri)`：为调用者铸造 NFT，URI 指向元数据（常见为 IPFS）
- `tokenURI(uint256)`：返回对应 Token 的 URI

### MoodNft

- 构造函数注入开心/难过 SVG 的 `data:image/svg+xml;base64,...` URI
- `mintNft()`：按 Token ID 奇偶分配初始心情
- `flipMood(uint256)`：持有人或授权地址可切换心情
- `tokenURI`：在链上拼接 JSON 并 Base64 编码，完全链上元数据

### 交互脚本

`script/Interactions.s.sol` 使用 `foundry-devops` 的 `DevOpsTools.get_most_recent_deployment` 从 `broadcast/` 读取最近部署地址。本地开发需先执行部署脚本生成记录。

## 测试

```bash
cd foundry-nft
forge test
forge test -vvv   # 详细日志
```

测试包含单元测试（`test/unit/`）与集成测试（`test/integrations/`）。

## 常用 Makefile 命令

| 命令 | 作用 |
|------|------|
| `make install` | 安装 Foundry 依赖 |
| `make build` | 编译合约 |
| `make test` | 运行测试 |
| `make anvil` | 启动本地节点 |
| `make deploy` | 部署 BasicNft |
| `make deployMood` | 部署 MoodNft |
| `make mint` | 铸造 BasicNft |
| `make mintMoodNft` | 铸造 MoodNft |
| `make flipMoodNft TOKEN_ID=n` | 翻转心情 |

## 安全说明

以下内容**不会**也不应提交到 Git：

- `.env`、`.env.local`（私钥、RPC Key、API Key）
- `foundry-nft/broadcast/`（含部署者地址与交易详情）
- `零基础教学.md` 等本地教学笔记

若私钥曾泄露或误提交，请立即更换钱包并在测试网转移资产。

## 技术栈

- **合约**：Solidity 0.8.19、OpenZeppelin Contracts、Foundry
- **前端**：Next.js 16、React 19、ethers.js v6、Tailwind CSS 4

## 许可证

MIT（与合约文件 SPDX 标识一致）
