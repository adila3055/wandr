// client/src/hooks/useSocket.js

import { useEffect } from "react";
import { connectSocket, disconnectSocket, getSocket } from "../socket/socket";
import useStore from "../store/useStore";

const useSocket = (tripId) => {
  const user = useStore((s) => s.user);
  const {
    addItineraryItem, removeItineraryItem,
    addPackingItem, updatePackingItem, removePackingItem,
    addExpense, removeExpense,
    addVoteItem, updateVoteItem,
    addChatMessage, setOnlineUsers, setMembers,
  } = useStore();

  useEffect(() => {
    if (!tripId || !user) return;

    const socket = connectSocket();

    // Join the trip room
    socket.emit("trip:join", {
      tripId,
      userId: user._id,
      userName: user.name,
    });

    // ─── Event Listeners ─────────────────────────────

    socket.on("itinerary:add", addItineraryItem);
    socket.on("itinerary:remove", removeItineraryItem);

    socket.on("packing:add", addPackingItem);
    socket.on("packing:update", ({ id, ...data }) => updatePackingItem(id, data));
    socket.on("packing:remove", removePackingItem);

    socket.on("expense:add", addExpense);
    socket.on("expense:remove", removeExpense);

    socket.on("vote:add", addVoteItem);
    socket.on("vote:update", ({ id, ...data }) => updateVoteItem(id, data));

    socket.on("chat:message", addChatMessage);

    socket.on("presence:update", setOnlineUsers);
    socket.on("members:update", setMembers);

    return () => {
      socket.off("itinerary:add");
      socket.off("itinerary:remove");
      socket.off("packing:add");
      socket.off("packing:update");
      socket.off("packing:remove");
      socket.off("expense:add");
      socket.off("expense:remove");
      socket.off("vote:add");
      socket.off("vote:update");
      socket.off("chat:message");
      socket.off("presence:update");
      socket.off("members:update");
      disconnectSocket();
    };
  }, [tripId, user]);

  // Return socket so components can emit events
  return getSocket();
};

export default useSocket;