import React, { Component, useEffect, useState } from "react";
import socket from "./www/socket";
import Login from "./screens/Login";
import Chat from "./screens/Chat";
import Chats from "./screens/Chats";
import SocketEvents from "./events/constants";

const Main = () => {
  const [loggedInUser, setLoggedInUser] = useState({});
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadWidth, setLoadWidth] = useState("w-32");
  const [isConnected, setIsConnected] = useState(false);

  const userExists = () => {
    const token = localStorage.getItem("token");
    if (token) {
      socket.auth = { token };
      socket.connect();
    } else {
      setLoadWidth("w-96");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    userExists();

    socket.on(SocketEvents.CONNECT, () => {
      setIsConnected(true);
    });

    socket.on(SocketEvents.DISCONNECT, () => {
      setIsConnected(false);
    });

    socket.on(SocketEvents.CONNECT_ERROR, function (err) {
      setIsConnected(false);
    });

    socket.on(SocketEvents.SESSION, ({ token, userId, username, image }) => {
      socket.auth = { token };
      localStorage.setItem("token", token);
      setLoadWidth("w-96");
      setIsLoading(false);
      setLoggedInUser({ userId, username, image });
    });

    socket.on(SocketEvents.USERS, ({ users, groups, friendRequests }) => {
      setUsers(users);
      setGroups(groups);
      setFriendRequests(friendRequests);
      setLoadWidth("w-64");
    });

    return () => {
      socket.off(SocketEvents.CONNECT);
      socket.off(SocketEvents.DISCONNECT);
      socket.off(SocketEvents.CONNECT_ERROR);
      socket.off(SocketEvents.SESSION);
      socket.off(SocketEvents.USERS);
    };
  }, []);

  const onLoginSuccess = (response) => {
    const { profileObj, tokenId } = response;
    socket.auth = { user: profileObj, tokenId };
    socket.connect();
  };

  const onLoginFailure = () => {
    console.log("Login Failed!");
  };

  return (
    <main>
      {loggedInUser.userId && (
        <Chats
          user={loggedInUser}
          users={users}
          groups={groups}
          friendRequests={friendRequests}
          isConnected={isConnected}
        />
      )}
      {!loggedInUser.userId && (
        <Login
          onSuccess={(response) => onLoginSuccess(response)}
          onFailure={() => onLoginFailure()}
          isLoading={isLoading}
          LoadWidth={loadWidth}
        />
      )}
    </main>
  );
};

export default Main;
