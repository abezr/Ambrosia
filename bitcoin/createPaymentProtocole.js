/**
 * A Payment Request creator
 * it takes two args
 * the merchant address, bitcoin amounts.
 */
var Bitcore = require('bitcore');
var Script = Bitcore.Script;
var Address = Bitcore.Address;
import AddressManager from './addressmanager';
var AmbrosiaFee = 2/100;
var PaymentProtocol = require('bitcore-payment-protocol');
var now = Date.now() / 1000;


var PaymentDetails = (address, amount) => {
  var merchantAddress = Address.fromString(address);
  var merchantScript = Script.buildPublicKeyHashOut(merchantAddress);
  var ambrosiaAddress = AddressManager.getExtAddress();
  var ambrosiaScript = Script.buildPublicKeyHashOut(ambrosiaAddress);
  var ambrosiaAmount = amount * AmbrosiaFee;
  var merchantAmount = amount - ambrosiaAmount;
  var outputs = [{amount: merchantAmount, script: merchantScript}, {amount: ambrosiaAmount, script: ambrosiaScript}];
  var details = new PaymentProtocol().makePaymentDetails();
  details.set('network', 'test');
  details.set('outputs', outputs);//TODO need to figure out how to make proper ouputs
  details.set('time', now);
  details.set('expires', now + 60 * 60 * 24);
  details.set('memo', 'A payment request from Ambrosia.');
  details.set('payment_url', 'https://localhost/-/pay');
  details.set('merchant_data', new Buffer({size: 7})); // identify the request
  return details;
};

// load the X509 certificate
var certificates = new PaymentProtocol().makeX509Certificates();
certificates.set('certificate', [file_with_x509_der_cert]);

// form the request
var request = new PaymentRequest().makePaymentRequest();
request.set('payment_details_version', 1);
request.set('pki_type', 'x509+sha256');
request.set('pki_data', certificates.serialize());
request.set('serialized_payment_details', details.serialize());
request.sign(file_with_x509_private_key);

// serialize the request
var rawbody = request.serialize();

// Example HTTP Response Headers:
// Content-Type: PaymentProtocol.PAYMENT_REQUEST_CONTENT_TYPE
// Content-Length: request.length
// Content-Transfer-Encoding: 'binary'

// construct the payment details
