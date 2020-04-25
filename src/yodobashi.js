const yodobashi = {

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
    var regexp = /【ご注文番号】 ([-0-9]+)/;
    return parseMessage(message, regexp);
  },

  getTrackingURL: function(message) {
    var regexp = /(https?:\/\/.+)/;
    return parseMessage(message, regexp, "https://www.yodobashi.com");
  },

  getDeliveryDate: function(message) {
    return "---";
  },

  getCarrier: function(message) {
    var regexp = /今回の配達：(.+)/;
    return parseMessage(message, regexp);
  },

  getSlipNumber: function(message) {
    var regexp = /配達受付番号（伝票番号）：([0-9]+)/;
    return parseMessage(message, regexp);
  },

  getOrderDetail: function(message) {
    var regexp = /【今回出荷の商品】\s+-+\s+([^【]+円)\s+【/;
    return parseMessage(message, regexp);
  }
}
