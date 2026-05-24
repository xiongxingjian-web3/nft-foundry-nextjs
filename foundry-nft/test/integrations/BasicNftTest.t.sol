// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {BasicNft} from "../../src/BasicNft.sol";
import {Test} from "forge-std/Test.sol";
import {DeployBasicNft} from "../../script/DeployBasicNft.s.sol";
contract BasicNftTest is Test {
    DeployBasicNft deployBasicNft;
    BasicNft basicNft;
    address public USER = makeAddr("user");
    string public constant PUG =
        "ipfs://QmPUXFbfWNQw2sAyj3KwCCmYLu92bgE3rtJHaqvfsF2yc5";
    function setUp() public {
        deployBasicNft = new DeployBasicNft();
        basicNft = deployBasicNft.run();
    }
    function testNameIsCorrect() public view {
        assertEq(basicNft.name(), "Dogie");
        assertEq(basicNft.symbol(), "DOG");
    }
    function testCanMintAndHaveABalance() public {
        vm.prank(USER);
        basicNft.mintNft(PUG);
        assertEq(basicNft.balanceOf(USER), 1);
        assertEq(basicNft.tokenURI(0), PUG);
    }
}
