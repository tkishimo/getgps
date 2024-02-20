let trackingInterval;
const userName = window.userInfo.userName;
//const request = require('request');

function startTracking() {
    trackingInterval = setInterval(getLocation, 60000); // 10分ごとにgetLocationを呼ぶ
    getLocation(); // すぐに最初の位置情報を取得する
}

function stopTracking() {
    clearInterval(trackingInterval);
    document.getElementById('locationResult').innerHTML = 'トラッキングが停止しました';
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('locationResult').innerHTML = '位置情報が利用できません';
    }
}

// ユーザーIDを取得する関数（仮の実装）
function getUserId() {
    // 実際のユーザー認証やセッション管理に基づいてユーザーIDを取得する処理を実装
    // 例：CookieやJWTからユーザーIDを取得
    //return "岸本"; // 仮のユーザーID
    return userName;
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const timestamp = new Date(position.timestamp).toLocaleString(); // タイムスタンプを時刻に変換
    document.getElementById('locationResult').innerHTML =
        `緯度: ${latitude}<br>経度: ${longitude}<br>時刻: ${timestamp}<br>User: ${userName}`;
    console.log('send lonlat');
    // ここでサーバーに位置情報を送信する処理を追加できます
    sendLocationToServer(longitude, latitude);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('locationResult').innerHTML = '位置情報の取得が許可されませんでした';
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('locationResult').innerHTML = '位置情報が利用できません';
            break;
        case error.TIMEOUT:
            document.getElementById('locationResult').innerHTML = 'タイムアウトしました';
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('locationResult').innerHTML = '不明なエラーが発生しました';
            break;
    }
}

//const apiEndpoint = 'http://localhost:3001/api/location'; // ご自身のAPIエンドポイントに適したURLに変更してください
const apiEndpoint = 'https://getgps.onrender.com/api/location'; // ご自身のAPIエンドポイントに適したURLに変更してください
function sendLocationToServer(longitude, latitude) {
  const userId = getUserId(); // ユーザーIDを取得
  const queryParams = new URLSearchParams({ userId, longitude, latitude }); // パラメータを追加

  // APIエンドポイントにPOSTリクエストを送信
  fetch(`${apiEndpoint}?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to record location');
    }
  })
  .catch(error => console.error(error));
}

// ページ読み込み時にトラッキングを開始する
document.addEventListener('DOMContentLoaded', startTracking);
