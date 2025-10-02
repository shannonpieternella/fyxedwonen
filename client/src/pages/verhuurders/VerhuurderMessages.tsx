import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API_BASE_URL } from '../../services/api';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px 0;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #38b6ff 0%, #2196f3 100%);
  color: white;
  padding: 30px 0;
  text-align: center;
  margin-bottom: 30px;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const HeaderSubtitle = styled.p`
  opacity: 0.9;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (max-width: 768px) {
    padding: 0 15px;
    gap: 15px;
  }
`;

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #5a6268;
  }
`;

const ConversationsList = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const ConversationsHeader = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
`;

const ConversationsTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin: 0;
`;

const ConversationItem = styled.div<{ active?: boolean; hasUnread?: boolean }>`
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.active ? '#e3f2fd' : 'white'};
  border-left: 4px solid ${props => props.hasUnread ? '#38b6ff' : 'transparent'};

  &:hover {
    background-color: ${props => props.active ? '#e3f2fd' : '#f8f9fa'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ConversationTitle = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
  font-size: 0.95rem;
`;

const ConversationPreview = styled.div`
  color: #666;
  font-size: 0.85rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ConversationMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const ConversationDate = styled.div`
  color: #999;
  font-size: 0.8rem;
`;

const UnreadBadge = styled.div`
  background: #38b6ff;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: auto;
`;

const ChatArea = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 600px;

  @media (max-width: 768px) {
    height: 500px;
  }
`;

const ChatHeader = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
  border-radius: 10px 10px 0 0;
`;

const ChatTitle = styled.h3`
  color: #333;
  margin: 0 0 5px 0;
  font-size: 1.1rem;
`;

const ChatSubtitle = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  max-width: 70%;
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  background: ${props => props.isOwn ? '#38b6ff' : '#f0f0f0'};
  color: ${props => props.isOwn ? 'white' : '#333'};
  padding: 12px 16px;
  border-radius: ${props => props.isOwn ? '20px 20px 5px 20px' : '20px 20px 20px 5px'};
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;

  @media (max-width: 768px) {
    max-width: 85%;
    font-size: 0.85rem;
    padding: 10px 14px;
  }
`;

const MessageTime = styled.div<{ isOwn: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.isOwn ? 'rgba(255,255,255,0.8)' : '#999'};
  margin-top: 5px;
  text-align: ${props => props.isOwn ? 'right' : 'left'};
`;

const ReplyArea = styled.div`
  padding: 20px;
  border-top: 1px solid #eee;
`;

const ReplyForm = styled.form`
  display: flex;
  gap: 10px;
`;

const ReplyInput = styled.textarea`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  resize: none;
  font-family: inherit;
  font-size: 0.9rem;
  min-height: 40px;
  max-height: 100px;

  &:focus {
    outline: none;
    border-color: #38b6ff;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 10px;
  }
`;

const SendButton = styled.button`
  background: #38b6ff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #2196f3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.85rem;
  }
`;


const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;


interface Conversation {
  _id: string;
  lastMessage: {
    _id: string;
    propertyTitle: string;
    userName: string;
    message: string;
    senderType: 'user' | 'verhuurder';
    createdAt: string;
  };
  totalMessages: number;
  unreadCount: number;
}

interface Message {
  _id: string;
  message: string;
  senderType: 'user' | 'verhuurder';
  userName: string;
  verhuurderName: string;
  createdAt: string;
}

const VerhuurderMessages: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const verhuurderEmail = localStorage.getItem('verhuurderEmail');
  const verhuurderName = localStorage.getItem('verhuurderName') || 'Je';

  useEffect(() => {
    if (!verhuurderEmail) {
      navigate('/verhuurders/login');
      return;
    }

    fetchConversations();
  }, [verhuurderEmail, navigate]);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/verhuurder/${verhuurderEmail}`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversation/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);

        // Mark messages as read
        await fetch(`${API_BASE_URL}/messages/conversation/${conversationId}/read`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ readerType: 'verhuurder' })
        });

        // Update conversation list to reflect read status
        fetchConversations();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId);
    fetchMessages(conversationId);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyText.trim() || !selectedConversation || sending) {
      return;
    }

    setSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/messages/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation,
          message: replyText,
          senderType: 'verhuurder',
          senderEmail: verhuurderEmail,
          senderName: verhuurderName
        })
      });

      if (response.ok) {
        setReplyText('');
        fetchMessages(selectedConversation);
        fetchConversations();
      } else {
        alert('Er ging iets mis bij het versturen van je bericht.');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Er ging iets mis bij het versturen van je bericht.');
    } finally {
      setSending(false);
    }
  };

  const selectedConversationData = conversations.find(c => c._id === selectedConversation);

  if (loading) {
    return (
      <Container>
        <ContentContainer>
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2>Berichten laden...</h2>
          </div>
        </ContentContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Mijn Berichten</HeaderTitle>
        <HeaderSubtitle>Communiceer veilig met huurders</HeaderSubtitle>
      </Header>

      <ContentContainer>
        <div style={{ gridColumn: '1 / -1' }}>
          <BackButton onClick={() => navigate('/verhuurders/dashboard')}>
            ← Terug naar Dashboard
          </BackButton>
        </div>

        <ConversationsList>
          <ConversationsHeader>
            <ConversationsTitle>Conversaties ({conversations.length})</ConversationsTitle>
          </ConversationsHeader>

          {conversations.length > 0 ? (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                active={selectedConversation === conversation._id}
                hasUnread={conversation.unreadCount > 0}
                onClick={() => handleConversationClick(conversation._id)}
              >
                <ConversationTitle>{conversation.lastMessage.propertyTitle}</ConversationTitle>
                <ConversationPreview>
                  {conversation.lastMessage.senderType === 'user' ?
                    `${conversation.lastMessage.userName}: ` : 'Je: '
                  }
                  {conversation.lastMessage.message}
                </ConversationPreview>
                <ConversationMeta>
                  <ConversationDate>
                    {new Date(conversation.lastMessage.createdAt).toLocaleDateString('nl-NL')}
                  </ConversationDate>
                  {conversation.unreadCount > 0 && (
                    <UnreadBadge>{conversation.unreadCount}</UnreadBadge>
                  )}
                </ConversationMeta>
              </ConversationItem>
            ))
          ) : (
            <EmptyState>
              <h4>Geen berichten</h4>
              <p>Je hebt nog geen berichten uitgewisseld met huurders.</p>
            </EmptyState>
          )}
        </ConversationsList>

        <ChatArea>
          {selectedConversationData ? (
            <>
              <ChatHeader>
                <ChatTitle>{selectedConversationData.lastMessage.propertyTitle}</ChatTitle>
                <ChatSubtitle>
                  Conversatie met {selectedConversationData.lastMessage.userName}
                </ChatSubtitle>
              </ChatHeader>

              <MessagesArea>
                {messages.map((message) => (
                  <MessageBubble key={message._id} isOwn={message.senderType === 'verhuurder'}>
                    {message.message}
                    <MessageTime isOwn={message.senderType === 'verhuurder'}>
                      {new Date(message.createdAt).toLocaleString('nl-NL', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </MessageTime>
                  </MessageBubble>
                ))}
              </MessagesArea>

              <ReplyArea>
                <ReplyForm onSubmit={handleSendReply}>
                  <ReplyInput
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Typ je bericht..."
                    disabled={sending}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply(e);
                      }
                    }}
                  />
                  <SendButton type="submit" disabled={!replyText.trim() || sending}>
                    {sending ? 'Verzenden...' : 'Verzend'}
                  </SendButton>
                </ReplyForm>
              </ReplyArea>
            </>
          ) : (
            <EmptyState>
              <h4>Selecteer een conversatie</h4>
              <p>Kies een conversatie aan de linkerkant om berichten te bekijken.</p>
            </EmptyState>
          )}
        </ChatArea>
      </ContentContainer>
    </Container>
  );
};

export default VerhuurderMessages;
