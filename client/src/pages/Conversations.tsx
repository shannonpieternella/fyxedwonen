import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  padding: 30px 0;
  text-align: center;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const HeaderSubtitle = styled.p`
  opacity: 0.9;
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  height: calc(100vh - 140px);
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  box-shadow: 0 2px 20px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
    min-height: calc(100vh - 140px);
  }
`;

const ConversationsList = styled.div`
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
`;

const ConversationsHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
`;

const ConversationsTitle = styled.h3`
  margin: 0;
  color: #1f2937;
  font-size: 1.2rem;
`;

const ConversationItem = styled.div<{ active?: boolean; unread?: boolean }>`
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.active ? '#f0f9ff' : 'white'};
  border-left: ${props => props.active ? '4px solid #1e40af' : '4px solid transparent'};

  &:hover {
    background: #f8fafc;
  }

  ${props => props.unread && `
    background: #fef3f2;
    border-left-color: #ef4444;
  `}
`;

const ConversationProperty = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  font-size: 14px;
`;

const ConversationPartner = styled.div`
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 8px;
`;

const ConversationPreview = styled.div`
  color: #6b7280;
  font-size: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ConversationTime = styled.div`
  color: #9ca3af;
  font-size: 11px;
  margin-top: 4px;
`;

const UnreadBadge = styled.span`
  background: #ef4444;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  margin-left: 8px;
`;

const ChatArea = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChatHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
`;

const ChatPropertyTitle = styled.h3`
  margin: 0 0 4px 0;
  color: #1f2937;
  font-size: 1.1rem;
`;

const ChatPartnerName = styled.div`
  color: #6b7280;
  font-size: 14px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const MessageGroup = styled.div<{ isOwn: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  margin-bottom: 16px;
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  background: ${props => props.isOwn ? '#1e40af' : '#f3f4f6'};
  color: ${props => props.isOwn ? 'white' : '#1f2937'};
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  margin-bottom: 4px;
`;

const MessageTime = styled.div<{ isOwn: boolean }>`
  font-size: 11px;
  color: #9ca3af;
  margin: 0 ${props => props.isOwn ? '8px' : '8px'} 0 ${props => props.isOwn ? '8px' : '8px'};
`;

const MessageInput = styled.div`
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background: white;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const TextArea = styled.textarea`
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  padding: 12px 16px;
  resize: none;
  min-height: 40px;
  max-height: 120px;
  font-family: inherit;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #1e40af;
  }
`;

const SendButton = styled.button`
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #1d4ed8;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  text-align: center;
  padding: 40px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

interface Message {
  _id: string;
  message: string;
  senderType: 'user' | 'verhuurder';
  createdAt: string;
  readBy: {
    user: boolean;
    verhuurder: boolean;
  };
}

interface Conversation {
  _id: string;
  lastMessage: {
    propertyTitle: string;
    verhuurderName: string;
    userName: string;
    message: string;
    createdAt: string;
    senderType: 'user' | 'verhuurder';
  };
  property: {
    _id: string;
    title: string;
    images: string[];
  };
  unreadCount: number;
}

const Conversations: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userType, setUserType] = useState<'user' | 'verhuurder'>('user');

  useEffect(() => {
    determineUserType();
    loadConversations();
  }, []);

  const determineUserType = () => {
    const verhuurderLoggedIn = localStorage.getItem('verhuurderLoggedIn') === 'true';
    const userLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (verhuurderLoggedIn) {
      setUserType('verhuurder');
    } else if (userLoggedIn) {
      setUserType('user');
    }
  };

  const loadConversations = async () => {
    try {
      setLoading(true);

      let endpoint = '';
      if (userType === 'verhuurder') {
        const verhuurderEmail = localStorage.getItem('verhuurderEmail');
        endpoint = `http://localhost:5001/api/messages/verhuurder/${verhuurderEmail}`;
      } else {
        const userEmail = localStorage.getItem('userEmail');
        endpoint = `http://localhost:5001/api/messages/user/${userEmail}`;
      }

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/messages/conversation/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);

        // Mark messages as read
        await markAsRead(conversationId);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markAsRead = async (conversationId: string) => {
    try {
      await fetch(`http://localhost:5001/api/messages/conversation/${conversationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          readerType: userType
        })
      });

      // Update local state to remove unread count
      setConversations(prev =>
        prev.map(conv =>
          conv._id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || sending) return;

    try {
      setSending(true);

      const senderEmail = userType === 'verhuurder'
        ? localStorage.getItem('verhuurderEmail')
        : localStorage.getItem('userEmail');
      const senderName = userType === 'verhuurder'
        ? localStorage.getItem('verhuurderName') || 'Verhuurder'
        : localStorage.getItem('userName') || 'Huurder';

      const activeConv = conversations.find(c => c._id === activeConversation);
      if (!activeConv) return;

      const response = await fetch('http://localhost:5001/api/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: activeConversation,
          message: newMessage,
          senderType: userType,
          senderEmail,
          senderName
        })
      });

      if (response.ok) {
        setNewMessage('');
        loadMessages(activeConversation);
        loadConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    setActiveConversation(conversationId);
    loadMessages(conversationId);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Gisteren';
    } else {
      return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
    }
  };

  const activeConv = conversations.find(c => c._id === activeConversation);

  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderTitle>Berichten</HeaderTitle>
          <HeaderSubtitle>Je conversaties</HeaderSubtitle>
        </Header>
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
          Berichten laden...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Berichten</HeaderTitle>
        <HeaderSubtitle>
          {conversations.length === 0
            ? 'Geen berichten'
            : `${conversations.length} ${conversations.length === 1 ? 'conversatie' : 'conversaties'}`
          }
        </HeaderSubtitle>
      </Header>

      <MainLayout>
        <ConversationsList>
          <ConversationsHeader>
            <ConversationsTitle>Conversaties</ConversationsTitle>
          </ConversationsHeader>

          {conversations.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>💬</div>
              <div>Geen berichten gevonden</div>
            </div>
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                active={activeConversation === conversation._id}
                unread={conversation.unreadCount > 0}
                onClick={() => handleConversationClick(conversation._id)}
              >
                <ConversationProperty>
                  {conversation.lastMessage.propertyTitle}
                  {conversation.unreadCount > 0 && (
                    <UnreadBadge>{conversation.unreadCount}</UnreadBadge>
                  )}
                </ConversationProperty>
                <ConversationPartner>
                  {userType === 'verhuurder'
                    ? conversation.lastMessage.userName
                    : conversation.lastMessage.verhuurderName}
                </ConversationPartner>
                <ConversationPreview>
                  {conversation.lastMessage.message}
                </ConversationPreview>
                <ConversationTime>
                  {formatTime(conversation.lastMessage.createdAt)}
                </ConversationTime>
              </ConversationItem>
            ))
          )}
        </ConversationsList>

        <ChatArea>
          {activeConv ? (
            <>
              <ChatHeader>
                <ChatPropertyTitle>{activeConv.lastMessage.propertyTitle}</ChatPropertyTitle>
                <ChatPartnerName>
                  Met: {userType === 'verhuurder'
                    ? activeConv.lastMessage.userName
                    : activeConv.lastMessage.verhuurderName}
                </ChatPartnerName>
              </ChatHeader>

              <MessagesContainer>
                {messages.map((message) => (
                  <MessageGroup key={message._id} isOwn={message.senderType === userType}>
                    <MessageBubble isOwn={message.senderType === userType}>
                      {message.message}
                    </MessageBubble>
                    <MessageTime isOwn={message.senderType === userType}>
                      {formatTime(message.createdAt)}
                    </MessageTime>
                  </MessageGroup>
                ))}
              </MessagesContainer>

              <MessageInput>
                <InputContainer>
                  <TextArea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Typ je bericht..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <SendButton
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                  >
                    ➤
                  </SendButton>
                </InputContainer>
              </MessageInput>
            </>
          ) : (
            <EmptyState>
              <EmptyIcon>💬</EmptyIcon>
              <div>Selecteer een conversatie om berichten te bekijken</div>
            </EmptyState>
          )}
        </ChatArea>
      </MainLayout>
    </Container>
  );
};

export default Conversations;