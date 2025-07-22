#!/usr/bin/env python3
"""
Dashboard de Mobilidade Urbana - Aplicação Principal
Sistema completo de dashboard com múltiplas fontes de dados
"""

import os
import sys
from datetime import datetime
from backend import create_app
from backend.models import db
from backend.services.sync_service import DataSyncService

# Configurar caminho para importações
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def setup_database():
    """Configura o banco de dados inicial"""
    print("🔧 Configurando banco de dados...")
    
    try:
        with app.app_context():
            # Criar todas as tabelas
            db.create_all()
            
            # Executar schema SQL se existir
            schema_path = os.path.join(os.path.dirname(__file__), 'database', 'schema.sql')
            if os.path.exists(schema_path):
                with open(schema_path, 'r', encoding='utf-8') as f:
                    sql_commands = f.read()
                
                # Executar comandos SQL (dividir por ';' e executar individualmente)
                commands = [cmd.strip() for cmd in sql_commands.split(';') if cmd.strip()]
                for command in commands:
                    try:
                        db.session.execute(command)
                    except Exception as e:
                        # Ignorar erros de tabelas já existentes
                        if 'already exists' not in str(e).lower():
                            print(f"⚠️  Aviso SQL: {e}")
                
                db.session.commit()
                print("✅ Schema SQL aplicado com sucesso")
        
        print("✅ Banco de dados configurado com sucesso")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao configurar banco de dados: {e}")
        return False

def sync_initial_data():
    """Sincroniza dados iniciais se necessário"""
    print("🔄 Verificando sincronização de dados...")
    
    try:
        with app.app_context():
            sync_service = DataSyncService()
            
            # Verificar se já existem dados
            from backend.models import Corrida
            corridas_count = db.session.query(Corrida).count()
            
            if corridas_count == 0:
                print("📥 Nenhum dado encontrado. Executando sincronização inicial...")
                result = sync_service.sync_all_data(force=True)
                
                if result['success']:
                    print("✅ Sincronização inicial concluída")
                else:
                    print(f"⚠️  Sincronização com problemas: {result.get('error', 'Erro desconhecido')}")
            else:
                print(f"✅ Dados já existem ({corridas_count} corridas)")
        
        return True
        
    except Exception as e:
        print(f"⚠️  Erro na sincronização inicial: {e}")
        return False

def run_development_server():
    """Executa o servidor de desenvolvimento"""
    print("🚀 Iniciando servidor de desenvolvimento...")
    print("📡 API disponível em: http://localhost:5000")
    print("🌐 Frontend deve ser executado em: http://localhost:3000")
    print("📋 Pressione Ctrl+C para parar")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=True
    )

def run_production_server():
    """Executa o servidor de produção"""
    try:
        import gunicorn
        print("🚀 Iniciando servidor de produção com Gunicorn...")
        os.system("gunicorn -w 4 -b 0.0.0.0:5000 'main:app'")
    except ImportError:
        print("⚠️  Gunicorn não instalado. Usando servidor de desenvolvimento...")
        run_development_server()

def show_help():
    """Mostra ajuda de uso"""
    print("""
🚀 Dashboard de Mobilidade Urbana

Comandos disponíveis:
    python main.py                     - Executar servidor de desenvolvimento
    python main.py --production        - Executar servidor de produção
    python main.py --setup-db          - Configurar banco de dados
    python main.py --sync              - Sincronizar dados
    python main.py --help              - Mostrar esta ajuda

Endpoints da API:
    GET  /api/dashboard/overview       - Overview geral do dashboard
    GET  /api/dashboard/municipios     - Lista de municípios
    GET  /api/dashboard/metricas-diarias - Métricas diárias
    POST /api/import/upload            - Upload de planilhas
    POST /api/sync/execute             - Executar sincronização
    GET  /api/metrics/kpis             - KPIs principais

Documentação completa:
    📖 README.md
    📊 Dashboard de Métricas - Empresa de Transporte.md
    🛠️  Guia de Instalação - Dashboard de Transporte.md
    """)

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 DASHBOARD DE MOBILIDADE URBANA")
    print("=" * 60)
    
    # Criar aplicação
    app = create_app()
    
    # Verificar argumentos da linha de comando
    args = sys.argv[1:]
    
    if '--help' in args or '-h' in args:
        show_help()
        sys.exit(0)
    
    elif '--setup-db' in args:
        success = setup_database()
        sys.exit(0 if success else 1)
    
    elif '--sync' in args:
        if setup_database():
            success = sync_initial_data()
            sys.exit(0 if success else 1)
        else:
            sys.exit(1)
    
    elif '--production' in args:
        # Configurar banco e dados antes de executar
        if setup_database():
            sync_initial_data()
            run_production_server()
        else:
            print("❌ Falha na configuração. Abortando...")
            sys.exit(1)
    
    else:
        # Modo desenvolvimento (padrão)
        if setup_database():
            sync_initial_data()
            run_development_server()
        else:
            print("❌ Falha na configuração. Abortando...")
            sys.exit(1)
