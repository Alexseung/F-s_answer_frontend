import React, {useState, useRef, useEffect} from 'react';

export default function () {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{sender: string; content: string}[]>(
    []
  );

  // 스크롤 이벤트 감지, 제일 하단으로
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBottom = () => {
    if (scrollRef.current) {
      const {scrollHeight, clientHeight} = scrollRef.current;
      scrollRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  useEffect(() => {
    scrollBottom();
  }, [messages]);

  // 메시지 창 스크롤 이벤트
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    console.log('스크롤 중', e.currentTarget.scrollTop);
  };

  // 메시지를 화면에 표시
  const displayMessage = (sender: string, message: string) => {
    setMessages(prevMessages => [...prevMessages, {sender, content: message}]);
  };

  // GPT와 대화
  const fetchResponse = async (message: string) => {
    try {
      const response = await fetch('http://localhost:9999/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({message}),
      });

      if (!response.ok) {
        throw new Error('Server response was not OK');
      }

      const data = await response.json();
      displayMessage('bot', data.reply.content);
    } catch (error) {
      console.error('Error fetching response:', error);
      displayMessage('bot', 'An error occurred. Please try again later.');
    }
  };

  // 메시지 전송 이벤트
  const handleSendMessage = () => {
    const message = userInput.trim();
    if (message) {
      displayMessage('user', message);
      fetchResponse(message);
      setUserInput(''); // 입력 필드 초기화
    }
  };

  // Enter 키로 메시지 전송
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className='mt-28 mx-32 flex-col justify-items-center'>
      <div className='font-bold mb-4 text-2xl'>난 T라미숙해</div>
      <div
        id='chat-window'
        ref={scrollRef}
        onScroll={handleScroll}
        className='border border-red-600 w-96 h-96 overflow-y-auto'
      >
        {messages.map((message, index) =>
          message.sender === 'bot' ? (
            <div
              key={index}
              className='border border-black h-auto w-auto p-2 m-2 rounded-md'
            >
              <div className='font-bold mb-2'>✨✨✨F의 답변✨✨✨</div>
              {message.content}
            </div>
          ) : (
            <div
              key={index}
              className='border border-black h-auto w-auto text-right p-2 m-2 rounded-md'
            >
              {message.content}
            </div>
          )
        )}
      </div>
      <input
        id='user-input'
        type='text'
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        onKeyPress={handleKeyPress}
        className='ml-10 mt-4 w-96 border border-gray-600 pl-2'
      />
      <button
        id='send-button'
        onClick={handleSendMessage}
        className='ml-1 font-bold'
      >
        Send
      </button>
    </div>
  );
}
