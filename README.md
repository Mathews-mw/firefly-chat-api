src/
├─ server.ts             # Bootstrap do Fastify
├─ plugins/
│  └─ websocket.ts       # Registro do plugin @fastify/websocket
├─ modules/
│  └─ chat/
│     ├─ chat.types.ts   # Interfaces e eventos
│     ├─ chat.service.ts # Lógica de negócio (persistência, broadcast)
│     └─ chat.gateway.ts # Handlers de WebSocket
├─ utils/
│  └─ jwt.ts             # Funções de validação de token
└─ ...                   
