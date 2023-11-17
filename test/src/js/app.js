// App object
App = {
  //object member variables
  web3Provider: null,//store web3 reference
  contracts: {},//instantiate an empty object
  account: null, //account of wallet
  /*
  init :  1.Setup web3 provider, 
          2.Load contracts,
          3,Binds events to html components
  */
  init: async () => {
    // Initialize web3 and set the provider to the testRPC.
    if (!typeof web3 !== 'undefined') {
      App.web3Provider = window.ethereum;
      web3 = new Web3(window.ethereum);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
      web3 = new Web3(App.web3Provider);
    }
    //Next, we load the contracts
    await App.initContract();
    //Load account details
    await App.getAccountDetails();
    //Bind the DOM components
    // await App.bindEvents();
  },
  /*
  initContract: Load the contract details
  */
  initContract: async () => {
    data = await $.getJSON('Creature.json')
    // Get the necessary contract artifact file and instantiate it with truffle-contract.
    App.contracts.MyToken = TruffleContract(data);

    // Set the provider for our contract.
    App.contracts.MyToken.setProvider(App.web3Provider);
  },
  bindEvents: () => {
    // $(document).on('click', '#transferButton', App.handleTransfer);
    // $(document).on('click', '#mintButton', App.handleMint);
  },
  handleTransfer: (event) => {
    event.preventDefault();
    //Retrieve the values from the input box
    // var amount = parseInt($('#MyTokenTransferAmount').val());
    // var toAddress = $('#MyTokenTransferAddress').val();

    // console.log('Transfer ' + amount + ' TT to ' + toAddress);

    //call the contract transfer method to execute the transfer
    // App.tokenInstance.transfer(toAddress, amount, { from: App.account, gas: 100000 })
    //   .then(function (result) {
    //     $('#message').text(`Success : Transferred ${amount}`);
    //     $('#exampleModal').modal('show');
    //     return App.getBalances();
    //   }).catch(function (err) {
    //     console.log(err.message);
    //   });
  },
  getAccountDetails: async () => {
    /*Retrieve all the accounts that is currently connected
  to the blockchain*/
    web3.eth.getAccounts(async (error, accounts) => {
      if (error) console.log(error);
      //Use the first account
      App.account = accounts[0];
      //Display the wallet address in the place holder
      $('#MyTokenWallet').text(App.account)
      //Get the deployed contract
      myTokenInstance = await App.contracts.MyToken.deployed();
      console.log(myTokenInstance);
      // Get Account Balance
      result = await myTokenInstance.balanceOf(App.account);
      balance = result.toNumber();
      console.log(result);
      // Display number of token
      $('#MyTokenBalance').text(balance);
      // Get 3 letters symbol
      let symbol = await myTokenInstance.symbol();
      // Display symbol, example "TKH"
      $('#MyTokenSymbol').text(symbol);
      // Get Total Supply of this NFT
      let totalSupply = await myTokenInstance.totalSupply();
      // Set isOwner to false by default
      let isOwner = false;
      // Declare a string variable
      var membership_html = ""
      // Loop through the total supply of this NFT to check
      // any of the NFT owned by this account 
      for(let i=1; i <= totalSupply.toNumber(); i++){
        console.log("checking --- ")
        // Get current Owner account
        var owner = await myTokenInstance.ownerOf(i);
        // If owner of NFT matched, create a card and append to the membership_html
        if(owner==App.account){
          var tokenuri = await myTokenInstance.tokenURI(i);
          var response = await fetch(tokenuri)
          var data = await response.json();
          //console.log(data);
          membership_html += '<div class="card" style="margin: 20px;"><img id="MyTokenImage" class="card-img-top mx-auto d-block" src="';
          membership_html += data.image;
          membership_html +='" alt="Card image" style="width: 60%;"><div class="card-body" style="text-align:center;"><h4 class="card-title" id="tid">';
          membership_html += '#' + i + '</h4></div></div>';
          // Set the current account owns a NFT
          isOwner = true;          
        }
      }
      // If current account owns a NFT, display the membership_html
      if(isOwner){
        $('#membership').html(membership_html);
      }else{ // else display the following message
        $('#membership').html("Sorry, no membership found.");
      }
    })
  },
  // getBalances: async () => {
  //   result = await App.tokenInstance.balanceOf(App.account);
  //   balance = result.toNumber();
  //   $('#MyTokenBalance').text(balance);

  //   count = await App.tokenInstance.totalSupply()
  //   result = "NOT OWNER"

  //   owner = await App.tokenInstance.owner();
  //   if (owner == App.account) {
  //     result = "IS OWNER"
  //     $('#mintToken').removeClass("d-none")
  //   }
  //   $('#MyTokenOwner').text(result);
  // },
}
// Web page loaded event handler
$(() => {
  $(window).load(function () {
    App.init();
  });
});