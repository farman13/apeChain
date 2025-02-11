// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0<0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract payment{
     IERC20 public apeCoin;
     
    address private immutable i_owner1 = 0x1e9E2B1Ef6c69169DFb1dB75F216CA174BC3e95c;
    address private immutable i_owner2 = 0xa1c798BEfC55394c72e6A89C9820C8c7C13757c8;
    address private immutable i_owner3 = 0x4058484A66359056E583510c7e63e78E7BE838e0;
    address private immutable i_owner4 = 0x85Bce15d980C143f17a4ff81E8Bf2f16f6bf2547;

    mapping(address => UserPaymentDetails[]) private payments;
    mapping(address => uint256) public ownerPercentages;
    mapping(address => uint256) public ownerBalances;

    event paymentDone(address indexed  payer, uint indexed amount, string purpose, uint date);
     
    struct UserPaymentDetails {
        uint256 amount;
        string purpose;
    }
     
      modifier onlyOwners() {
        require(
            msg.sender == i_owner1 ||
            msg.sender == i_owner2 ||
            msg.sender == i_owner3 ||
            msg.sender == i_owner4,
            "You are not an owner"
        );
        _;
    }

    modifier onlyOwner(){
        require(msg.sender == i_owner1 , "You are not the owner");
        _;
    }

     constructor(address apeCoinAddress, uint W1percentage, uint W2percentage, uint W3percentage, uint W4percentage) {
        apeCoin = IERC20(apeCoinAddress);
        ownerPercentages[0x1e9E2B1Ef6c69169DFb1dB75F216CA174BC3e95c] = W1percentage;
        ownerPercentages[0xa1c798BEfC55394c72e6A89C9820C8c7C13757c8] = W2percentage;
        ownerPercentages[0x4058484A66359056E583510c7e63e78E7BE838e0] = W3percentage;
        ownerPercentages[0x85Bce15d980C143f17a4ff81E8Bf2f16f6bf2547] = W4percentage;
     }
     
     function processPayment(uint256 amount, string memory purpose) public {

        require(amount > 0, "Amount must be greater than zero");   // added
        apeCoin.transferFrom(msg.sender,address(this), amount);

        payments[msg.sender].push(UserPaymentDetails({
            amount: amount,
            purpose: purpose
        }));
        
        
       ownerBalances[i_owner1] += (amount * ownerPercentages[i_owner1]) / 100;
       ownerBalances[i_owner2] += (amount * ownerPercentages[i_owner2]) / 100;
       ownerBalances[i_owner3] += (amount * ownerPercentages[i_owner3]) / 100;
       ownerBalances[i_owner4] += (amount * ownerPercentages[i_owner4]) / 100;
       
        emit paymentDone(msg.sender, amount, purpose, block.timestamp);
    }
    
     function withdraw() public onlyOwners {
        
        uint256 balance = ownerBalances[msg.sender];
        require(balance > 0, "No tokens available for withdrawal");

        ownerBalances[msg.sender] = 0;

        apeCoin.transfer(msg.sender, balance);
    }

    function updateOwnerPercentage(address owner, uint256 newPercentage) public onlyOwner {
        require(
            owner == i_owner1 || owner == i_owner2 || owner == i_owner3 || owner == i_owner4,
            "Invalid owner address"
        );
        require(newPercentage > 0, "Percentage must be greater than zero");
        
          uint256 totalPercent =
            ownerPercentages[i_owner1] +
            ownerPercentages[i_owner2] +
            ownerPercentages[i_owner3] +
            ownerPercentages[i_owner4] -
            ownerPercentages[owner] +
            newPercentage;

        require(totalPercent <= 100, "Total percentage must equal or less than 100");
        ownerPercentages[owner] = newPercentage;
 
    }

    function getPayments(address user) public view returns (UserPaymentDetails[] memory) {
        return payments[user];
    }
}
       

//0x6E03e498c79bFFCd4450D634BAccA2a537A30318 - new