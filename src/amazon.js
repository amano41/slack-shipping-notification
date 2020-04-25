function postAmazonNotification(subject, body) {

  var link = getTrackingURL(body);
  var date = getDeliveryDate(body);
  var carrier = getCarrier(body);
  var slipNumber = getSlipNumber(body);
  var orderDetail = getOrderDetail(body);

  var text = createNotification(subject, link, date, carrier, slipNumber, orderDetail);
  postNotification([text]);
}


function getOrderNumber(message) {
  var regexp = /注文番号 ([-0-9]+)/;
  var result = message.match(regexp);
  if (result == null) {
    return "---";
  }
  return result[1];
}


function getDeliveryDate(message) {
  var regexp = /お届け予定： (.)曜日, ([0-1][0-9]\/[0-3][0-9])/;
  var result = message.match(regexp);
  if (result == null) {
    return "---";
  }
  return result[2] + "（" + result[1] + "）";
}


function getTrackingURL(message) {
  var regexp = /配送状況は.+\s+(https:\/\/.+)\s+/;
  var result = message.match(regexp);
  if (result == null) {
    return "http://www.amazon.co.jp";
  }
  return result[1];
}


function getCarrier(message) {
  var regexp = /お客様の商品は(.+)でお届けいたします。/;
  var result = message.match(regexp);
  if (result == null) {
    return "---";
  }
  return result[1];
}


function getSlipNumber(message) {
  var regexp = /お問い合わせ伝票番号は([A-Z0-9]+)です。/;
  var result = message.match(regexp);
  if (result == null) {
    return "---";
  }
  return result[1];
}


function getOrderDetail(message) {
  var regexp = /購入明細書：\s+([\s\S]+合計：.+)/;
  var result = message.match(regexp);
  if (result == null) {
    return "---";
  }
  return result[1];
}
