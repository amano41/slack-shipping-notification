function main() {

  var properties = PropertiesService.getScriptProperties().getProperties();
  var query = properties.SEARCH_QUERY;
  var amazon = /amazon.co.jp/;

  var threads = GmailApp.search(query);

  for (var i in threads) {

    var thread = threads[i];
    var messages = thread.getMessages();

    // スレッド内のメッセージを 1 件ずつ処理
    for (var j in messages) {

      var message = messages[j];

      // 既読ならスキップ
      if (!message.isUnread()) {
        Logger.log("Skipped: " + message.getSubject());
        continue;
      }

      var from = message.getFrom();
      var subject = message.getSubject();
      var body = message.getPlainBody();

      // Amazon.co.jp からの配送
      if (from.match(amazon)) {
        postAmazonNotification(subject, body);
        message.markRead(); // 既読
        message.refresh();  // 既読を反映
        continue;
      }

    }

    // スレッドを最新の状態に更新
    // これを実行しないと既読が反映されない
    thread.refresh();

    // メッセージがすべて既読ならアーカイブ
    if (!thread.isUnread()) {
      thread.moveToArchive();
    }

  }

}


function postNotification(notifications) {

  var channel = "#general";
  var username = "配達予定";
  var icon_emoji = ":package:";

  postSlackMessage(channel, username, icon_emoji, "", notifications);
}


function createNotification(title, link, date, carrier, slipNumber, orderDetail) {

  const field = (title, value, short) => {
    return {
      "title" : title,
      "value" : value,
      "short" : short
    };
  }

  return {
    "title" : title,
    "title_link" : link,
    "fields" : [
      field("配達予定日", date, false),
      field("配送業者", carrier, false),
      field("伝票番号", slipNumber, false),
      field("注文内容", orderDetail, false)
    ]
  };

}
