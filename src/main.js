function main() {

  var properties = PropertiesService.getScriptProperties().getProperties();
  var query = properties.SEARCH_QUERY;

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

      // Amazon.co.jp
      if (from.match(/amazon.co.jp/) && subject.match(/発送/)) {
        amazon.postNotification(subject, body);
        markRead(message);
        continue;
      }

      // Yodobashi.com
      if (from.match(/yodobashi.com/) && subject.match(/出荷/)) {
        yodobashi.postNotification(subject, body);
        markRead(message);
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


function markRead(message) {
  message.markRead(); // 既読
  message.refresh();  // 既読を反映
}


function parseMessage(message, regexp, defaultValue = "---", formatter = results => results[1]) {
  var results = message.match(regexp);
  if (results == null) {
    return defaultValue;
  }
  return formatter(results);
}


function postNotification(notifications) {

  var properties = PropertiesService.getScriptProperties().getProperties();
  var url = properties.WEBHOOK_URL;

  var channel = "#general";
  var username = "配達予定";
  var icon_emoji = ":package:";

  Slack.postMessage(url, channel, username, icon_emoji, "", notifications);
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
