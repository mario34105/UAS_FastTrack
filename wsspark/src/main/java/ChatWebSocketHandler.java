import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.json.JSONObject;

@WebSocket
public class ChatWebSocketHandler {
    private String sender, msg;

    @OnWebSocketConnect
    public void onConnect(Session user) throws Exception {
        String username = "User" + Chat.nextUserNumber++;
        Chat.userUserNameMap.put(user, username);
        Chat.broadcastMessage("Server", (username + " joined the chat"));
    }

    @OnWebSocketClose
    public void onClose(Session user, int statusCode, String reason) {
        String username = Chat.userUserNameMap.get(user);
        Chat.userUserNameMap.remove(user);
        Chat.broadcastMessage("Server", (username + " left the chat"));
    }

    @OnWebSocketMessage
    public void onMessage(Session user, String message) {
        String sender = Chat.userUserNameMap.get(user);
        //Chat.broadcastMessage(username, message);
        JSONObject json = new JSONObject(message);
        String kepada = (String)json.get("kepada");
        String pesan = (String)json.get("pesan");
//        Chat.broadcastMessage(nama, pesan);
        Chat.sendMessage(sender, pesan, kepada);
    }
}
