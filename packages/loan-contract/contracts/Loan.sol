pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract Loan is Initializable {

  function initialize() public initializer {
  }

  address constant KOVAN_DAI_CONTRACT_ADDRESS = 0xC4375B7De8af5a38a93548eb8453a498222C4fF2;

  // TODO: move all possible data to swarm encrypted storage
  struct LoanData {
    string swarmHash;

    // Lender eth address
    address lender;

    // Borrower eth address
    address borrower;

    // Amount in DAI
    uint256 amount;

    // Status
    LoanStatuses status;
  }

  enum LoanStatuses {

    // Borrower requested a loan to some contact
    Requested,

    // Lender approved a loan
    Approved,

    // Borrower paid the debt
    Paid
  }

  // Contains all created loans
  LoanData[] loans;

  uint256 totalLoanCount;

  // Addresses the loan data mapped by the lender address; One lender
  // can give money to many borrowers.
  //
  // The key is the lender address, the value is an array of numeric indexes
  // to elements from the loans array.
  mapping (address => uint256[]) public loansByLender;

  // Addresses the loan data mapped by the borrower address; One borrower
  // can borrow money from many lenders.
  //
  // The key is the borrower address, the value is an array of numeric indexes
  // to elements from the loans array.
  mapping (address => uint256[]) public loansByBorrower;

  event LoanRequested (
    address borrower,
    address lender
  );

  // Called by the borrower who wants to request money from a known lender
  //
  // Returns how many loans this borrower has already requested; the loan data
  // can be read by calling loansByBorrower[index] with this returned value.
  function requestLoan(address lender, uint256 amount) public returns (uint256) {
    require(lender != msg.sender, "You can't borrow money from yourself");

    LoanData memory loan = LoanData("", lender, msg.sender, amount, LoanStatuses.Requested);
    totalLoanCount = loans.push(loan);
    uint256 loanIdx = totalLoanCount - 1;
    loansByLender[lender].push(loanIdx);
    uint256 loanCount = loansByBorrower[msg.sender].push(loanIdx);

    emit LoanRequested(msg.sender, lender);
    return loanCount;
  }

  // Called by the lender to approve a lend request made by a borrower
  function approveLoan(uint256 index) public {
    uint256 globalIndex = loansByLender[msg.sender][index];
    LoanData storage loan = loans[globalIndex];
    require(loan.status == LoanStatuses.Requested, "Loan must be in Requested status");

    // Check if the lender has previously approved this contract to spend
    // the necessary amount of tokens
    IERC20 dai = IERC20(KOVAN_DAI_CONTRACT_ADDRESS);
    require(dai.allowance(msg.sender, address(this)) >= loan.amount, "Cannot spend required amount of DAI on behalf of caller");

    require(dai.transferFrom(msg.sender, loan.borrower, loan.amount), "Could not transfer tokens to the borrower");
    loan.status = LoanStatuses.Approved;
  }

  // Called by the borrower to pay the debt
  function payDebt(uint256 index) public {
    uint256 globalIndex = loansByBorrower[msg.sender][index];
    LoanData storage loan = loans[globalIndex];
    require(loan.status == LoanStatuses.Approved, "Loan must be in Approved status");

    IERC20 dai = IERC20(KOVAN_DAI_CONTRACT_ADDRESS);
    require(dai.allowance(msg.sender, address(this)) >= loan.amount, "Cannot spend required amount of DAI on behalf of caller");

    require(dai.transferFrom(msg.sender, loan.lender, loan.amount), "Could not transfer tokens to the lender");
    loan.status = LoanStatuses.Paid;
  }

}