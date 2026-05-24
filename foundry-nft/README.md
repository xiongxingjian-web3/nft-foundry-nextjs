# foundry-nft — 智能合约

基于 [Foundry](https://book.getfoundry.sh/) 的 ERC-721 NFT 合约项目，包含 **BasicNft**（外链元数据）与 **MoodNft**（链上动态元数据 + 心情切换）。

> 完整仓库说明见上级目录 [README.md](../README.md)。

## 目录结构

```
foundry-nft/
├── src/
│   ├── BasicNft.sol      # 基础狗狗 NFT
│   └── MoodNft.sol       # 动态心情 NFT
├── script/
│   ├── DeployBasicNft.s.sol
│   ├── DeployMoodNft.s.sol
│   └── Interactions.s.sol   # 铸造 / 翻转心情
├── test/
│   ├── unit/
│   └── integrations/
├── images/
│   └── dynamicNft/       # MoodNft 部署用 SVG
├── Makefile
├── foundry.toml
└── foundry.lock
```

## 合约简介

### BasicNft

| 项目 | 说明 |
|------|------|
| 标准 | ERC-721（OpenZeppelin） |
| 名称 / 符号 | Dogie / DOG |
| 核心方法 | `mintNft(string tokenUri)` |
| 元数据 | 每个 `tokenId` 对应一个 Token URI（如 `ipfs://...`） |

### MoodNft

| 项目 | 说明 |
|------|------|
| 标准 | ERC-721（OpenZeppelin） |
| 名称 / 符号 | Mood NFT / MN |
| 核心方法 | `mintNft()`、`flipMood(uint256)` |
| 元数据 | 链上 JSON + Base64，`tokenURI` 返回 `data:application/json;base64,...` |
| 图片 | 部署时注入开心 / 难过 SVG 的 `data:image/svg+xml;base64,...` |

`mintNft` 按 Token ID 奇偶分配初始心情；仅持有人或已授权地址可调用 `flipMood`。

## 环境要求

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- （部署 Sepolia）测试网 ETH、RPC URL、Etherscan API Key

## 安装与编译

```bash
cp .env.example .env
# 编辑 .env：SEPOLIA_RPC_URL、PRIVATE_KEY、ETHERSCAN_API_KEY

make install    # 安装 lib/ 依赖（forge-std、openzeppelin、foundry-devops）
forge build
```

## 测试

```bash
forge test
forge test -vvv    # 详细输出
```

| 路径 | 说明 |
|------|------|
| `test/unit/MoodNftTest.t.sol` | MoodNft 单元测试 |
| `test/integrations/BasicNftTest.t.sol` | BasicNft 部署 + 铸造集成 |
| `test/integrations/MoodNftIntegrationTest.t.sol` | MoodNft 部署 + flip 集成 |

## 本地部署

**终端 1** — 启动 Anvil：

```bash
make anvil
```

**终端 2** — 部署与交互：

```bash
make deploy          # 部署 BasicNft
make deployMood      # 部署 MoodNft（读取 images/dynamicNft/*.svg）
make mint            # 对最新 BasicNft 铸造
make mintMoodNft     # 对最新 MoodNft 铸造
make flipMoodNft TOKEN_ID=0   # 翻转指定 Token 心情
```

部署记录写入 `broadcast/`（已加入 `.gitignore`，勿提交）。

## Sepolia 部署

```bash
make deploy ARGS="--network sepolia"
make deployMood ARGS="--network sepolia"
```

Makefile 在检测到 `--network sepolia` 时会使用 `.env` 中的 RPC、私钥与 Etherscan Key，并附带 `--verify`。

## 脚本说明

- **DeployBasicNft**：`new BasicNft()`
- **DeployMoodNft**：读取 `images/dynamicNft/sad.svg`、`happy.svg`，转为 Base64 data URI 后传入构造函数
- **Interactions.s.sol**：通过 `foundry-devops` 的 `DevOpsTools.get_most_recent_deployment` 自动解析最近部署地址

## Makefile 速查

| 命令 | 作用 |
|------|------|
| `make install` | 安装依赖 |
| `make build` | 编译 |
| `make test` | 测试 |
| `make anvil` | 本地链 |
| `make deploy` | 部署 BasicNft |
| `make deployMood` | 部署 MoodNft |
| `make mint` | 铸造 BasicNft |
| `make mintMoodNft` | 铸造 MoodNft |
| `make flipMoodNft TOKEN_ID=n` | 翻转心情 |

## 配置说明

`foundry.toml` 中 `fs_permissions` 允许脚本读取 `./images` 与 `./broadcast`，供 `vm.readFile` 与 DevOps 工具使用。

## 依赖

由 `foundry.lock` 锁定，通过 `make install` 安装：

- [forge-std](https://github.com/foundry-rs/forge-std)
- [openzeppelin-contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)
- [foundry-devops](https://github.com/ChainAccelOrg/foundry-devops)

## 安全提示

- 切勿将 `.env` 或 `broadcast/` 提交到 Git
- Anvil 默认私钥仅用于本地，禁止用于主网

## 许可证

MIT
