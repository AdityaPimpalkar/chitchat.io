import React, { Component } from "react";
import socket from "./../www/socket";
import DirectMessage from "./DirectMessage";
import GroupMessage from "./GroupMessage";
import FindFriends from "./FindFriends";
import ChatContainer from "../layouts/ChatContainer";
import Navigation from "../layouts/Navigation";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket,
      user: this.props.user,
      users: this.props.users,
      groups: this.props.groups,
      directMessage: true,
      group: false,
      friends: false,
    };
  }

  toggleChats = () => {
    this.setState({ directMessage: true, group: false, friends: false });
  };

  toggleGroups = () => {
    this.setState({ directMessage: false, group: true, friends: false });
  };

  toggleFriends = () => {
    this.setState({ directMessage: false, group: false, friends: true });
  };

  render() {
    const { user, users, groups, directMessage, group, friends } = this.state;
    return (
      <ChatContainer>
        <Navigation
          user={user}
          toggleChats={this.toggleChats}
          toggleGroups={this.toggleGroups}
          toggleFriends={this.toggleFriends}
          directMessage={directMessage}
          group={group}
          friends={friends}
        />
        {directMessage && <DirectMessage user={user} users={users} />}
        {group && <GroupMessage user={user} users={users} groups={groups} />}
        {friends && <FindFriends />}
      </ChatContainer>
    );
  }
}

export default Chat;
