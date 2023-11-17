// App object
App = {
  
    web3Provider: null,//store web3 reference
    contracts:{},//instantiate an empty object
    /*
    init :  1.Setup web3 provider,
            2.Load contracts,
            3,Binds events to html components
    */
    init: (x) => {

      // A Web3Provider wraps a standard Web3 provider, which is
      // what MetaMask injects as window.ethereum into each page
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // const [errorMessage, setErrorMessage] = [null,null];
      // const [defaultAccount, setDefaultAccount] = [null,null];
      // const [userBalance, setUserBalance] = [null,null];
      // const connectwalletHandler = () => {
      //     if (window.Ethereum) {
      //         provider.send("eth_requestAccounts", []).then(async () => {
      //             await accountChangedHandler(provider.getSigner());
      //         })
      //     } else {
      //         setErrorMessage("Please Install Metamask!!!");
      //     }
      // }
      // const accountChangedHandler = async (newAccount) => {
      //     const address = await newAccount.getAddress();
      //     setDefaultAccount(address);
      //     const balance = await newAccount.getBalance()
      //     setUserBalance(ethers.utils.formatEther(balance));
      //     await getuserBalance(address)
      // }
      // const getuserBalance = async (address) => {
      //     const balance = await provider.getBalance(address, "latest")
      // }

      let account = undefined;

      //Initialize web3 and set the provider to the testRPC.
      async function connectWallet(){

      //     // MetaMask requires requesting permission to connect users accounts
          const data = await provider.send("eth_requestAccounts", []);

      //     // The MetaMask plugin also allows signing transactions to
      //     // send ether and pay to change state within the blockchain.
      //     // For this, you need the account signer...
          const signer = provider.getSigner()
          
          account = data[0];

          $('#MyTokenWallet').text(account);
          
          console.log(account) // at this point you have something in.
          return true
      }

      connectWallet();
      
            
      if (!typeof web3 !== 'undefined') {
        App.web3Provider = window.ethereum;
        web3 = new Web3(window.ethereum);

        console.log(App.web3Provider)
      } else {
        // set the provider you want from Web3.providers
        App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
        web3 = new Web3(App.web3Provider);
      }
      // App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
      // web3 = new Web3(App.web3Provider);
      // //Next, we load the contracts
      // return App.initContract();
      //Next, we load the contracts
      
      return App.initContract(x);
      
      
    },
    initContract: (x) => {

      console.log(x);
      var jsonFile;
      switch (x) {
        case "1":
          jsonFile = "Creature1.json";
          break;
        case "2":
          jsonFile = "Creature2.json";
          break;
        case "3":
          jsonFile = "Creature3.json";
          break;
        case "4":
          jsonFile = "Creature4.json";
          break;
        case "5":
          jsonFile = "Creature5.json";
          break;
        case "6":
          jsonFile = "Creature6.json";
          break;
        case "7":
          jsonFile = "Creature7.json";
          break;
        case "8":
          jsonFile = "Creature8.json";
          break;
        default:
          jsonFile = "Creature1.json";
      }
      console.log(jsonFile);
      $.getJSON("scjson/"+jsonFile, function (data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract.
        console.log(data);
        var MyTokenArtifact = data;
        
        App.contracts.MyToken = TruffleContract(MyTokenArtifact);
  
        // Set the provider for our contract.
        App.contracts.MyToken.setProvider(App.web3Provider);

        // Use our contract to retieve and mark the adopted pets.
        return App.getBalances(x);
      });
      //Next, we bind the event handlers of html components
      // return App.bindEvents();
    },  
    getBalances: (x) => {
      var myTokenInstance;
  /*Retrieve all the accounts that is currently connected
    to the blockchain*/
    // async function fetch_tokenuri(url){
    //   const response = await fetch(url);
    //   return response.json();
    // }

    web3.eth.getAccounts(async (error, accounts) => {
      if (error) console.log(error);

      //Use the first account
      var account = accounts[0];

      if(x!="0"){

        //Test
        myTokenInstance = await App.contracts.MyToken.deployed();
        console.log(myTokenInstance)
        result = await myTokenInstance.balanceOf(account);
        console.log(result)
        balance = result.words[0];
        let contractAddress = myTokenInstance.address;
        console.log(contractAddress);
        
        $('#MyTokenBalance').text(balance);

        let symbol = await myTokenInstance.symbol();
        $('#MyTokenSymbol').text(symbol);
        // let tokenURI = await myTokenInstance.tokenURI();
        let totalSupply = await myTokenInstance.totalSupply();
        // console.log(totalSupply.c[0])
        // let myTokenURI = await myTokenInstances.tokenURI(1)
        let isOwner = false;

        // console.log(typeof totalSupply.c[0]== 'number' && totalSupply.c[0]%1== 0)
        var ticket_html = "";
        $('#loading').show();
        for(let i=1; i <= totalSupply.words[0]; i++){
          console.log("checking --- ")
          var owner = await myTokenInstance.ownerOf(i);
          if(owner==account){
            var tokenuri = await myTokenInstance.tokenURI(i);
            var response = await fetch(tokenuri)
            var data = await response.json();
            //console.log(data);
            ticket_html += '<div class="card" style="margin: 20px;"><a class="modal_link" id="nftImg'+i+'" href="#" data-bs-toggle="modal" data-bs-target="#modalCenter" ><img id="MyTokenImage" class="card-img-top mx-auto d-block" src="';
            ticket_html += data.image;
            ticket_html +='" alt="Card image" style="width: 60%;"></a><div class="card-body" style="text-align:center;"><h4 class="card-title" id="tid'+i+'">';
            ticket_html += '#' + i + '</h4></div></div>';

            isOwner = true;

            
            // console.log(tokenuri)
            
            
          }
          
        }
        $('#loading').hide();
        if(isOwner){
          $('#ticket').html(ticket_html);
          $(".modal_link").on("click", function(e) {
            e.preventDefault();
            console.log("click");
            var imgId = $(this).attr('id');
            
            var qrText = contractAddress + "/" + imgId.slice(6) + "/" + account;
            $("#qrcode").html("");
            var qrcode = new QRCode(document.getElementById("qrcode"), {
              width : 250,
              height : 250
            });
            qrcode.makeCode(qrText);
            $("#modalCenter").modal("show");
            $("button.close").click(function(){
              $("#modalCenter").modal("hide");
            })
        });
        }else{
          $('#ticket').html("Sorry, no tickets found.");
        }
      }
      
      // if(isOwner){
      //   $('#ownership i:first-child').addClass('active').siblings().removeClass('active');
      // }else{
      //   $('#ownership i:last-child').addClass('active').siblings().removeClass('active');
      // }

      // console.log(totalSupply.c[0]);

      // let desc = await myTokenInstance.description();
      // $('#MyTokenDescription').html(desc);

      // let imgURL = await myTokenInstance.imgURL();
      // $('#MyTokenImage').attr("src", imgURL).width("60%");;



      // if (error) console.log(error);
      // //Use the first account
      // var account = accounts[0];
      // //Display the wallet address in the place holder
      // $('#MyTokenWallet').text(account)
      // //Get the reference of the deployed token in the blockchain
      // App.contracts.MyToken.deployed().then((instance) => {
      //   myTokenInstance = instance;
      //   //call the balanceOf the token of an account
      //   return myTokenInstance.balanceOf(account);
      // }).then((result) => {
      //   balance = result.c[0];
      //   //Display the balance in the place holder
      //   $('#MyTokenBalance').text(balance);
      // }).catch((err) => {
      //   console.log(err.message);
      // });
    });
  
    }
};
// Web page loaded event handler
$(() => {
  $(window).load(function () {
    App.init(0);
  });
  $("#getTicket").change(function () {
      var v = this.value;
      App.init(v);
  });

  
    
});

