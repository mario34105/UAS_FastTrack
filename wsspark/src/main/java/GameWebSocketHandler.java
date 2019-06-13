import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.json.JSONObject;

@WebSocket
public class GameWebSocketHandler {
    private String sender, msg;

    @OnWebSocketConnect
    public void onConnect(Session user) throws Exception {
        Character player = '#';
        if (!Chat.playerXJoined()) {
            player = 'X';
        } else if (!Chat.playerOJoined()) {
            player = 'O';
        }
        Chat.playerMap.put(user, player);

        JSONObject json = new JSONObject()
                .put("player", player);
        user.getRemote().sendString(String.valueOf(json));
    }

    @OnWebSocketClose
    public void onClose(Session user, int statusCode, String reason) {
        Chat.playerMap.remove(user);
        try {
            user.getRemote().sendString("");
        } catch (Exception e) { }
    }

    @OnWebSocketMessage
    public void onMessage(Session user, String message) {
        //String username = Chat.userUserNameMap.get(user);
        //Chat.broadcastMessage(username, message);
    }
}
