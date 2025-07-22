import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#333' }}>🚀 Dashboard de Mobilidade Urbana</h1>
      <p style={{ color: '#666' }}>Se você está vendo esta mensagem, o React está funcionando!</p>
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>✅ Status:</h2>
        <ul>
          <li>✅ React carregado</li>
          <li>✅ CSS aplicado</li>
          <li>✅ Componente renderizado</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
