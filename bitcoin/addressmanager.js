// var Client = require('bitcore-wallet-client');
// var BWS_INSTANCE_URL = 'http://localhost:3232/bws/api'
//
// var AmbrosiaClient = new Client({
//   baseUrl: BWS_INSTANCE_URL,
//   verbose: false,
// });
// //TODO read BIP32
// AmbrosiaClient.createWallet("My Wallet", "Thibaut", 1, 1, {network: 'testnet'}, function(err, wallet) {
//   // Handle err
//   console.log('Wallet Created: ' + wallet);
// });
//
// export default AmbrosiaClient;

import Bitcore from 'bitcore';
import Mnemonic from 'bitcore-mnemonic';

var Address = Bitcore.address;
var code = new Mnemonic();
var xpriv = code.toHDPrivateKey('Love is the answer', 'testnet');

/**
 * EstAmbrosiaBitcoinAccount following BIP44 rules (m / purpose' / coin_type' / account' / chain / address_index)
 * @param  {[string]} "m/44'/0'/0'/0" ['44 for BIP44', '0 = Bitcoin', '0= AmbrosiaAccount', '0=external chain (public addresses) 1=internal chain (change or private address)']
 * @return {[object]}                 [extended private key object]
 */
var XprivExtAmbrosiaBitcoin = xpriv.derive("m/44'/0'/0'/0");
/**
 * EstAmbrosiaBitcoinAccount following BIP44 rules (m / purpose' / coin_type' / account' / chain / address_index)
 * @param  {[string]} "m/44'/0'/0'/1" ['44 for BIP44', '0 = Bitcoin', '0= AmbrosiaAccount', '0=external chain (public addresses) 1=internal chain (change or private address)']
 * @return {[object]}                 [extended private key object]
 */
var XprivIntAmbrosiaBitcoin = xpriv.derive("m/44'/0'/0'/1");

export var XpubExtAmbrosiaBitcoin = XprivExtAmbrosiaBitcoin.hdPublicKey;
export var XpubIntAmbrosiaBitcoin = XprivExtAmbrosiaBitcoin.hdPublicKey;

//Those index variables shall be hard backed
var ExtChainIndex = 0;
var IntChainIndex = 0;

export var getExtAddress = () => {
  var address = new Address(XpubExtAmbrosiaBitcoin.derive(ExtChainIndex).publicKey, 'testnet');
  ExtChainIndex++;
  return address;
};

export var getIntAddress = () => {
  var address = new Address(XpubIntAmbrosiaBitcoin.derive(IntChainIndex).publicKey, 'testnet');
  IntChainIndex++;
  return address;
};
