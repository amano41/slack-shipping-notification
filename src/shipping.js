function notifyShipping() {
  
  var properties = PropertiesService.getScriptProperties().getProperties();
  var query = properties.SEARCH_QUERY;
  var amazon = /ship-confirm@amazon.co.jp/;
  
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
  
  return {
    "title" : title,
    "title_link" : link,
    "fields" : [
      createField("配達予定日", date, false),
      createField("配送業者", carrier, false),
      createField("伝票番号", slipNumber, false),
      createField("注文内容", orderDetail, false)
    ]
  };

}
          
          
function createField(title, value, short) {
  
  return {
    "title" : title,
    "value" : value,
    "short" : short
  };
  
}
