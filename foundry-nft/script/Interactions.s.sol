// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {BasicNft} from "../src/BasicNft.sol";
import {MoodNft} from "../src/MoodNft.sol";
import {Script} from "forge-std/Script.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";
contract MintBasicNft is Script {
    BasicNft basicNft;
    string public constant PUG =
        "ipfs://QmPUXFbfWNQw2sAyj3KwCCmYLu92bgE3rtJHaqvfsF2yc5";

    function run() public {
        address mostRecentDeployer = DevOpsTools.get_most_recent_deployment(
            "BasicNft",
            block.chainid
        );
        mintNftOnContract(mostRecentDeployer);
    }
    function mintNftOnContract(address _contractAddress) public {
        vm.startBroadcast();
        basicNft = BasicNft(_contractAddress);
        basicNft.mintNft(PUG);
        vm.stopBroadcast();
    }
}
contract MintMoodNft is Script {
    MoodNft moodNft;

    function run() public {
        address mostRecentDeployer = DevOpsTools.get_most_recent_deployment(
            "MoodNft",
            block.chainid
        );
        mintNftOnContract(mostRecentDeployer);
    }
    function mintNftOnContract(address _contractAddress) public {
        vm.startBroadcast();
        moodNft = MoodNft(_contractAddress);
        moodNft.mintNft();
        vm.stopBroadcast();
    }
}
contract FlipMoodNft is Script {
    MoodNft public moodNft;
    function run(uint256 _tokenId) public {
        address mostRecentDeployer = DevOpsTools.get_most_recent_deployment(
            "MoodNft",
            block.chainid
        );
        flipMoodOnContract(mostRecentDeployer, _tokenId);
    }
    function flipMoodOnContract(
        address _contractAddress,
        uint256 _tokenId
    ) public {
        vm.startBroadcast();
        moodNft = MoodNft(_contractAddress);
        moodNft.flipMood(_tokenId);
        vm.stopBroadcast();
    }
}
