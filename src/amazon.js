const amazon = {

  postNotification: function(subject, body) {

    var link = this.getTrackingURL(body);
    var date = this.getDeliveryDate(body);
    var carrier = this.getCarrier(body);
    var slipNumber = this.getSlipNumber(body);
    var orderDetail = this.getOrderDetail(body);

    var text = createNotification(subject, link, date, carrier, slipNumber, orderDetail);
    postNotification([text]);
  },

  getOrderNumber: function(message) {
    var regexp = /注文番号 ([-0-9]+)/;
    return parseMessage(message, regexp);
  },

  getTrackingURL: function(message) {
    var regexp = /配送状況は.+\s+(https:\/\/.+)\s+/;
    return parseMessage(message, regexp, "http://www.amazon.co.jp");
  },

  getDeliveryDate: function(message) {
    var regexp = /お届け予定： (.)曜日, ([0-1][0-9]\/[0-3][0-9])/;
    return parseMessage(message, regexp, "---", m => m[2] + "（" + m[1] + "）");
  },

  getCarrier: function(message) {
    var regexp = /お客様の商品は(.+)でお届けいたします。/;
    return parseMessage(message, regexp);
  },

  getSlipNumber: function(message) {
    var regexp = /お問い合わせ伝票番号は([A-Z0-9]+)です。/;
    return parseMessage(message, regexp);
  },

  getOrderDetail: function(message) {
    var regexp = /購入明細書：\s+([\s\S]+合計：.+)/;
    return parseMessage(message, regexp);
  }
}
