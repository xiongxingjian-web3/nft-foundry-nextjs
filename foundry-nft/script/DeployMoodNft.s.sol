// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {Script} from "forge-std/Script.sol";
import {MoodNft} from "../src/MoodNft.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
contract DeployMoodNft is Script {
    MoodNft public moodNft;
    function run() public returns (MoodNft) {
        vm.startBroadcast();
        moodNft = new MoodNft(
            svgToImageURI(vm.readFile("./images/dynamicNft/sad.svg")),
            svgToImageURI(vm.readFile("./images/dynamicNft/happy.svg"))
        );
        vm.stopBroadcast();
        return moodNft;
    }

    function svgToImageURI(string memory svg) public returns (string memory) {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }
}
